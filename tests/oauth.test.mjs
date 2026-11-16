// Unit tests for the Google sign-in relay (assets/js/oauth.js).
// Run: node --test tests/oauth.test.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const relay = createRequire(import.meta.url)("../assets/js/oauth.js");
const { validateHub, validateGo, matchPending, forwardUrl, makeStorage, route, HUB_KEY, PENDING_KEY, PENDING_TTL_MS } = relay;

const ORIGIN = "https://doormutex.org";
const SELF = ORIGIN + "/oauth/";
const PAGE = { origin: ORIGIN, pathname: "/oauth/" };
const NOW = 1_800_000_000_000;

function googleUrl(params = {}) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const defaults = { client_id: "id.apps.googleusercontent.com", redirect_uri: SELF, response_type: "code", state: "s1", code_challenge: "c", code_challenge_method: "S256" };
  for (const [k, v] of Object.entries({ ...defaults, ...params })) if (v !== undefined) url.searchParams.set(k, v);
  return url.href;
}

function connectHash(hub, go) {
  return "#hub=" + encodeURIComponent(hub) + "&go=" + encodeURIComponent(go);
}

// localStorage stand-in; `broken` makes every access throw like blocked site data.
function fakeStorage(initial = {}, broken = false) {
  const data = new Map(Object.entries(initial));
  const backend = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  };
  const storage = makeStorage(() => {
    if (broken) throw new Error("SecurityError: The operation is insecure.");
    return backend;
  });
  return { storage, data };
}

function at(hash = "", search = "") {
  return { ...PAGE, hash, search };
}

test("validateHub accepts http(s) base URLs and normalises them", () => {
  assert.equal(validateHub("http://192.168.1.20:8080", ORIGIN), "http://192.168.1.20:8080/");
  assert.equal(validateHub("http://hub.local:8080/doormutex", ORIGIN), "http://hub.local:8080/doormutex/");
  assert.equal(validateHub("https://Hub.Example.org:443/a/b/", ORIGIN), "https://hub.example.org/a/b/");
  assert.equal(validateHub("http://[fd00::1]:8080/", ORIGIN), "http://[fd00::1]:8080/");
});

test("validateHub rejects everything else", () => {
  for (const bad of [
    null, undefined, "", "hub.local:8080", "/relative", "ftp://hub/", "javascript:alert(1)", "data:text/html,x",
    "http://user:pw@hub/", "http://user@hub/", "http://hub/?x=1", "http://hub/?", "http://hub/#x", "http://hub/#",
    "https://doormutex.org/", "https://doormutex.org/oauth/", "http://", "not a url",
  ]) {
    assert.equal(validateHub(bad, ORIGIN), null, String(bad));
  }
});

test("validateGo accepts Google URLs back to this page with a state", () => {
  const go = validateGo(googleUrl(), SELF);
  assert.deepEqual(go, { url: googleUrl(), state: "s1" });
});

test("validateGo rejects other hosts, schemes, redirect URIs and missing state", () => {
  for (const bad of [
    googleUrl().replace("accounts.google.com", "accounts.google.com.evil.example"),
    googleUrl().replace("accounts.google.com", "evil.example"),
    googleUrl().replace("https://accounts.google.com", "https://user@accounts.google.com"),
    googleUrl().replace("https://accounts.google.com", "https://accounts.google.com:8443"),
    googleUrl().replace("https:", "http:"),
    googleUrl({ redirect_uri: "https://evil.example/" }),
    googleUrl({ redirect_uri: "https://doormutex.org/oauth" }),
    googleUrl({ redirect_uri: "https://doormutex.org/oauth/?x" }),
    googleUrl({ redirect_uri: undefined }),
    googleUrl({ state: undefined }),
    googleUrl({ state: "" }),
    googleUrl() + "&redirect_uri=" + encodeURIComponent("https://evil.example/"),
    googleUrl() + "&state=other",
    "not a url", null,
  ]) {
    assert.equal(validateGo(bad, SELF), null, String(bad));
  }
});

