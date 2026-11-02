---
title: Loslegen
slug: loslegen
description: Den doormutex-Hub betreiben, Google Kalender verbinden, den Linux-Companion und das KDE-Widget installieren und die Handys einrichten.
lead: Die Software läuft bereits, die Ampel selbst ist noch in Entwicklung. Das brauchst du.
menus:
  main:
    weight: 30
---

1. **Einen Hub.** Einen kleinen Docker-Container in deinem Heimnetz – Homelab, NAS oder Raspberry Pi. Das Image `ghcr.io/padalton/doormutex-hub` gibt es für amd64 und arm64. → [Hub](https://github.com/padalton/doormutex/blob/main/hub/README.md)
2. **Google Kalender** (optional). Du legst einen eigenen OAuth-Client in Google Cloud an und meldest dich über den Desktop-Companion an – der Browser öffnet sich am Desktop, nichts zu kopieren. → [Google Kalender](https://github.com/padalton/doormutex/blob/main/docs/google-calendar.md)
3. **Den Desktop-Companion** für Linux: Mikrofon, Kamera, Bildschirmsperre und Benachrichtigungen. → [Companion](https://github.com/padalton/doormutex/blob/main/companion/README.md)
4. **Das KDE-Plasma-Widget.** In Plasma: *Miniprogramme hinzufügen → Neue Miniprogramme holen*, nach *doormutex* suchen – oder im [KDE Store](https://store.kde.org/p/2380911). Einrichtung: [Widget](https://github.com/padalton/doormutex/blob/main/plasmoid/README.md)
5. **Handys.** → [iPhone und Apple-Kurzbefehle](https://github.com/padalton/doormutex/blob/main/docs/apple-shortcuts.md) · [Android](https://github.com/padalton/doormutex/blob/main/docs/android.md)
6. **Eine Ampel.** Bis die doormutex-Ampel fertig ist, nimm eine smarte Lampe in Home Assistant: Der Hub meldet sich über MQTT-Discovery an.

Die Anleitungen sind auf Englisch. Fragen, Ideen, Fehler: [GitHub Issues](https://github.com/padalton/doormutex/issues).
