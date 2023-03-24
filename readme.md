<div align="center">

# CushyStudio

[![Windows Support](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![Ubuntu Support](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![Arch Linux Support](https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![Windows Support](https://img.shields.io/badge/MACOS-adb8c5?style=for-the-badge&logo=macos&logoColor=white)](https://github.com/rvion/CushyStudio/releases)

<!-- [![Downloads][downloads-badge]][releases] -->

<!-- https://shields.io/ -->

<!-- ![Discord](https://img.shields.io/discord/1087008112969531513) -->

<!-- https://discord.gg/GfAN6hF2ad -->

## **Full-featured** generative Art studio.

**🔴 EARLY ACCESS - ALPHA QUALITY 🔴**

Build and automate your art or game asset production.

Deploy interractive generative art pipelines with human curation, validation and guidance.

[Getting started](#getting-started) •
[Installation](#installation) •
[Configuration](#configuration) •
[Integrations](#third-party-integrations)

[![publish](https://github.com/rvion/CushyStudio/actions/workflows/publish.yml/badge.svg)](https://github.com/rvion/CushyStudio/actions/workflows/publish.yml)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rvion/CushyStudio)
![GitHub all releases](https://img.shields.io/github/downloads/rvion/CushyStudio/total)

![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/CushyStudio?style=flat&logo=reddit)
![Twitter Follow](https://img.shields.io/twitter/follow/CushyStudio?style=flat&logo=twitter)
[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Frvion%2FCushyStudio&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

[![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)

</div>

## Short-term Roadmap

-   [ ] make websocker client resilient to network errors
-   [ ] save projects on disk / via metadata
-   [ ] improve comfy import
-   [ ] add folder of examples
-   [ ] button to open devtools
-   [ ] switch releases to allow for devtools

## Getting started

<!-- ![](docs/images/2023-03-14_06-47-30.png) -->

![](website/static/img/screenshots/2023-03-24-09-29-45.png)

<!-- ## Features

-

### Type-safe everywhere

![](website/static/img/screenshots/2023-03-18-23-13-53.png) -->

---

## Installation

1.  [install CushyStudio](http://github.com/rvion/CushyStudio/releases)
1.  [install ComfyUI](https://github.com/comfyanonymous/ComfyUI)
    -   [Download Models](scripts/download-models.sh)
    -   start Comfy `python main.py --listen 0.0.0.0`

---

## Developpment

It's as easy as :

1.  Install [`rust`](rustup), [`node`]() and [`pnpm`]()
2.  clone this repo `git clone github.com/rvion/CushyStudio`
3.  install dependencies `pnpm install`
4.  start the dev server `pnpm dev`

---

## Contributing

`CushyStudio` welcomes contributors. We invite your participation through issues and pull requests! You can peruse the contributing guidelines.

See [#Developpment](#developpment) for how to install and get up and running

---

## Architecture

`CushyStudio` is a cross-platform application built using the [Tauri](https://tauri.studio) framework. Tauri is based on the OS specific webview and Rust to work. Read about tauri [here](https://tauri.studio/en/docs/about/intro)

`CushyStudio` is a polygot application. `CushyStudio` relies on Rust api for file operations and TS, SCSS for the webview. Rust code are under `src-tauri` directory whereas the webview code are under `src` directory. The API that connects webview with the Rust code is under `src/Api` directory.

<!-- This project has quite a backlog of suggestions! If you're new to the project, maybe you'd like to open a pull request to address one of them. -->

<!-- ## Comfy Wishlist

-   [ ] `store` node for persistng node output across flow evaluation
-   [ ] `promptID` that can be sent to the server to be included in every `'status'` , `'progress'` , `'executing'` & `'executed'` update payloads -->