test("matchPending needs the same state, no expiry and a valid hub", () => {
  const pending = (p) => JSON.stringify({ state: "s1", hub: "http://hub.local/", expires: NOW + 1000, ...p });
  assert.equal(matchPending(pending(), "s1", NOW, ORIGIN), "http://hub.local/");
  assert.equal(matchPending(pending(), "s2", NOW, ORIGIN), null);
  assert.equal(matchPending(pending({ expires: NOW - 1 }), "s1", NOW, ORIGIN), null);
  assert.equal(matchPending(pending({ expires: "later" }), "s1", NOW, ORIGIN), null);
  assert.equal(matchPending(pending({ hub: "javascript:alert(1)" }), "s1", NOW, ORIGIN), null);
  assert.equal(matchPending(pending(), "", NOW, ORIGIN), null);
  assert.equal(matchPending(pending(), null, NOW, ORIGIN), null);
  assert.equal(matchPending(null, "s1", NOW, ORIGIN), null);
  assert.equal(matchPending("{broken", "s1", NOW, ORIGIN), null);
  assert.equal(matchPending("null", "s1", NOW, ORIGIN), null);
});

test("forwardUrl forwards only code (or error) and state", () => {
  const answer = new URLSearchParams("state=s%201&code=4%2F0Ab&scope=x&authuser=0&prompt=consent&iss=y");
  assert.equal(forwardUrl("http://hub.local/", answer), "http://hub.local/#google-login?code=4%2F0Ab&state=s+1");
  assert.equal(forwardUrl("http://hub.local/", new URLSearchParams("state=s1&error=access_denied")), "http://hub.local/#google-login?error=access_denied&state=s1");
  assert.equal(forwardUrl("http://hub.local/", new URLSearchParams("state=s1")), null);
  assert.equal(forwardUrl("http://hub.local/", new URLSearchParams("code=c")), null);
});

test("route: no parameters → explanation", () => {
  const { storage } = fakeStorage({}, true); // storage is not even touched
  assert.deepEqual(route(at(), storage, NOW), { kind: "about" });
  assert.deepEqual(route(at("#other=1"), storage, NOW), { kind: "about" });
});

test("route: connect with an unknown hub asks first and stores nothing", () => {
  const { storage, data } = fakeStorage({ [HUB_KEY]: "http://other.local/" });
  const action = route(at(connectHash("http://hub.local:8080", googleUrl())), storage, NOW);
  assert.equal(action.kind, "confirm");
  assert.equal(action.hub, "http://hub.local:8080/");
  assert.deepEqual(action.go, { url: googleUrl(), state: "s1" });
  assert.equal(data.get(HUB_KEY), "http://other.local/");
  assert.equal(data.has(PENDING_KEY), false);
  // Continue:
  assert.equal(relay.begin(action.hub, action.go, storage, NOW), googleUrl());
  assert.equal(data.get(HUB_KEY), "http://hub.local:8080/");
  assert.deepEqual(JSON.parse(data.get(PENDING_KEY)), { state: "s1", hub: "http://hub.local:8080/", expires: NOW + PENDING_TTL_MS });
});

test("route: connect with the stored hub goes straight to Google", () => {
  const { storage, data } = fakeStorage({ [HUB_KEY]: "http://hub.local:8080/", [PENDING_KEY]: '{"state":"old"}' });
  const action = route(at(connectHash("http://hub.local:8080", googleUrl({ state: "s2" }))), storage, NOW);
  assert.deepEqual(action, { kind: "go", url: googleUrl({ state: "s2" }) });
  assert.deepEqual(JSON.parse(data.get(PENDING_KEY)), { state: "s2", hub: "http://hub.local:8080/", expires: NOW + PENDING_TTL_MS });
});

