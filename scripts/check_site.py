#!/usr/bin/env python3
"""Checks the built site (default: public/).

Fails when
  - a page loads anything from another origin (src, srcset, <link href>,
    CSS url()) – the site promises "nothing loaded from other websites",
  - a page contains <style>, style="…", on…= handlers or javascript: links
    (blocked by the CSP),
  - a page has a <script>, except the Google sign-in relay (SCRIPT_PAGES):
    there only external, same-origin scripts with a matching integrity hash
    and no inline code,
  - an internal link or anchor points nowhere,
  - the headers from static/_headers (resolved like Cloudflare does: rules in
    file order, values of several rules joined, "!" detaches) don't give every
    page exactly one CSP with script-src 'none' – or, on the relay, one CSP
    that equals the global one except for script-src 'self' and a few
    stricter directives, plus no-referrer, noindex and no-store,
  - the relay is listed in a sitemap,
  - the headers in static/_headers and config/development/server.toml differ
    (apart from upgrade-insecure-requests, which only makes sense on HTTPS).
"""

import base64
import hashlib
import pathlib
import re
import sys
import tomllib
from html.parser import HTMLParser
from urllib.parse import unquote, urljoin, urlsplit

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "public").resolve()
OWN_HOSTS = {"doormutex.org", "www.doormutex.org"}
# The only pages allowed to run a script (same-origin file with SRI only).
SCRIPT_PAGES = {"/oauth/index.html"}
# Directives the relay's CSP may add on top of the global one (stricter only).
RELAY_EXTRA = {"connect-src 'none'", "require-trusted-types-for 'script'"}
RELAY_HEADERS = {"referrer-policy": "no-referrer", "x-robots-tag": "noindex", "cache-control": "no-store"}

errors: list[str] = []


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.loads: list[str] = []  # fetched by the browser
        self.links: list[str] = []  # followed by the user
        self.ids: set[str] = set()
        self.forbidden: list[str] = []
        self.scripts: list[dict] = []
        self.inline_script = False
        self._in_script = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "style":
            self.forbidden.append(f"<{tag}>")
        if tag == "script":
            self.scripts.append(a)
            self._in_script = True
        if any((v or "").strip().lower().startswith("javascript:") for v in a.values()):
            self.forbidden.append(f"<{tag}> with a javascript: URL")
        if "style" in a:
            self.forbidden.append(f'<{tag} style="…">')
        if any(k.startswith("on") for k in a):
            self.forbidden.append(f"<{tag} on…=> handler")
        for key in ("src", "poster", "data"):
            if a.get(key):
                self.loads.append(a[key])
        if a.get("srcset"):
            self.loads += [part.strip().split(" ")[0] for part in a["srcset"].split(",")]
        if tag == "link" and a.get("href"):
            rel = (a.get("rel") or "").split()
            # canonical/alternate are references, not requests – still checked as links
            (self.links if {"canonical", "alternate"} & set(rel) else self.loads).append(a["href"])
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_script = False

    def handle_data(self, data):
        if self._in_script and data.strip():
            self.inline_script = True


def external(url: str) -> bool:
    parts = urlsplit(url)
    if url.startswith("//"):
        return True
    return bool(parts.scheme) and parts.scheme in ("http", "https") and parts.hostname not in OWN_HOSTS


def target(page_url: str, url: str) -> tuple[pathlib.Path, str] | None:
    """The file and fragment an internal URL points to, or None if external."""
    parts = urlsplit(urljoin(page_url, url))
    if parts.scheme not in ("", "https", "http") or (parts.hostname and parts.hostname not in OWN_HOSTS):
        return None
    path = unquote(parts.path)
    file = SITE / path.lstrip("/")
    if path.endswith("/"):
        file = file / "index.html"
    return file, unquote(parts.fragment)


pages: dict[pathlib.Path, Page] = {}
for html in sorted(SITE.rglob("*.html")):
    p = Page()
    p.feed(html.read_text(encoding="utf-8"))
    pages[html] = p

for html, p in pages.items():
    rel = "/" + html.relative_to(SITE).as_posix()
    page_url = "https://doormutex.org" + rel
    for f in p.forbidden:
        errors.append(f"{rel}: {f} is not allowed (CSP)")
    if p.scripts and rel not in SCRIPT_PAGES:
        errors.append(f"{rel}: <script> is not allowed (CSP script-src 'none'; scripts only on {sorted(SCRIPT_PAGES)})")
    elif p.scripts:
        if p.inline_script:
            errors.append(f"{rel}: inline script is not allowed (CSP script-src 'self')")
        for script in p.scripts:
            src, sri = script.get("src") or "", script.get("integrity") or ""
            t = target(page_url, src) if src else None
            if not src or external(src) or t is None or urlsplit(src).scheme:
                errors.append(f"{rel}: script must be a same-origin file: {src or '(inline)'}")
            elif not t[0].is_file():
                errors.append(f"{rel}: missing script {src}")
            elif sri != "sha256-" + base64.b64encode(hashlib.sha256(t[0].read_bytes()).digest()).decode():
                errors.append(f"{rel}: script {src} lacks a matching sha256 integrity hash")
    for url in p.loads:
        if external(url):
            errors.append(f"{rel}: loads from another origin: {url}")
        elif (t := target(page_url, url)) and not t[0].is_file():
            errors.append(f"{rel}: missing asset {url}")
    for url in p.links:
        if url.startswith(("mailto:", "tel:")):
            continue
        t = target(page_url, url)
        if t is None:
            continue
        file, fragment = t
        if not file.is_file():
            errors.append(f"{rel}: broken link {url}")
        elif fragment and file.suffix == ".html" and fragment not in pages[file.resolve()].ids:
            errors.append(f"{rel}: broken anchor {url}")

