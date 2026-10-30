---
title: Get started
description: Run the doormutex hub, connect Google Calendar, install the Linux companion and the KDE widget, and set up the phones.
lead: The software runs today; the light itself is still in development. This is what you need.
menus:
  main:
    weight: 30
---

1. **A hub.** A small Docker container in your home network – a homelab, a NAS or a Raspberry Pi. The image `ghcr.io/padalton/doormutex-hub` is built for amd64 and arm64. → [Hub](https://github.com/padalton/doormutex/blob/main/hub/README.md)
2. **Google Calendar** (optional). You create your own OAuth client in Google Cloud and sign in through the desktop companion – the browser opens on your desktop, nothing to copy. → [Google Calendar](https://github.com/padalton/doormutex/blob/main/docs/google-calendar.md)
3. **The desktop companion** for Linux: microphone, camera, screen lock and notifications. → [Companion](https://github.com/padalton/doormutex/blob/main/companion/README.md)
4. **The KDE Plasma widget.** → [Widget](https://github.com/padalton/doormutex/blob/main/plasmoid/README.md)
5. **Phones.** → [iPhone and Apple Shortcuts](https://github.com/padalton/doormutex/blob/main/docs/apple-shortcuts.md) · [Android](https://github.com/padalton/doormutex/blob/main/docs/android.md)
6. **A light.** Until the doormutex light is ready, use a smart lamp in Home Assistant: the hub announces itself via MQTT discovery.

Questions, ideas, bugs: [GitHub issues](https://github.com/padalton/doormutex/issues).
