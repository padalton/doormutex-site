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

Diese Website setzt keine Cookies, enthält keinen Analyse- oder Tracking-Code und lädt nichts von anderen Websites – keine Schriften, keine Videos, keine Social-Media-Knöpfe. Es gibt nichts zuzustimmen, deshalb auch keinen Cookie-Banner. Nur eine Seite führt JavaScript aus – ein kleines Skript von dieser Website: die [Weiterleitung der Google-Anmeldung](#relay).

### Hosting

Die Website wird von Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA (Cloudflare Pages) als unserem Auftragsverarbeiter gehostet. Um die Seiten auszuliefern und die Website vor Angriffen zu schützen, verarbeitet Cloudflare die Daten, die dein Browser bei jedem Aufruf mitsendet: IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse, die verweisende Adresse (unsere Seiten bitten deinen Browser, sie nicht zu senden), Browser und Betriebssystem. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und zuverlässigen Website (Art. 6 Abs. 1 lit. f DSGVO). Wir speichern diese Server-Logs nicht selbst; wir sehen nur Cloudflares zusammengefasste, anonyme Statistiken (etwa die Zahl der Seitenaufrufe pro Tag), aus denen sich niemand identifizieren lässt.

Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert; Übermittlungen in die USA beruhen daher auf einem Angemessenheitsbeschluss der Europäischen Kommission (Art. 45 DSGVO). Zusätzlich gilt ein Auftragsverarbeitungsvertrag mit Standardvertragsklauseln. Details: [Datenschutzerklärung von Cloudflare](https://www.cloudflare.com/de-de/privacypolicy/).

### Weiterleitung der Google-Anmeldung {#relay}

Die Seite `https://doormutex.org/oauth/` hilft dir, ein Google-Konto mit deinem eigenen doormutex-Hub zu verbinden. Hubs laufen meist unter einer Adresse im Heimnetz, zu der Google nicht zurückleiten kann. Deshalb schickt Google die Anmeldung an diese Seite, und ihr Skript übergibt sie an deinen Hub – in deinem Browser.

- **Was verarbeitet wird:** Googles Antwort kommt in der Adresse der Seite an – ein einmaliger Autorisierungscode und ein zufälliger `state`-Wert, oder ein Fehler wie „Zugriff verweigert“. Wie jede aufgerufene Adresse sieht Cloudflare sie als Teil der Anfrage (siehe [Hosting](#hosting)). Die Seite gibt nur Code, State und einen Fehler an die Hub-Adresse weiter, die du bestätigt hast. Außer dich zu Google und weiter zu deinem Hub zu führen, sendet das Skript nichts – insbesondere nichts an uns.
- **Warum der Code anderen nichts nützt:** Für sich allein gibt der Code keinen Zugriff. Um ihn gegen Zugriff einzutauschen, braucht es den PKCE-Verifier und das Client-Secret, die nur dein Hub hat; außerdem gilt der Code nur einmal und nur wenige Minuten.
- **Was in deinem Browser bleibt:** die Adresse deines Hubs und die laufende Anmeldung (State, Hub-Adresse, Ablauf nach 10 Minuten) werden im lokalen Speicher dieses Browsers (`localStorage`) abgelegt, damit die Seite deinen Hub beim nächsten Mal wiedererkennt und Googles Antwort der Anmeldung zuordnen kann, die du gestartet hast. Die laufende Anmeldung wird gelöscht, sobald Googles Antwort ankommt; die Hub-Adresse bleibt, bis du die Website-Daten von doormutex.org löschst. Beides wird nie an uns gesendet. Das Speichern ist für die von dir gewünschte Weiterleitung unbedingt erforderlich, deshalb braucht es keine Einwilligung (§ 165 Abs. 3 TKG 2021).

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

Das Anmeldetoken von Google wird auf deinem Hub gespeichert, verschlüsselt mit AES-256-GCM. Es verlässt den Hub nie – auch nicht bei der Anmeldung über den Desktop-Companion oder die [Weiterleitung der Anmeldung](#relay), die nur den einmaligen Code übergibt. Die Verbindung zu Google läuft über HTTPS.

### Zugriff widerrufen

- Ein Konto am Hub trennen: `doormutex-hub google logout PROFIL KONTO` – das löscht sein Token vom Hub.
- Den Zugriff jederzeit bei Google widerrufen: [Google-Konto → Verbindungen mit Drittanbietern](https://myaccount.google.com/connections).

### Eingeschränkte Nutzung (Limited Use)

doormutex's use and transfer of information received from Google APIs to any other app will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

Auf Deutsch: Die Nutzung und Weitergabe von Informationen, die doormutex von Google-APIs erhält, an andere Apps hält sich an die Google API Services User Data Policy, einschließlich der Anforderungen zur eingeschränkten Nutzung (Limited Use).

## Deine Rechte

Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Schreib dazu an die oben genannte Adresse. Außerdem kannst du dich bei einer Aufsichtsbehörde beschweren – in Österreich bei der [Datenschutzbehörde](https://www.dsb.gv.at/), Barichgasse 40–42, 1030 Wien.

*Stand: 16. November 2026*
