---
title: Privacy policy
description: How doormutex.org handles your data – no cookies, no tracking – and how the doormutex software uses Google Calendar data.
menus:
  footer:
    weight: 20
---

This policy has two parts: [this website](#website) and [the doormutex software's use of Google user data](#google).

**Controller:** {{< legal "name" >}}, {{< legal "place" >}}, Austria – {{< legal "email" >}}

## This website {#website}

### No cookies, no tracking

This website sets no cookies, contains no analytics or tracking code and loads nothing from other websites – no fonts, no videos, no social media buttons. There is nothing to consent to, so there is no cookie banner. Only one page runs JavaScript – a small script from this website: the [Google sign-in relay](#relay).

### Hosting

The website is hosted by Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA (Cloudflare Pages), as our processor. To deliver the pages and to protect the website against attacks, Cloudflare processes the data your browser sends with every request: IP address, date and time, the requested address, the referring address (our pages ask your browser not to send it), browser and operating system. Legal basis is our legitimate interest in a secure and reliable website (Art. 6 (1) (f) GDPR). We don't keep these server logs ourselves; we only look at Cloudflare's aggregated, anonymous statistics (for example the number of page views per day), which can't identify anyone.

Cloudflare is certified under the EU–U.S. Data Privacy Framework, so transfers to the USA are based on an adequacy decision of the European Commission (Art. 45 GDPR); in addition, a data processing agreement with standard contractual clauses applies. Details: [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/).

### Google sign-in relay {#relay}

The page `https://doormutex.org/oauth/` helps you connect a Google account to your own doormutex hub. Hubs usually run at a home address that Google can't send you back to, so Google sends the sign-in to this page, and its script hands it to your hub – in your browser.

- **What it processes:** Google's answer arrives in the page address – a one-time authorization code and a random `state` value, or an error such as "access denied". Like every address you request, Cloudflare sees it as part of the request (see [Hosting](#hosting)). The page passes only the code, the state and an error to the hub address you confirmed. Apart from taking you to Google and on to your hub, the script sends nothing anywhere – in particular nothing to us.
- **Why the code is of no use to others:** on its own the code gives no access. Exchanging it for access needs the PKCE verifier and the client secret that only your hub has; the code is also valid only once and only for a few minutes.
- **What stays in your browser:** your hub's address and the pending sign-in (state, hub address, expiry after 10 minutes) are kept in this browser's local storage (`localStorage`), so the page can recognise your hub next time and match Google's answer to the sign-in you started. The pending sign-in is deleted as soon as Google's answer arrives; the hub address stays until you clear the site data for doormutex.org. Neither is ever sent to us. Storing them is strictly necessary for the relay you asked for, so no consent is needed (§ 165 (3) TKG 2021).

### Links to other websites

Links, for example to GitHub, are plain links. Only when you follow one does the other website receive data from your browser, under its own privacy policy.

### Contact by e-mail

If you write to us, we use your address and message only to answer you and delete them when the conversation is over, unless the law requires us to keep them.

## The doormutex software and Google user data {#google}

doormutex is software that you run yourself, on your own hardware at home (the "hub"). If you connect a Google account to calendar-based rules, the hub reads your Google Calendar to decide which colour the light shows.

### What is accessed

The hub requests only the read-only scope `https://www.googleapis.com/auth/calendar.events.readonly` and, within it, only these fields of your events:

- start and end time, status (for example cancelled) and kind of event (for example focus time or out of office),
- whether the event shows you as busy or free, and your own response to an invitation,
- conference information and the event's location and description – only to recognise links to video calls (Meet, Zoom, Teams, Webex, Jitsi),
- a private marker that your own copy scripts may set, so copies aren't counted twice.

Event titles are not requested. Of the guest list, only your own response is requested – no names or e-mail addresses of other people.

### How it is used

The data is used for one purpose only: to compute the state of your light (for example "red – video call until 14:30") and to show it on the light, its e-ink sign and the apps you connect to your own hub. Location and description are only searched for video-call links and are not stored. The hub keeps the computed events in memory and refreshes them every few minutes; it stores a history of light states (for example "red, video call"), but no content of your events.

### Where it goes

Nowhere. The data stays on your hub in your own network. The doormutex project operates no server that receives Google user data, and the project's maintainers never see it. The data is not sold, not shared with third parties, not used for advertising, and not used to train AI or machine-learning models. No human reads it.

### Storage and security

The sign-in token from Google is stored on your hub, encrypted with AES-256-GCM. It never leaves the hub – not even during sign-in through the desktop companion or the [sign-in relay](#relay), which only passes on the one-time code. The connection to Google uses HTTPS.

### Revoking access

- Disconnect an account on the hub: `doormutex-hub google logout PROFILE ACCOUNT` – this deletes its token from the hub.
- Revoke access at Google at any time: [Google Account → Third-party connections](https://myaccount.google.com/connections).

### Limited Use

doormutex's use and transfer of information received from Google APIs to any other app will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

## Your rights

You have the right to access, rectification, erasure, restriction of processing, data portability and to object (Art. 15–21 GDPR). Write to the address above. You can also lodge a complaint with a supervisory authority – in Austria the [Datenschutzbehörde](https://www.dsb.gv.at/), Barichgasse 40–42, 1030 Vienna.

*Last updated: 16 November 2026*
