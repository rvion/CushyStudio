<div align="center">

# 🛋 CushyStudio - _Generative Art studio_

<!-- [![Windows Support](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![MacOS Support](https://img.shields.io/badge/MACOS-adb8c5?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![Ubuntu Support](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)](https://github.com/rvion/CushyStudio/releases)
[![Arch Linux Support](https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white)](https://github.com/rvion/CushyStudio/releases) -->

<!-- Introduction -->

`CushyStudio` is an AI-powered Generative-Art studio for creatives and developpers,
enabling new ways to produce art, assets, or animations.
It offers scripting tools and dynamic interfaces for live human-feedback, curation
and guidance along generation processes.
`CushyStudio` uses the [ComfyUI]() backend to execute your workflows.
`CushyStudio` is a cross-platform application distributed as a vscode extension.

[![publish](https://github.com/rvion/CushyStudio/actions/workflows/publish.yml/badge.svg)](https://github.com/rvion/CushyStudio/actions/workflows/publish.yml) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rvion/CushyStudio?style=flat)
![GitHub all releases](https://img.shields.io/github/downloads/rvion/CushyStudio/total?style=flat) [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Frvion%2FCushyStudio&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

[![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)

</div>

<!-- ![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/CushyStudio?style=flat&logo=reddit) ![Twitter Follow](https://img.shields.io/twitter/follow/CushyStudio?style=flat&logo=twitter) -->

## Table of Contents 📌

-   [Features](#features)
-   [Getting started](#getting-started)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Integrations](#third-party-integrations)
-   [Developpment](#developpment)
-   [Contributing](#contributing)
-   [Architecture](#architecture)

## Features-Set

_Project is still early, but here is an overview of the plan_

<!-- [🟢 = acceptable, 🔶 = partial, ☣️ = not ready] -->

-   ✅ **workspace and project management**
-   [ ] **manage ComfyUI installation**
    -   [ ] download and install custom nodes
    -   [ ] download and install various models
-   [◐] **Import** existing projects
    -   ✅ import from `ComfyUI images`
    -   [◐] import from `ComfyUI json`
    -   [◐] import from `Automatic1111`
    -   [ ] package assets with projects
-   [◐] **Installer**
    -   ✅ small footprint
    -   [◐] self-updating binary for simple
-   [◐] integrated `OpenPose` library to `puppet`, `animate`, `interpolate` frames of stickmans
    -   [◐] generate bone images from openpose definitions
-   [ ] image building API
    -   [ ] paint with words
    -   [ ] prefab library
-   [◐] Interractive Evaluation
    -   ✅ `askString` question
    -   ✅ `askBoolean` question
    -   [◐] `choose best picture` question
    -   [◐] `choose next branch` question
    -   [ ] .... a lot more to be done
-   [◐] Deep ComfyUI Integration
    -   ✅ Custom nodes support
-   [◐] Civitai Integration
    -   [◐] search
-   [◐] Parrallel Execution
    -   [◐] multiple Comfy Server support
    -   [◐] multiple Comfy Server support
-   ✅ Work with cloud GPU offers
    -   ✅ yes, examples soon.
-   [◐] QOL
    -   [◐] more shortcuts
    -   [ ] [open in explorer](https://github.com/tauri-apps/tauri/issues/4062#issuecomment-1338048169)

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

## Screenshots

![](website/static/img/screenshots/2023-03-24-09-29-45.png)

![](website/static/img/screenshots/2023-03-18-23-13-53.png) -->

---

## Installation

Util the CushyStudio is published on the vscode extension store, you need to clone this repository

1.  [install ComfyUI](https://github.com/comfyanonymous/ComfyUI)
    -   [Download Models](scripts/download-models.sh)
    -   start Comfy `python main.py --listen 0.0.0.0`
2.  clone this repository
    -   `git clone github.com/rvion/CushyStudio`
    -   `npm install`

---

## Getting started

This readme section will contain a minimalist tutorial so you can check everything works as expected.

1. create any file with name ending with `.cushy.ts`
2. CushyStudio will start automatically
3. ensure ComyUI server is connectly connected

---

## Developpment

It's as easy as :

1.  install [vscode](https://code.visualstudio.com/) and [`node`](https://nodejs.org/en)
2.  clone this repo `git clone github.com/rvion/CushyStudio` && `cd CushyStudio`
3.  install dependencies `npm install`
4.  start the dev server `npm dev`

---

<!-- This project has quite a backlog of suggestions! If you're new to the project, maybe you'd like to open a pull request to address one of them. -->

<!-- ## Comfy Wishlist

-   [ ] `store` node for persistng node output across flow evaluation
-   [ ] `promptID` that can be sent to the server to be included in every `'status'` , `'progress'` , `'executing'` & `'executed'` update payloads -->

## Goals, License, and Sustainability

Here are my goals with CushyStudio :

-   I want to make the best script-based generative-art studio and have fun in the process.
-   I want assets generated with CushyStudio to be free to use in commercial projects witout any restrictions.
-   I want CushyStudio to remain open-source and free to use as a creative tool.
-   This being said I don't want to work so that other can resell or redistribute CushyStudio, or make money off CushyStudio itself.
-   if you want to embed or redistribute CushyStudio code in your project, you'll have to contact me and buy a commercial license from me.
-   I don't want people to be afraid of using CushyStudio because of some license problem.
-   I also don't want people reselling CushyStudio.
-   and I don't want to work for free.

=> I'll proably go with a dual-license, **AGPL** by default, with a **Contributor License Agreement (CLA)**. so I can offer a commercial license in case anyone wants to make a

While it's free and open-source for all, I'll be able to:
Make some money in a non agressive way from those who can, to keep working and supporting CushyStudio.

-   Solicit donations, (though a Patreon or github support)
-   Sell support, either by contract or by incident.
-   Sell development services, where people pay to add features to CushyStudio.
-   Sell a non-GPL version of the code to companies that want to embed CushyStudio in their products.
-   ~~WON'T DO: sell a premium version with extra feature.~~
