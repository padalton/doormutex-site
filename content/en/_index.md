---
title: doormutex
description: "doormutex is an open-source traffic light for the home office: red, yellow or green – detected from microphone, camera, calendar and screen lock, so the family knows whether to come in."
headline: A traffic light for the home office.
lead: "From the hallway, the family can see whether it's worth coming in. doormutex detects it on its own – from microphone, camera, calendar and screen lock – and you can override it at any time."
actions:
  - label: How it works
    url: /features/
    primary: true
  - label: Get started
    url: /get-started/
  - label: Source on GitHub
    url: https://github.com/padalton/doormutex
signals:
  - light: red
    name: Red – do not disturb
    text: A meeting or a call. Please don't come in.
  - light: yellow
    name: Yellow – working
    text: Come in if it's important.
  - light: green
    name: Green – come in
    text: Nothing going on. Come on in!
  - light: off
    name: Off – not here
    text: The PC is locked or off. Nobody's in the office.
---

## How the light decides

Every source makes a claim, and the strongest one wins:

1. **Microphone or camera in use → red.** This beats everything, even a manual setting: a spontaneous call turns the light red at once.
2. **PC locked, shut down or suspended → off.** The desktop companion signs off. If it goes silent without a goodbye, the light shows a fault.
3. **Set by hand or pomodoro.** From the KDE widget, the web app, a phone or Home Assistant. A manual setting always ends: after a duration, with the event, at the end of the work day, at the next automatic change – or only when you explicitly said "indefinitely".
4. **Calendar → red or yellow.** Video calls are red; focus time and other events are yellow, and so are invitations you answered with "maybe".
5. **Working hours → yellow,** with Austrian public holidays and your own days off.
6. **Otherwise → green.**

The position of the lamp tells the meaning, just like on the road: red on top, yellow in the middle, green at the bottom – readable even if you can't tell the colours apart.

## Warning phases, as on the road

The phases follow the Austrian road traffic regulations (StVO § 38):

| Light | Phase | When |
|---|---|---|
| green blinking | last call | a meeting starts soon |
| red / yellow alternating | last call from yellow | a meeting starts soon, and the light is yellow |
| red + yellow | ending soon | the meeting ends, yellow or green follows |
| yellow blinking | fault | hub or Wi-Fi gone, or the PC went silent without signing off |

By default the phases last seconds, like at a crossing. Per phase you can switch to a real warning with a lead time instead, for example three or five minutes.

## The e-ink sign

A small 1.54″ e-ink display below the light adds the small print: **absolute times instead of a countdown** – "Meeting · until 14:30" – what comes next, a hint like "camera on" and the battery level. Because the content only changes with the state, it needs no power while idle. Event titles are never shown.

## Private by design

- **It runs at home.** A small hub runs in your own network. There is no cloud service and no account with us.
- **Read-only calendar access.** The only external connection is the Google Calendar API. The hub doesn't even request event titles.
- **No audio, no video.** The desktop companion reports yes/no signals such as "microphone in use", never what is said or shown.
- **Encrypted tokens.** Google sign-in tokens are stored encrypted on your hub and never leave it.

## Status

doormutex is in early development. The software – hub, Linux desktop companion, KDE widget and web app – runs today. The light itself, with its circuit board and 3D-printed enclosure, is being designed. Until then, a smart lamp in Home Assistant can stand in for it.

[Follow the project on GitHub](https://github.com/padalton/doormutex) – everything is open source and open hardware.
