<div align="center">

# 🛋 CushyStudio - _Generative Art studio_

[![Windows Support](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![MacOS Support](https://img.shields.io/badge/MACOS-adb8c5?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![Ubuntu Support](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![Arch Linux Support](https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white)](https://github.com/rvion/CushyStudio/releases)

<!-- Introduction -->

`CushyStudio` is a **Graphical Software** for creatives and developpers, to create art, game assets,
or any other kind of 2d visual production (_generative art_). It aims to offers power-user tools via
a scripting layer, along modern tools to gather human-feedback and help with interractive curation
and guidance along generation processes. `CushyStudio` uses the [ComfyUI]() project as bakend to
execute your pipelines.

<!--
    Build and automate your art or game asset production.
    Deploy interractive generative art pipelines with human curation, validation and guidance.
-->

</div>

## Project status

| ![test](https://img.shields.io/badge/Stability-ALPHA-red?style=flat) | 👋 help welcome !                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                              `Build` | [![publish](https://github.com/rvion/CushyStudio/actions/workflows/publish.yml/badge.svg)](https://github.com/rvion/CushyStudio/actions/workflows/publish.yml) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rvion/CushyStudio?style=flat)                                                                         |
|                                                             `Growth` | ![GitHub all releases](https://img.shields.io/github/downloads/rvion/CushyStudio/total?style=flat) [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Frvion%2FCushyStudio&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com) |
|                                                          `Community` | [![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)                                                                                                                                                                                                                                                         |

<!-- ![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/CushyStudio?style=flat&logo=reddit) ![Twitter Follow](https://img.shields.io/twitter/follow/CushyStudio?style=flat&logo=twitter) -->

## Table of Contents 📌

-   [Features](#features) •
-   [Getting started](#getting-started) •
-   [Installation](#installation) •
-   [Configuration](#configuration) •
-   [Integrations](#third-party-integrations)

-   [Developpment](#developpment)
-   [Contributing](#contributing)
-   [Architecture](#architecture)

## Features-Set

_Project is still early, but here is an overview of the plan_

<!-- [🟢 = acceptable, 🟡 = partial, ☣️ = not ready] -->

-   🟡 **workspace and project management**
-   🟡 **Import** existing projects
    -   🟢 import from `ComfyUI`
    -   🔶 import from `Automatic1111`
    -   🔴 package assets with projects
-   🟡 **Installer**
    -   🟢 small footprint
    -   🔶 self-updating binary for simple
-   🔶 integrated `OpenPose` library to `puppet`, `animate`, `interpolate` frames of stickmans
    -   🟡 generate bone images from openpose definitions
    -
-   🔶 Interractive Evaluation
    -   🟢 `askString` question
    -   🟢 `askBoolean` question
    -   🔶 `choose best picture` question
    -   🔶 `choose next branch` question
    -   🔴 .... a lot more to be done
-   🟡 Deep ComfyUI Integration
    -   🟢 Custom nodes support
    -   🟢 Custom nodes support
-   ⏳ Civitai Integration
    -   🟡 search
-   🔶 Parrallel Execution
    -   🔶 multiple Comfy Server support
    -   🔶 multiple Comfy Server support
-   🟢 Work with cloud GPU offers
    -   🟢 yes, examples soon.

## Short-term Roadmap

WIP:

-   [ ] better onboarding UI to help people have a working setup
-   [ ] properly fix/finish workspace.openScript
-   [ ] finish loading projects

then

-   [ ] make websocker client resilient to network errors
-   [ ] save projects on disk / via metadata
-   [ ] improve comfy import
-   [ ] add folder of examples
-   [ ] button to open devtools
-   [ ] switch releases to allow for devtools

## Screenshots

![](website/static/img/screenshots/2023-03-24-09-29-45.png)

### Type-safe everywhere

![](website/static/img/screenshots/2023-03-18-23-13-53.png) -->

---

## Installation

You can either install by cloning the source and following the [developpment](#developpment) instructions, or by downloading the latest release.

1.  [install CushyStudio](http://github.com/rvion/CushyStudio/releases)
1.  [install ComfyUI](https://github.com/comfyanonymous/ComfyUI)
    -   [Download Models](scripts/download-models.sh)
    -   start Comfy `python main.py --listen 0.0.0.0`

---

## Getting started

This readme section will contain a minimalist tutorial so you can check everything works as expected.

TODO

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

## About - Goals with CushyStudio, License, and Sustainability

Here are my goals with CushyStudio :

-   Make a cool project that I love to play with.
-   Have fun with the Community (& grow a community ?).
-   Share a fun journey with collaborators.
-   No paywall, no restricted features, no crippling the project for the sake of making money.
-   Ensure the project remains free and open source.
-   Make some money in a non agressive way from those who can, to keep working and supporting CushyStudio.
-   I don't want people to be afraid of using CushyStudio because of some license problem.
-   I also don't want people reselling CushyStudio.
-   and I don't want to work for free.

=> I'll go with a **GPL** License + **Contributor License Agreement (CLA)**.

While it's free and open-source for all, I'll be able to:

-   Solicit donations, (though a Patreon or github support)
-   Sell support, either by contract or by incident.
-   Sell development services, where people pay to add features to CushyStudio.
-   Sell a non-GPL version of the code to companies that want to embed CushyStudio in their products.
-   ~~WON'T DO: sell a premium version with extra feature.~~
