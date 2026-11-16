# doormutex-site

Website of [doormutex](https://github.com/padalton/doormutex) – *a mutex for your door*: an open-source traffic light for the home office.

A static site built with [Hugo](https://gohugo.io/), English (`/`) and German (`/de/`), to be hosted on Cloudflare Pages at **doormutex.org**.

![The home page](docs/home.png)

## Principles

- **Nothing from other origins.** No web fonts, no CDN, no embeds, no analytics script – the system font stack and files from this repository only. CI fails if a page loads anything from another origin.
- **No cookies, and JavaScript on one page only.** The traffic-light animation is plain CSS and respects `prefers-reduced-motion`. A strict Content Security Policy (`script-src 'none'`) in [`static/_headers`](static/_headers) enforces it on every page – except the [Google sign-in relay](#google-sign-in-relay) at `/oauth/`, which gets `script-src 'self'` for one fingerprinted script from this repository (with SRI, no inline code, `connect-src 'none'`). CI fails if any other page has a script or the exception grows.
- **No cookie banner needed** – there is nothing to consent to. Statistics come only from Cloudflare's server-side traffic analytics.
- **Own theme** in [`layouts/`](layouts/) and [`assets/css/site.css`](assets/css/site.css): light and dark mode, mobile first, accessible.

## Structure

```
config/_default/hugo.toml        site config, languages, legal params
config/development/server.toml   the same CSP for `hugo server`
content/en/, content/de/         pages (same file name = translation)
i18n/                            UI strings
layouts/                         templates, partials, shortcodes
assets/                          CSS, screenshots, relay script (fingerprinted)
static/                          _headers (Cloudflare), icon
scripts/check_site.py            CI check: origins, inline code, scripts, headers, links
tests/                           unit tests of the relay script (node --test)
```

## Develop

Hugo **0.169.0** (the standard edition is enough – no SCSS):

```bash
go install github.com/gohugoio/hugo@v0.169.0   # or a release binary
hugo server                                    # http://localhost:1313/
hugo --gc --minify && python3 scripts/check_site.py
node --test tests/oauth.test.mjs                # Node.js 20 or newer
```

`hugo server` sends the same Content Security Policy as production, so a violation shows up in the browser console. CI checks that both stay in sync.

## Before publishing: legal notice and privacy policy

1. Fill in `params.legal` in [`config/_default/hugo.toml`](config/_default/hugo.toml) – name, place of residence, e-mail. Until then the legal pages show a yellow placeholder, the build logs a warning, and the production build (`--panicOnWarning`) **refuses to build** – placeholders can't go live by accident.
2. Read the [legal notice](content/en/legal-notice.md) and the [privacy policy](content/en/privacy.md) (German: [Impressum](content/de/legal-notice.md), [Datenschutzerklärung](content/de/privacy.md)). **They are a starting point written without legal advice** – review them before publishing. They assume a non-commercial site of a private person in Austria (§ 25 MedienG). If the site ever sells something (kits, devices), the E-Commerce Act (§ 5 ECG) and more apply.
3. The privacy policy has a section on the software's use of Google user data with the Limited Use statement, as Google asks for when verifying the OAuth client. Its URL: `https://doormutex.org/privacy/#google`. If the software's Google access changes (scope, fields), update it.

4. The [terms of service](content/en/terms.md) ([Nutzungsbedingungen](content/de/terms.md)) – also written without legal advice – cover the website and the self-hosted software. Google needs them, together with the privacy policy, to publish the OAuth client.

## Google sign-in relay

doormutex hubs are self-hosted, usually at a LAN address without public HTTPS, so Google can't redirect to them. Like [my.home-assistant.io](https://my.home-assistant.io/), the page `https://doormutex.org/oauth/` ([`layouts/oauth.html`](layouts/oauth.html), [`assets/js/oauth.js`](assets/js/oauth.js)) relays the sign-in **in the user's browser** – nothing reaches a server of ours apart from the page request itself.

1. **Connect:** the hub's web UI opens `https://doormutex.org/oauth/#hub=<hub base URL>&go=<Google auth URL>` (both `encodeURIComponent`-encoded). The page drops the hash from the address, checks `hub` (http/https, no credentials, query or fragment; normalised to origin + path + `/`) and `go` (`https://accounts.google.com/…` with `redirect_uri` = this page and a non-empty `state`). An unknown hub needs a click on *Continue* first; it is then remembered in `localStorage["doormutex.hub"]`. The page stores `{state, hub, expires}` (10 minutes) in `localStorage["doormutex.pending"]` and goes to `go`.
2. **Callback:** Google redirects to `/oauth/?state=…&code=…` (or `&error=…`). If the pending sign-in exists, is unexpired and has the same `state`, the page replaces itself with `<hub>#google-login?code=…&state=…` (or `error=…&state=…`) – only these fields, nothing else from Google's answer. The pending sign-in is removed in any case; otherwise the page says that no sign-in is in progress.
3. Without parameters it explains itself. Texts are English or German by browser language; without `localStorage` or JavaScript it says so.

The code alone is useless – the hub exchanges it with its PKCE verifier and client secret. `/oauth/` is English only, not in menus or the sitemap, and is sent with `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex` and `Cache-Control: no-store`. Its headers come from the last rule in [`static/_headers`](static/_headers): Cloudflare **joins** the headers of all matching rules (two CSPs would both apply and block the script), so that rule first detaches every header it sets with `! Header-Name`.

**Google client:** in the Cloud project (*Google Auth Platform → Clients*) the OAuth client has the type **Web application** with exactly one authorized redirect URI: `https://doormutex.org/oauth/`.

## Google OAuth branding

To publish the OAuth client (*Google Auth Platform*), so that refresh tokens no longer expire after 7 days:

| Field (*Branding*) | Value |
|---|---|
| App home page | `https://doormutex.org/` |
| Privacy policy | `https://doormutex.org/privacy/` |
| Terms of service | `https://doormutex.org/terms/` |
| Authorized domain | `doormutex.org` |

The domain must be verified in [Google Search Console](https://search.google.com/search-console) (property type *Domain*, TXT record in the Cloudflare zone) with the same Google account that owns the Cloud project. Then *Audience → Publish app*.

## Deploy: Cloudflare Pages

Cloudflare Pages with its Git integration: Cloudflare builds every push itself, so **no secrets are needed in GitHub**, pull requests get preview deployments, and the `_headers` file is supported directly. (Workers static assets would work too, but need a `wrangler` config and gain nothing for a static site.)

1. **Domain:** buy `doormutex.org` at Cloudflare Registrar, so the zone is in the same account.
2. **Project:** *Workers & Pages → Create → Pages → Connect to Git* → allow the Cloudflare GitHub app access to `padalton/doormutex-site` only.
3. **Build settings:**

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | Hugo |
   | Build command | `hugo --gc --minify --panicOnWarning` |
   | Build output directory | `public` |
   | Environment variable | `HUGO_VERSION` = `0.169.0` (Production and Preview) |

4. **Custom domains** (project → *Custom domains*): add `doormutex.org` and `www.doormutex.org`; Cloudflare creates the DNS records.
5. **www → apex:** *Rules → Redirect Rules → Create from template → "Redirect from WWW to root"* (301, keeps path and query).
6. **TLS:** *SSL/TLS → Edge Certificates*: *Always Use HTTPS* on, minimum TLS 1.2. HSTS comes from `_headers`; don't add the site to the preload list before it has been stable for a while.
7. **Keep Cloudflare from injecting scripts** – each of these would add JavaScript or third-party requests, and the CSP would block them anyway:
   - **Web Analytics** for the Pages project: **off** (it injects a JS beacon from `static.cloudflareinsights.com`). Use the zone's *Analytics & Logs → Traffic* instead – server-side, no cookies, nothing in the browser.
   - *Scrape Shield → Email Address Obfuscation*: **off** (it rewrites `mailto:` links with a script).
   - *Rocket Loader*, *Zaraz*, *Bot Fight Mode* / JavaScript detections: **off**.

Preview deployments on `*.pages.dev` get `X-Robots-Tag: noindex` from `_headers`.

## Licences

[REUSE](https://reuse.software/)-compliant, see [`REUSE.toml`](REUSE.toml):

- code (templates, styles, configuration, scripts): [Apache-2.0](LICENSES/Apache-2.0.txt)
- content (texts, images): [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt)

The traffic-light icon (`static/icon.svg`, Apache-2.0) and the screenshots (`assets/images/`, CC BY-SA 4.0) come from the [doormutex](https://github.com/padalton/doormutex) project.
