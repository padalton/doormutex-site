---
title: Hardware
description: Die doormutex-Ampel – ESP32-C6, drei Kammern, ein 1,54″-E-Ink-Schild, eine 18650-Zelle und ein 3D-gedrucktes Gehäuse. Open Hardware, in Entwicklung.
lead: Eine Miniatur-Verkehrsampel mit Akku und kleinem E-Ink-Schild. Open Hardware – und noch in Entwicklung.
menus:
  main:
    weight: 20
---

> **In Entwicklung.** Die erste Stufe des Steckbrett-Prototyps läuft: Die Ampel zeigt den Zustand vom Hub mit allen drei Lampen, das E-Ink-Schild und eine Helligkeit, die sich nach dem Raum richtet. Als Nächstes kommt der Akku, dann Platine und Gehäuse. Bis die Ampel fertig ist, kann eine smarte Lampe in Home Assistant einspringen.

## Der Plan

- **Drei Kammern** – Rot, Gelb und Grün, wie im Straßenverkehr. Einfarbige LEDs, dimmbar, lesbar vom Ende eines langen Gangs.
- **ESP32-C6** mit WLAN und MQTT. Light Sleep hält die Verbindung, eine Änderung erreicht die Ampel in etwa einer Sekunde.
- **1,54″-E-Ink-Schild**, 200 × 200 Pixel: bis wann, was als Nächstes kommt, Akku.
- **18650-Zelle** mit sicherer Ladeelektronik; **USB-C** zum Laden und für Dauerstrom.
- **3D-gedrucktes Gehäuse** (OpenSCAD) in Form einer Miniatur-Ampel mit Schirmen, dazu eine abnehmbare Halterung – Magnete für Stahlpfosten und Geländer sind geplant.
- **Platine** in KiCad, bestückt von JLCPCB, Fertigungsdaten aus der CI.

## Firmware

ESP-IDF in C, gebaut für Akkubetrieb: Die LEDs laufen im Light Sleep weiter, und wenn niemand im Büro ist, schläft die Ampel tief und meldet sich alle paar Minuten. Flashen und WLAN-Einrichtung passieren im Browser (ESP Web Tools und Improv), Updates drahtlos mit automatischem Rollback. Für Aufbauten mit Netzteil gibt es ein ESPHome-Beispiel – bring deine eigene Lampe mit.

## Steckbrett-Prototyp

{{< screenshot src="images/breadboard-v1.jpg" alt="Der Steckbrett-Prototyp: ein ESP32-C6-Board, drei LEDs mit Transistoren, ein kleiner Lichtsensor und das 1,54-Zoll-E-Ink-Schild mit Working until 19:41" caption="Stufe 1 auf dem Steckbrett: Gelb für „arbeite“, und das E-Ink-Schild sagt, bis wann." >}}

Stufe 1 läuft über USB (LEDs, E-Ink, Lichtsensor), Stufe 2 mit einer 18650-Zelle (Schutzschaltung, Ladeelektronik, Akkuanzeige).

{{< video src="/video/wiring.mp4" poster="/video/wiring.jpg" caption="Den Steckbrett-Prototyp in 13 Schritten verdrahten, ohne Ton (englisch). Pin-Tabellen und alle Schritte als Text: [docs/wiring.md](https://github.com/padalton/doormutex/blob/main/docs/wiring.md)." >}}

## Fahrplan

1. **Steckbrett-Prototyp:** Firmware, LEDs, E-Ink und Lichtsensor laufen (Stufe 1); als Nächstes Linsentest, Strommessung und Akkubetrieb.
2. **Platine und Gehäuse v1.**
3. **Feinschliff:** Akkulaufzeit, E-Ink-Layouts, Web-Flasher, drahtlose Updates.
4. **Release** – mit OSHWA-Zertifizierung.

Die [Teileliste für das Steckbrett](https://github.com/padalton/doormutex/blob/main/docs/breadboard.md) und alle Hardware-Notizen stehen auf GitHub (englisch).
