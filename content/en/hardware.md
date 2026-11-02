---
title: Hardware
description: The doormutex light – ESP32-C6, three chambers, a 1.54″ e-ink sign, an 18650 cell and a 3D-printed enclosure. Open hardware, in development.
lead: A miniature traffic light, battery-powered, with a small e-ink sign. Open hardware – and still in development.
menus:
  main:
    weight: 20
---

> **In development.** This is the plan. A breadboard prototype from ready-made modules comes first, then the circuit board and the enclosure. Until the light is ready, a smart lamp in Home Assistant can stand in for it.

## The plan

- **Three chambers** – red, yellow and green, like on the road. Single-colour LEDs, dimmable, readable from the end of a long hallway.
- **ESP32-C6** with Wi-Fi and MQTT. Light sleep keeps the connection, so a change reaches the light within about a second.
- **1.54″ e-ink sign**, 200 × 200 pixels: until when, what comes next, battery.
- **18650 cell** with safe charging electronics; **USB-C** for charging and for permanent power.
- **3D-printed enclosure** (OpenSCAD) shaped like a miniature traffic light with visors, and a removable mount – magnets for steel posts and railings are planned.
- **Circuit board** in KiCad, assembled by JLCPCB, with production files built by CI.

## Firmware

ESP-IDF in C, built for battery operation: the LEDs keep running in light sleep, and when nobody's in the office the light sleeps deeply and checks in every few minutes. Flashing and Wi-Fi setup happen in the browser (ESP Web Tools and Improv), updates over the air with automatic rollback. For builds on mains power there will be an ESPHome example – bring your own lamp.

## Roadmap

1. **Breadboard prototype:** firmware, LEDs and lens test, e-ink, current measurement, battery operation.
2. **Circuit board and enclosure v1.**
3. **Polish:** battery life, e-ink layouts, Stream Deck, web flasher, updates over the air.
4. **Release** – with OSHWA certification.

The [breadboard parts list](https://github.com/padalton/doormutex/blob/main/docs/breadboard.md) and the full hardware notes are on GitHub.
