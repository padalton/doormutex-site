---
title: doormutex
description: "doormutex ist eine Open-Source-Ampel fürs Homeoffice: rot, gelb oder grün – erkannt an Mikrofon, Kamera, Kalender und Bildschirmsperre, damit die Familie weiß, ob sie reinkommen kann."
headline: Eine Ampel fürs Homeoffice.
lead: "Schon vom Gang aus sieht die Familie, ob es sich lohnt, reinzukommen. doormutex erkennt das selbst – an Mikrofon, Kamera, Kalender und Bildschirmsperre – und du kannst jederzeit übersteuern."
actions:
  - label: So funktioniert's
    url: /funktionen/
    primary: true
  - label: Loslegen
    url: /loslegen/
  - label: Quellcode auf GitHub
    url: https://github.com/padalton/doormutex
signals:
  - light: red
    name: Rot – bitte nicht stören
    text: Ein Meeting oder ein Anruf. Bitte nicht reinkommen.
  - light: yellow
    name: Gelb – am Arbeiten
    text: Reinkommen, wenn es wichtig ist.
  - light: green
    name: Grün – herein!
    text: Nichts los. Komm rein!
  - light: off
    name: Aus – nicht da
    text: Der PC ist gesperrt oder aus. Niemand im Büro.
---

## Wie die Ampel entscheidet

Jede Quelle meldet einen Anspruch, der stärkste gewinnt:

1. **Mikrofon oder Kamera in Verwendung → rot.** Das schlägt alles, sogar eine manuelle Einstellung: Ein spontaner Anruf schaltet die Ampel sofort auf Rot.
2. **PC gesperrt, heruntergefahren oder im Standby → aus.** Der Desktop-Companion meldet sich ab. Verstummt er ohne Abmeldung, zeigt die Ampel eine Störung.
3. **Von Hand gesetzt oder Pomodoro.** Über das KDE-Widget, die Web-App, ein Handy oder Home Assistant. Eine manuelle Einstellung endet immer: nach einer Dauer, mit dem Termin, mit Arbeitsende, bei der nächsten automatischen Änderung – oder erst, wenn du ausdrücklich „unbegrenzt“ gewählt hast.
4. **Kalender → rot oder gelb.** Videocalls sind rot; Fokuszeit und andere Termine gelb, ebenso Einladungen, die du mit „vielleicht“ beantwortet hast.
5. **Arbeitszeit → gelb,** mit österreichischen Feiertagen und deinen eigenen freien Tagen.
6. **Sonst → grün.**

Die Position der Lampe verrät die Bedeutung, wie im Straßenverkehr: Rot oben, Gelb in der Mitte, Grün unten – lesbar auch für alle, die Farben schlecht unterscheiden.

## Warnphasen wie im Straßenverkehr

Die Phasen folgen der österreichischen Straßenverkehrsordnung (StVO § 38):

| Ampel | Phase | Wann |
|---|---|---|
| Grün blinkend | letzter Aufruf | gleich beginnt ein Meeting |
| Rot / Gelb abwechselnd | letzter Aufruf aus Gelb | gleich beginnt ein Meeting, und die Ampel ist gelb |
| Rot + Gelb | gleich vorbei | das Meeting endet, danach Gelb oder Grün |
| Gelb blinkend | Störung | Hub oder WLAN weg, oder der PC ist ohne Abmeldung verstummt |

Standardmäßig dauern die Phasen Sekunden, wie an der Kreuzung. Pro Phase lässt sich stattdessen eine echte Vorwarnung einstellen, zum Beispiel drei oder fünf Minuten.

## Das E-Ink-Schild

Ein kleines 1,54″-E-Ink-Display unter der Ampel liefert das Kleingedruckte: **Uhrzeiten statt Countdown** – „Meeting · bis 14:30“ –, was als Nächstes kommt, einen Hinweis wie „Kamera an“ und den Akkustand. Weil sich der Inhalt nur mit dem Zustand ändert, braucht es im Ruhezustand keinen Strom. Termintitel werden nie angezeigt.

## Privat von Grund auf

- **Läuft bei dir zu Hause.** Ein kleiner Hub läuft in deinem eigenen Netzwerk. Es gibt keinen Cloud-Dienst und kein Konto bei uns.
- **Kalender nur lesend.** Die einzige Verbindung nach außen ist die Google-Calendar-API. Der Hub fragt nicht einmal die Termintitel ab.
- **Kein Ton, kein Bild.** Der Desktop-Companion meldet nur Ja/Nein-Signale wie „Mikrofon in Verwendung“, nie, was gesagt oder gezeigt wird.
- **Verschlüsselte Tokens.** Die Google-Anmeldetokens liegen verschlüsselt auf deinem Hub und verlassen ihn nie.

## Stand

doormutex ist in früher Entwicklung. Die Software – Hub, Linux-Desktop-Companion, KDE-Widget und Web-App – läuft bereits. Die Ampel selbst, mit Platine und 3D-gedrucktem Gehäuse, entsteht gerade. Bis dahin kann eine smarte Lampe in Home Assistant einspringen.

[Verfolge das Projekt auf GitHub](https://github.com/padalton/doormutex) – alles ist Open Source und Open Hardware.
