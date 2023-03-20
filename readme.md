<div align="center">

# CushyStudio

[![Downloads][downloads-badge]][releases]

<!-- https://shields.io/ -->

![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/CushyStudio?style=social)

![Twitter Follow](https://img.shields.io/twitter/follow/CushyStudio?style=social)

[![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)

[![CD](https://github.com/rvion/CushyStudio/actions/workflows/electron-publication.yml/badge.svg)](https://github.com/rvion/CushyStudio/actions/workflows/electron-publication.yml)

<!-- ![Discord](https://img.shields.io/discord/1087008112969531513) -->

<!-- https://discord.gg/GfAN6hF2ad -->

**🔴 EARLY ACCESS - MASTER BRANCH NOT WORKING 🔴**

CushyStudio is a **Full-featured** web-based stable-diffusion playground IDE.

Build multi-step stable diffusion pipelines.
Handle loops, manual image selection steps.

[Getting started](#getting-started) •
[Installation](#installation) •
[Configuration](#configuration) •
[Integrations](#third-party-integrations)

</div>

## Getting started

<!-- ![](docs/images/2023-03-14_06-47-30.png) -->

![](website/static/img/screenshots/2023-03-18-23-13-27.png)

## Features

### Type-safe everywhere

![](website/static/img/screenshots/2023-03-18-23-13-53.png)

## Installation

-   install https://github.com/comfyanonymous/ComfyUI
-   download some models so you have a functional Comfy setup (see [this](scripts/download-models.sh))
-   start the server `python main.py --listen 0.0.0.0`
-   start the client `yarn dev`
-   open a web-browser with CORS disabled (e.g. `google-chrome --disable-web-security`) (🔴 temporary hack until cors properly supported)
-   visit http://127.0.0.1:5173/

---

# Goals:

-   type-safety everywhere
-   best-in-class editor support both for `generated SDK` and within the `standalone IDE`.

---

## Comfy Wishlist

-   [ ] `store` node for persistng node output across flow evaluation
-   [ ] `promptID` that can be sent to the server to be included in every `'status'` , `'progress'` , `'executing'` & `'executed'` update payloads
