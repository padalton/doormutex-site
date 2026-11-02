---
title: Funktionen
slug: funktionen
description: Was doormutex selbst erkennt, wie du es steuerst – KDE-Widget, Web-App, iPhone, Android, Home Assistant – und wie ein Hub mehrere Ampeln bedient.
lead: Meistens weiß doormutex selbst, ob du gestört werden darfst. Wenn nicht, reicht ein Tipp.
menus:
  main:
    weight: 10
---

## Automatisch erkannt

- **Mikrofon und Kamera.** Der Linux-Desktop-Companion beobachtet PipeWire und die Kamerageräte, deshalb zählt jede Call-App – Meet, Zoom, Teams, Signal, egal. Nach zehn Sekunden wird die Ampel rot und bleibt es noch zwei Minuten nach dem Gespräch.
- **Google Kalender.** Mehrere Konten pro Person, zum Beispiel privat und Firma. Videocalls (Links zu Meet, Zoom, Teams, Webex, Jitsi) machen die Ampel rot, Fokuszeit und andere Termine gelb, „vielleicht“ oder unbeantwortete Einladungen gelb. Ein ganztägiger Abwesenheitstermin ist ein freier Tag. Welche Farbe welche Terminart bekommt, stellst du in der Web-App ein.
- **Arbeitszeit.** Ein Wochenplan mit österreichischen Feiertagen und eigenen freien Tagen macht die Ampel gelb.
- **Bildschirmsperre, Herunterfahren und Standby** schalten die Ampel aus. Ein Meeting, in dem du nur zuhörst, bleibt rot, auch wenn sich der Bildschirm von selbst sperrt.

## Steuern von überall

- **KDE-Plasma-6-Widget:** Zustand, Grund und „bis wann“; Rot, Gelb, Grün oder Aus für eine Weile setzen; Pomodoro; eine Nachricht fürs E-Ink-Schild; der heutige Tag als farbiger Balken.
- **Web-App:** im Hub eingebaut und auf dem Homescreen des Handys installierbar. Englisch und Deutsch, weitere Sprachen willkommen.
- **iPhone:** die Web-App plus Apple-Kurzbefehle – Siri, die Aktionstaste oder ein Fokus, der die Ampel schaltet. Keine App aus dem App Store nötig.
- **Android:** die Web-App mit Kurzbefehlen am App-Symbol, die Open-Source-App *HTTP Shortcuts* für Homescreen-Widgets und Schnelleinstellungs-Kacheln, und Tasker oder MacroDroid, damit die Ampel dem „Bitte nicht stören“ des Handys folgt.
- **Desktop-Benachrichtigungen** bei jeder Änderung, mit einem Knopf zurück auf Automatik.
- **Stream Deck:** geplant.

{{< gallery >}}
{{< screenshot src="images/web-now.png" alt="Die Web-App am Handy: Die Ampel zeigt Gelb, darunter Knöpfe für Rot, Gelb, Grün und Aus" caption="Web-App: der aktuelle Zustand und Schnellknöpfe (englische Oberfläche)." >}}
{{< screenshot src="images/web-settings.png" alt="Die Einstellungen der Web-App: eine Farbe pro Terminart und das Timing der Warnphasen" caption="Einstellungen: Farbe pro Terminart, Timing der Warnphasen." >}}
{{< /gallery >}}

## Manuelle Einstellungen enden von selbst

Setz eine Farbe für 15 Minuten bis 2 Stunden, bis der Termin endet, bis Arbeitsende, bis zur nächsten automatischen Änderung – oder ausdrücklich unbegrenzt. „Auto“ kehrt zu dem zurück, was doormutex erkennt. Niemand muss daran denken, die Ampel zurückzustellen.

## Pomodoro

25/5 oder 50/10: rot, während du arbeitest – oder gelb, wenn dir das lieber ist – und grün in den Pausen.

## Mehrere Ampeln, ein Hub

Jede Person bekommt ein Profil mit eigenen Regeln, Kalendern, eigener Ampel und eigenen Zugangstokens. Der **Raum-Modus** ist für alle ohne PC: das Zimmer des Teenagers, das Schlafzimmer der Eltern. Gesteuert wird per Handy, Web-App oder Home Assistant – und über Home Assistant per Sprache mit Alexa oder Google Home. Das Token eines Handys steuert nur sein eigenes Profil: Das Handy des Teenagers kann die Büro-Ampel nicht schalten.

## Smart Home

- **Home Assistant über MQTT-Discovery:** Zustand, Ereignisse, aktueller und nächster freier Zeitraum, Akku – und pro Profil je eine Entität zum Setzen der Ampel und für die E-Ink-Nachricht.
- **Matter über WLAN:** geplant, unzertifiziert – für Apple Home, Google Home und Alexa ohne Home Assistant.

Details stehen im [README auf GitHub](https://github.com/padalton/doormutex#readme) (englisch).