test("route: connect with a bad Google URL or hub does nothing", () => {
  const cases = [
    [connectHash("http://hub.local/", googleUrl().replace("accounts.google.com", "evil.example")), "badGo"],
    [connectHash("http://hub.local/", googleUrl({ redirect_uri: "https://evil.example/cb" })), "badGo"],
    [connectHash("http://hub.local/", googleUrl({ state: undefined })), "badGo"],
    ["#hub=" + encodeURIComponent("http://hub.local/"), "badGo"],
    [connectHash("http://user:pw@hub.local/", googleUrl()), "badHub"],
    [connectHash("javascript:alert(1)//", googleUrl()), "badHub"],
    ["#go=" + encodeURIComponent(googleUrl()), "badHub"],
  ];
  for (const [hash, text] of cases) {
    const { storage, data } = fakeStorage({ [HUB_KEY]: "http://hub.local/" });
    assert.deepEqual(route(at(hash), storage, NOW), { kind: "error", text }, hash);
    assert.equal(data.has(PENDING_KEY), false, hash);
  }
});

test("route: callback with the matching state forwards to the hub and clears the pending sign-in", () => {
  const { storage, data } = fakeStorage({ [PENDING_KEY]: JSON.stringify({ state: "s1", hub: "http://hub.local:8080/", expires: NOW + 1 }) });
  const action = route(at("", "?state=s1&code=4/0Abc-d_e&scope=https://www.googleapis.com/auth/calendar.events.readonly&authuser=0&prompt=consent"), storage, NOW);
  assert.deepEqual(action, { kind: "forward", url: "http://hub.local:8080/#google-login?code=4%2F0Abc-d_e&state=s1" });
  assert.equal(data.has(PENDING_KEY), false);
});

test("route: access_denied is forwarded as error with state", () => {
  const { storage, data } = fakeStorage({ [PENDING_KEY]: JSON.stringify({ state: "s1", hub: "http://hub.local/", expires: NOW + 1 }) });
  assert.deepEqual(route(at("", "?error=access_denied&state=s1"), storage, NOW), { kind: "forward", url: "http://hub.local/#google-login?error=access_denied&state=s1" });
  assert.equal(data.has(PENDING_KEY), false);
});

test("route: expired, mismatched or missing pending sign-in forwards nothing and is cleared", () => {
  const pending = (p) => JSON.stringify({ state: "s1", hub: "http://hub.local/", expires: NOW + 1, ...p });
  for (const [stored, search] of [
    [pending({ expires: NOW - 1 }), "?state=s1&code=c"],
    [pending(), "?state=s2&code=c"],
    [pending(), "?code=c"],
    [undefined, "?state=s1&code=c"],
  ]) {
    const { storage, data } = fakeStorage(stored ? { [PENDING_KEY]: stored } : {});
    assert.deepEqual(route(at("", search), storage, NOW), { kind: "error", text: "noPending" }, search);
    assert.equal(data.has(PENDING_KEY), false);
  }
  const { storage } = fakeStorage({ [PENDING_KEY]: pending() });
  assert.deepEqual(route(at("", "?state=s1"), storage, NOW), { kind: "error", text: "badAnswer" });
});

test("route: unavailable storage is reported in both modes", () => {
  const { storage } = fakeStorage({}, true);
  assert.deepEqual(route(at(connectHash("http://hub.local/", googleUrl())), storage, NOW), { kind: "error", text: "storage" });
  assert.deepEqual(route(at("", "?state=s1&code=c"), storage, NOW), { kind: "error", text: "storage" });
});

test("both languages have every text", () => {
  assert.deepEqual(Object.keys(relay.TEXT.de).sort(), Object.keys(relay.TEXT.en).sort());
  assert.equal(relay.language("de-AT"), "de");
  assert.equal(relay.language("de"), "de");
  assert.equal(relay.language("en-US"), "en");
  assert.equal(relay.language("dk"), "en");
  assert.equal(relay.language(undefined), "en");
});
