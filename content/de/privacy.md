---
title: Datenschutzerklärung
slug: datenschutz
description: Wie doormutex.org mit deinen Daten umgeht – keine Cookies, kein Tracking – und wie die doormutex-Software Google-Kalender-Daten nutzt.
menus:
  footer:
    weight: 20
---

Diese Erklärung hat zwei Teile: [diese Website](#website) und [die Nutzung von Google-Nutzerdaten durch die doormutex-Software](#google).

**Verantwortlicher:** {{< legal "name" >}}, {{< legal "place" >}}, Österreich – {{< legal "email" >}}

## Diese Website {#website}

### Keine Cookies, kein Tracking

Diese Website setzt keine Cookies, führt kein JavaScript aus, enthält keinen Analyse- oder Tracking-Code und lädt nichts von anderen Websites – keine Schriften, keine Videos, keine Social-Media-Knöpfe. Es gibt nichts zuzustimmen, deshalb auch keinen Cookie-Banner.

### Hosting

Die Website wird von Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA (Cloudflare Pages) als unserem Auftragsverarbeiter gehostet. Um die Seiten auszuliefern und die Website vor Angriffen zu schützen, verarbeitet Cloudflare die Daten, die dein Browser bei jedem Aufruf mitsendet: IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse, die verweisende Adresse (unsere Seiten bitten deinen Browser, sie nicht zu senden), Browser und Betriebssystem. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und zuverlässigen Website (Art. 6 Abs. 1 lit. f DSGVO). Wir speichern diese Server-Logs nicht selbst; wir sehen nur Cloudflares zusammengefasste, anonyme Statistiken (etwa die Zahl der Seitenaufrufe pro Tag), aus denen sich niemand identifizieren lässt.

Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert; Übermittlungen in die USA beruhen daher auf einem Angemessenheitsbeschluss der Europäischen Kommission (Art. 45 DSGVO). Zusätzlich gilt ein Auftragsverarbeitungsvertrag mit Standardvertragsklauseln. Details: [Datenschutzerklärung von Cloudflare](https://www.cloudflare.com/de-de/privacypolicy/).

### Links auf andere Websites

Links, zum Beispiel auf GitHub, sind einfache Links. Erst wenn du einem folgst, erhält die andere Website Daten von deinem Browser – nach deren eigener Datenschutzerklärung.

### Kontakt per E-Mail

Wenn du uns schreibst, verwenden wir deine Adresse und Nachricht nur, um dir zu antworten, und löschen sie, wenn die Unterhaltung erledigt ist – außer das Gesetz verlangt, sie aufzubewahren.

## Die doormutex-Software und Google-Nutzerdaten {#google}

doormutex ist Software, die du selbst betreibst, auf deiner eigenen Hardware zu Hause (dem „Hub“). Wenn du ein Google-Konto für kalenderbasierte Regeln verbindest, liest der Hub deinen Google Kalender, um zu entscheiden, welche Farbe die Ampel zeigt.

### Worauf zugegriffen wird

Der Hub fordert nur den Lese-Scope `https://www.googleapis.com/auth/calendar.events.readonly` an und darin nur diese Felder deiner Termine:

- Beginn und Ende, Status (zum Beispiel abgesagt) und Terminart (zum Beispiel Fokuszeit oder abwesend),
- ob der Termin dich als beschäftigt oder frei zeigt, und deine eigene Antwort auf eine Einladung,
- Konferenzdaten sowie Ort und Beschreibung des Termins – nur, um Links zu Videocalls zu erkennen (Meet, Zoom, Teams, Webex, Jitsi),
- eine private Markierung, die deine eigenen Kopier-Skripte setzen können, damit Kopien nicht doppelt zählen.

Termintitel werden nicht abgefragt. Von der Gästeliste wird nur deine eigene Antwort abgefragt – keine Namen oder E-Mail-Adressen anderer Personen.

### Wofür es verwendet wird

Die Daten dienen einem einzigen Zweck: den Zustand deiner Ampel zu berechnen (zum Beispiel „rot – Videocall bis 14:30“) und ihn auf der Ampel, ihrem E-Ink-Schild und den Apps anzuzeigen, die du mit deinem eigenen Hub verbindest. Ort und Beschreibung werden nur nach Videocall-Links durchsucht und nicht gespeichert. Der Hub hält die berechneten Termine im Arbeitsspeicher und aktualisiert sie alle paar Minuten; er speichert einen Verlauf der Ampelzustände (zum Beispiel „rot, Videocall“), aber keine Inhalte deiner Termine.

### Wohin es geht

Nirgendwohin. Die Daten bleiben auf deinem Hub in deinem eigenen Netzwerk. Das doormutex-Projekt betreibt keinen Server, der Google-Nutzerdaten empfängt, und die Betreuer des Projekts sehen sie nie. Die Daten werden nicht verkauft, nicht an Dritte weitergegeben, nicht für Werbung verwendet und nicht zum Training von KI- oder Machine-Learning-Modellen genutzt. Kein Mensch liest sie.

### Speicherung und Sicherheit

Das Anmeldetoken von Google wird auf deinem Hub gespeichert, verschlüsselt mit AES-256-GCM. Es verlässt den Hub nie – auch nicht bei der Anmeldung über den Desktop-Companion. Die Verbindung zu Google läuft über HTTPS.

### Zugriff widerrufen

- Ein Konto am Hub trennen: `doormutex-hub google logout PROFIL KONTO` – das löscht sein Token vom Hub.
- Den Zugriff jederzeit bei Google widerrufen: [Google-Konto → Verbindungen mit Drittanbietern](https://myaccount.google.com/connections).

### Eingeschränkte Nutzung (Limited Use)

doormutex's use and transfer of information received from Google APIs to any other app will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

Auf Deutsch: Die Nutzung und Weitergabe von Informationen, die doormutex von Google-APIs erhält, an andere Apps hält sich an die Google API Services User Data Policy, einschließlich der Anforderungen zur eingeschränkten Nutzung (Limited Use).

## Deine Rechte

Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Schreib dazu an die oben genannte Adresse. Außerdem kannst du dich bei einer Aufsichtsbehörde beschweren – in Österreich bei der [Datenschutzbehörde](https://www.dsb.gv.at/), Barichgasse 40–42, 1030 Wien.

*Stand: 30. Oktober 2026*
