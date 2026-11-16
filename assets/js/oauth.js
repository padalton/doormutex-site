// Google sign-in relay for doormutex hubs – the only script on doormutex.org,
// loaded only by /oauth/. See README.md ("Google sign-in relay") for the contract.
//
// The hub's web UI opens  /oauth/#hub=<hub base URL>&go=<Google auth URL>.
// This page remembers the pending sign-in in localStorage and goes to Google;
// Google redirects back to /oauth/?state=…&code=… and the page hands code and
// state to the hub at <hub>#google-login?code=…&state=…. Everything happens in
// the browser: the page sends nothing to doormutex.org (its CSP has
// connect-src 'none').
//
// In node (tests) the file exports its functions instead of running.
(function () {
  "use strict";

  const HUB_KEY = "doormutex.hub";
  const PENDING_KEY = "doormutex.pending";
  const PENDING_TTL_MS = 10 * 60 * 1000;
  const GOOGLE_HOST = "accounts.google.com";
  const DOCS = "https://github.com/padalton/doormutex/blob/main/docs/google-calendar.md";

  const TEXT = {
    en: {
      title: "Google sign-in for your doormutex hub",
      about: [
        "This page relays a Google sign-in to your own doormutex hub. Hubs run at home, usually at an address Google can't send you back to – so Google sends the sign-in here, and this page passes it on to your hub, inside your browser. Nothing is sent to doormutex.org.",
        "There is nothing to do here on its own: start the sign-in in your hub's web UI.",
      ],
      docs: "How to connect Google Calendar",
      confirmTitle: "Connect a Google account?",
      confirm: "Your doormutex hub at {hub} wants to connect a Google account. Google sends the sign-in back to this page, which hands it to your hub – in this browser, nothing goes to doormutex.org.",
      confirmCheck: "Continue only if this is the address of your own hub.",
      continue: "Continue",
      cancel: "Cancel",
      cancelled: "Cancelled – nothing was sent anywhere. You can close this tab.",
      backToHub: "Back to your hub",
      toGoogle: "Continuing to Google …",
      toHub: "Handing the sign-in to your hub …",
      badHub: "The hub address in this link isn't valid: it must be an http or https address without user name, query or fragment.",
      badGo: "The sign-in link isn't valid: it must lead to accounts.google.com, send the answer back to this page and carry a state value.",
      noPending: "No sign-in in progress in this browser – start again in your hub's web UI.",
      badAnswer: "Google's answer is incomplete – start again in your hub's web UI.",
      storage: "This browser doesn't let the page store data (localStorage), for example because site data is blocked. The sign-in relay can't work without it – allow site data for doormutex.org or use another browser.",
      startAgain: "Then start again in your hub's web UI.",
    },
    de: {
      title: "Google-Anmeldung für deinen doormutex-Hub",
      about: [
        "Diese Seite leitet eine Google-Anmeldung an deinen eigenen doormutex-Hub weiter. Hubs laufen bei dir zu Hause, meist unter einer Adresse, zu der Google nicht zurückleiten kann – deshalb schickt Google die Anmeldung hierher, und diese Seite gibt sie in deinem Browser an deinen Hub weiter. An doormutex.org wird nichts gesendet.",
        "Für sich allein gibt es hier nichts zu tun: Starte die Anmeldung im Web-UI deines Hubs.",
      ],
      docs: "Anleitung: Google Kalender verbinden (Englisch)",
      confirmTitle: "Google-Konto verbinden?",
      confirm: "Dein doormutex-Hub unter {hub} möchte ein Google-Konto verbinden. Google schickt die Anmeldung zurück an diese Seite, die sie an deinen Hub übergibt – in diesem Browser, an doormutex.org geht nichts.",
      confirmCheck: "Fahre nur fort, wenn das die Adresse deines eigenen Hubs ist.",
      continue: "Weiter",
      cancel: "Abbrechen",
      cancelled: "Abgebrochen – es wurde nichts gesendet. Du kannst diesen Tab schließen.",
      backToHub: "Zurück zu deinem Hub",
      toGoogle: "Weiter zu Google …",
      toHub: "Die Anmeldung wird an deinen Hub übergeben …",
      badHub: "Die Hub-Adresse in diesem Link ist ungültig: Sie muss eine http- oder https-Adresse ohne Benutzername, Query oder Fragment sein.",
      badGo: "Der Anmelde-Link ist ungültig: Er muss zu accounts.google.com führen, die Antwort an diese Seite zurückschicken und einen state-Wert enthalten.",
      noPending: "In diesem Browser läuft keine Anmeldung – starte sie im Web-UI deines Hubs neu.",
      badAnswer: "Googles Antwort ist unvollständig – starte die Anmeldung im Web-UI deines Hubs neu.",
      storage: "Dieser Browser lässt die Seite keine Daten speichern (localStorage), etwa weil Website-Daten blockiert sind. Ohne das kann die Weiterleitung nicht funktionieren – erlaube Website-Daten für doormutex.org oder nimm einen anderen Browser.",
      startAgain: "Starte die Anmeldung dann im Web-UI deines Hubs neu.",
    },
  };

  function language(navLanguage) {
    return (navLanguage || "").toLowerCase().startsWith("de") ? "de" : "en";
  }

  // --- Pure functions (unit-tested with node) --------------------------------

  // A hub base URL from the link, normalised to origin + path with a trailing
  // slash, or null. Only http(s), no credentials, no query, no fragment, and
  // never this site itself.
  function validateHub(value, selfOrigin) {
    if (typeof value !== "string" || value === "" || /[?#]/.test(value)) return null;
    let url;
    try {
      url = new URL(value);
    } catch (e) {
      return null;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password || url.search || url.hash) return null;
    if (url.origin === selfOrigin) return null;
    const path = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
    return url.origin + path;
  }

  // The Google authorization URL from the link: https://accounts.google.com/…
  // whose redirect_uri is this page and which carries a state. Returns
  // {url, state} or null.
  function validateGo(value, selfUrl) {
    if (typeof value !== "string") return null;
    let url;
    try {
      url = new URL(value);
    } catch (e) {
      return null;
    }
    if (url.protocol !== "https:" || url.host !== GOOGLE_HOST) return null;
    if (url.username || url.password) return null;
    const redirect = url.searchParams.getAll("redirect_uri");
    if (redirect.length !== 1 || redirect[0] !== selfUrl) return null;
    const state = url.searchParams.getAll("state");
    if (state.length !== 1 || state[0] === "") return null;
    return { url: url.href, state: state[0] };
  }

  // The hub of the pending sign-in if it is valid, unexpired and has this
  // state; otherwise null.
  function matchPending(raw, state, now, selfOrigin) {
    if (!raw || !state) return null;
    let pending;
    try {
      pending = JSON.parse(raw);
    } catch (e) {
      return null;
    }
    if (!pending || typeof pending !== "object") return null;
    if (typeof pending.state !== "string" || pending.state !== state) return null;
    if (typeof pending.expires !== "number" || !(now <= pending.expires)) return null;
    return validateHub(pending.hub, selfOrigin);
  }

  // Where to send Google's answer: the hub with only code (or error) and state.
  function forwardUrl(hub, answer) {
    const state = answer.get("state");
    const error = answer.get("error");
    const code = answer.get("code");
    if (!state || (!error && !code)) return null;
    const fields = error ? { error: error, state: state } : { code: code, state: state };
    return hub + "#google-login?" + new URLSearchParams(fields);
  }

  // --- Flows (storage injected; unit-tested with a fake storage) -------------

  class StorageUnavailable extends Error {}

  // Every localStorage access goes through here: any failure (blocked site
  // data, quota, SecurityError when even touching window.localStorage) becomes
  // a StorageUnavailable that the page reports.
  function makeStorage(getStorage) {
    function guard(fn) {
      try {
        return fn(getStorage());
      } catch (e) {
        throw new StorageUnavailable(String(e));
      }
    }
    return {
      get: (key) => guard((s) => s.getItem(key)),
      set: (key, value) => guard((s) => s.setItem(key, value)),
      remove: (key) => guard((s) => s.removeItem(key)),
    };
  }

  // Store the hub and the pending sign-in; returns the URL to go to.
  function begin(hub, go, storage, now) {
    storage.set(HUB_KEY, hub);
    storage.set(PENDING_KEY, JSON.stringify({ state: go.state, hub: hub, expires: now + PENDING_TTL_MS }));
    return go.url;
  }

  function connect(params, self, storage, now) {
    const hub = validateHub(params.get("hub"), self.origin);
    if (!hub) return { kind: "error", text: "badHub" };
    const go = validateGo(params.get("go"), self.origin + self.pathname);
    if (!go) return { kind: "error", text: "badGo" };
    if (storage.get(HUB_KEY) === hub) return { kind: "go", url: begin(hub, go, storage, now) };
    return { kind: "confirm", hub: hub, go: go };
  }

  function callback(answer, self, storage, now) {
    const raw = storage.get(PENDING_KEY);
    storage.remove(PENDING_KEY);
    const hub = matchPending(raw, answer.get("state"), now, self.origin);
    if (!hub) return { kind: "error", text: "noPending" };
    const url = forwardUrl(hub, answer);
    return url ? { kind: "forward", url: url } : { kind: "error", text: "badAnswer" };
  }

  // Decide what to do for this page address. `loc` has origin, pathname,
  // hash and search, as captured before the address is cleaned.
  function route(loc, storage, now) {
    const hash = new URLSearchParams(loc.hash.replace(/^#/, ""));
    const query = new URLSearchParams(loc.search);
    try {
      if (hash.has("hub") || hash.has("go")) return connect(hash, loc, storage, now);
      if (query.has("state") || query.has("code") || query.has("error")) return callback(query, loc, storage, now);
    } catch (e) {
      if (e instanceof StorageUnavailable) return { kind: "error", text: "storage" };
      throw e;
    }
    return { kind: "about" };
  }

  // --- Page ------------------------------------------------------------------

  function main() {
    const t = TEXT[language(navigator.language)];
    const box = document.getElementById("relay");
    const loc = {
      origin: location.origin,
      pathname: location.pathname,
      hash: location.hash,
      search: location.search,
    };
    // Drop hub, Google URL, code and state from the address bar and history.
    if (loc.hash || loc.search) history.replaceState(null, "", loc.pathname);

    document.documentElement.lang = t === TEXT.de ? "de" : "en";
    document.title = t.title + " · DoorMutex";
    document.getElementById("relay-title").textContent = t.title;

    const storage = makeStorage(() => window.localStorage);
    const action = route(loc, storage, Date.now());
    switch (action.kind) {
      case "go":
        go(action.url);
        break;
      case "forward":
        show(p(t.toHub));
        location.replace(action.url);
        break;
      case "confirm":
        ask(action);
        break;
      case "error": {
        const hint = action.text === "badHub" || action.text === "badGo" ? [p(t.startAgain)] : [];
        show(p(t[action.text], "relay-box relay-error", "alert"), ...hint, docsLink());
        break;
      }
      default:
        show(...t.about.map((text) => p(text)), docsLink());
    }

    function go(url) {
      show(p(t.toGoogle));
      location.assign(url);
    }

    function ask(action) {
      const [before, after] = t.confirm.split("{hub}");
      const yes = button(t.continue, "button primary");
      const no = button(t.cancel, "button");
      yes.addEventListener("click", () => {
        let url;
        try {
          url = begin(action.hub, action.go, storage, Date.now());
        } catch (e) {
          if (!(e instanceof StorageUnavailable)) throw e;
          return show(p(t.storage, "relay-box relay-error", "alert"), docsLink());
        }
        go(url);
      });
      no.addEventListener("click", () => {
        const back = el("a", { href: action.hub }, t.backToHub);
        show(p(t.cancelled, "relay-box"), el("p", {}, back));
      });
      show(
        el("h2", {}, t.confirmTitle),
        el("p", { class: "relay-hub" }, el("code", {}, action.hub)),
        el("p", {}, before, el("strong", {}, action.hub), after),
        p(t.confirmCheck),
        el("p", { class: "actions" }, yes, no)
      );
      yes.focus();
    }

    function docsLink() {
      return el("p", {}, el("a", { href: DOCS, hreflang: "en" }, t.docs));
    }

    function show(...nodes) {
      box.replaceChildren(...nodes);
    }
  }

  // Elements are built with the DOM API and textContent only – no HTML strings.
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
    node.append(...children);
    return node;
  }

  function p(text, className, role) {
    const attrs = {};
    if (className) attrs.class = className;
    if (role) attrs.role = role;
    return el("p", attrs, text);
  }

  function button(text, className) {
    return el("button", { type: "button", class: className }, text);
  }

  const api = {
    TEXT, HUB_KEY, PENDING_KEY, PENDING_TTL_MS,
    language, validateHub, validateGo, matchPending, forwardUrl,
    makeStorage, StorageUnavailable, begin, connect, callback, route,
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  else main();
})();
