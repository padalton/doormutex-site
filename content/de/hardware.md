---
title: Hardware
description: Die doormutex-Ampel – ESP32-C6, drei Kammern, ein 1,54″-E-Ink-Schild, eine 18650-Zelle und ein 3D-gedrucktes Gehäuse. Open Hardware, in Entwicklung.
lead: Eine Miniatur-Verkehrsampel mit Akku und kleinem E-Ink-Schild. Open Hardware – und noch in Entwicklung.
menus:
  main:
    weight: 20
---

> **In Entwicklung.** Das hier ist der Plan. Zuerst kommt ein Steckbrett-Prototyp aus fertigen Modulen, dann Platine und Gehäuse. Bis die Ampel fertig ist, kann eine smarte Lampe in Home Assistant einspringen.

## Der Plan

- **Drei Kammern** – Rot, Gelb und Grün, wie im Straßenverkehr. Einfarbige LEDs, dimmbar, lesbar vom Ende eines langen Gangs.
- **ESP32-C6** mit WLAN und MQTT. Light Sleep hält die Verbindung, eine Änderung erreicht die Ampel in etwa einer Sekunde.
- **1,54″-E-Ink-Schild**, 200 × 200 Pixel: bis wann, was als Nächstes kommt, Akku.
- **18650-Zelle** mit sicherer Ladeelektronik; **USB-C** zum Laden und für Dauerstrom.
- **3D-gedrucktes Gehäuse** (OpenSCAD) in Form einer Miniatur-Ampel mit Schirmen, dazu eine abnehmbare Halterung – Magnete für Stahlpfosten und Geländer sind geplant.
- **Platine** in KiCad, bestückt von JLCPCB, Fertigungsdaten aus der CI.

## Firmware

ESP-IDF in C, gebaut für Akkubetrieb: Die LEDs laufen im Light Sleep weiter, und wenn niemand im Büro ist, schläft die Ampel tief und meldet sich alle paar Minuten. Flashen und WLAN-Einrichtung passieren im Browser (ESP Web Tools und Improv), Updates drahtlos mit automatischem Rollback. Für Aufbauten mit Netzteil gibt es ein ESPHome-Beispiel – bring deine eigene Lampe mit.

## Fahrplan

1. **Steckbrett-Prototyp:** Firmware, LEDs und Linsentest, E-Ink, Strommessung, Akkubetrieb.
2. **Platine und Gehäuse v1.**
3. **Feinschliff:** Akkulaufzeit, E-Ink-Layouts, Stream Deck, Web-Flasher, drahtlose Updates.
4. **Release** – mit OSHWA-Zertifizierung.

Die [Teileliste für das Steckbrett](https://github.com/padalton/doormutex/blob/main/docs/breadboard.md) und alle Hardware-Notizen stehen auf GitHub (englisch).
