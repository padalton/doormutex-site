#!/usr/bin/env python3
"""Checks the built site (default: public/).

Fails when
  - a page loads anything from another origin (src, srcset, <link href>,
    CSS url()) – the site promises "nothing loaded from other websites",
  - a page contains <script>, <style> or style="…" (blocked by the CSP),
  - an internal link or anchor points nowhere,
  - the CSP in static/_headers and config/development/server.toml differ
    (apart from upgrade-insecure-requests, which only makes sense on HTTPS).
"""

import pathlib
import re
import sys
import tomllib
from html.parser import HTMLParser
from urllib.parse import unquote, urljoin, urlsplit

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "public").resolve()
OWN_HOSTS = {"doormutex.org", "www.doormutex.org"}

errors: list[str] = []


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.loads: list[str] = []  # fetched by the browser
        self.links: list[str] = []  # followed by the user
        self.ids: set[str] = set()
        self.forbidden: list[str] = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag in ("script", "style"):
            self.forbidden.append(f"<{tag}>")
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


def csp_from_headers() -> str:
    for line in (ROOT / "static" / "_headers").read_text(encoding="utf-8").splitlines():
        if line.strip().startswith("Content-Security-Policy:"):
            return line.split(":", 1)[1].strip()
    return ""


def normalise(csp: str) -> set[str]:
    return {d.strip() for d in csp.split(";") if d.strip() and d.strip() != "upgrade-insecure-requests"}


dev = tomllib.loads((ROOT / "config" / "development" / "server.toml").read_text(encoding="utf-8"))
dev_csp = dev["headers"][0]["values"]["Content-Security-Policy"]
if normalise(csp_from_headers()) != normalise(dev_csp):
    errors.append("CSP in static/_headers and config/development/server.toml differ")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"ok: {len(pages)} pages, no external assets, no inline code, all internal links resolve")