for css in SITE.rglob("*.css"):
    for url in re.findall(r"url\(\s*['\"]?([^'\")]+)", css.read_text(encoding="utf-8")):
        if external(url):
            errors.append(f"/{css.relative_to(SITE)}: loads from another origin: {url}")


def parse_headers() -> list[tuple[str, list[tuple[str, str | None]]]]:
    """static/_headers as [(pattern, [(header, value or None for "! detach")])]."""
    rules: list[tuple[str, list[tuple[str, str | None]]]] = []
    for line in (ROOT / "static" / "_headers").read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line[0].isspace():
            rules.append((line.strip(), []))
        elif line.strip().startswith("!"):
            rules[-1][1].append((line.strip()[1:].strip().lower(), None))
        else:
            name, value = line.split(":", 1)
            rules[-1][1].append((name.strip().lower(), value.strip()))
    return rules


def cloudflare_headers(path: str) -> dict[str, list[str]]:
    """Headers Cloudflare Pages sends for a path on doormutex.org: rules in
    file order, values of several matching rules joined, "!" removes what
    earlier rules added. Rules for other hosts (*.pages.dev) don't match."""
    result: dict[str, list[str]] = {}
    for pattern, ops in HEADER_RULES:
        if "://" in pattern:
            continue
        regex = "".join(".*" if c == "*" else re.escape(c) for c in pattern)
        regex = re.sub(r":\\?[A-Za-z]\w*", "[^/]+", regex)
        if not re.fullmatch(regex, path):
            continue
        for name, value in ops:
            if value is None:
                result.pop(name, None)
            else:
                result.setdefault(name, []).append(value)
    return result


def hugo_headers(path: str) -> dict[str, str]:
    """Headers `hugo server` sends: every matching rule in order, later values
    replace earlier ones."""
    result: dict[str, str] = {}
    for rule in DEV["headers"]:
        regex = re.escape(rule["for"]).replace(r"\*\*", ".*").replace(r"\*", "[^/]*")
        if re.fullmatch(regex, path):
            result.update({k.lower(): v for k, v in rule["values"].items()})
    return result


def normalise(csp: str) -> set[str]:
    return {" ".join(d.split()) for d in csp.split(";") if d.strip() and d.strip() != "upgrade-insecure-requests"}


def single(headers: dict[str, list[str]], name: str, where: str) -> str:
    values = headers.get(name, [])
    if len(values) != 1:
        errors.append(f"{where}: expected exactly one {name} from static/_headers, got {values}")
        return values[0] if values else ""
    return values[0]


HEADER_RULES = parse_headers()
DEV = tomllib.loads((ROOT / "config" / "development" / "server.toml").read_text(encoding="utf-8"))

global_csp = normalise(single(cloudflare_headers("/"), "content-security-policy", "/"))
if "script-src 'none'" not in global_csp:
    errors.append("static/_headers: the global CSP must have script-src 'none'")

for html in pages:
    path = "/" + html.relative_to(SITE).as_posix()
    url_path = path.removesuffix("index.html")
    headers = cloudflare_headers(url_path)
    csp = normalise(single(headers, "content-security-policy", url_path))
    if path not in SCRIPT_PAGES:
        if csp != global_csp:
            errors.append(f"{url_path}: CSP differs from the global one: {sorted(csp ^ global_csp)}")
        continue
    if csp - RELAY_EXTRA != (global_csp - {"script-src 'none'"}) | {"script-src 'self'"}:
        errors.append(f"{url_path}: CSP may only differ from the global one by script-src 'self' "
                      f"and {sorted(RELAY_EXTRA)}: {sorted(csp ^ global_csp)}")
    for name, value in RELAY_HEADERS.items():
        if single(headers, name, url_path) != value:
            errors.append(f"{url_path}: {name} must be {value!r}")
    for name, value in RELAY_HEADERS.items():
        if hugo_headers(url_path).get(name) != value:
            errors.append(f"{url_path}: {name} in config/development/server.toml must be {value!r}")
    for sitemap in SITE.rglob("sitemap*.xml"):
        if url_path in sitemap.read_text(encoding="utf-8"):
            errors.append(f"/{sitemap.relative_to(SITE)}: lists {url_path}")

for path in sorted(SCRIPT_PAGES):
    if not (SITE / path.lstrip("/")).is_file():
        errors.append(f"{path}: missing (listed in SCRIPT_PAGES)")

for path in ["/", *(p.removesuffix("index.html") for p in sorted(SCRIPT_PAGES))]:
    dev = hugo_headers(path).get("content-security-policy", "")
    if normalise(dev) != normalise(";".join(cloudflare_headers(path).get("content-security-policy", []))):
        errors.append(f"{path}: CSP in static/_headers and config/development/server.toml differ")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"ok: {len(pages)} pages, no external assets, no inline code, scripts only on {', '.join(sorted(SCRIPT_PAGES))}, "
      "headers in sync, all internal links resolve")
