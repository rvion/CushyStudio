<div align="center">

# 🛋 CushyStudio - _Generative Art studio_

`CushyStudio` is an AI-powered Generative-Art studio for creatives and developpers,
enabling new ways to produce art, assets, or animations.
It offers scripting tools and dynamic interfaces for live human-feedback, curation
and guidance along generation processes. It is cross-platform and open-source.

`CushyStudio` requires a [ComfyUI]() installation to execute your workflows.

`CushyStudio` is a cross-platform application distributed as a vscode extension.

[![publish](https://github.com/rvion/CushyStudio/actions/workflows/publish.yml/badge.svg)](https://github.com/rvion/CushyStudio/actions/workflows/publish.yml)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rvion/CushyStudio?style=flat)
![GitHub all releases](https://img.shields.io/github/downloads/rvion/CushyStudio/total?style=flat)

[![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)

|
[Features](#features) |
[Getting started](#getting-started) |
[Installation](#installation) |
[Configuration](#configuration) |
[Integrations](#third-party-integrations) |
[Developpment](#developpment) |
[Contributing](#contributing) |
[Architecture](#architecture) |

</div>

<!-- ![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/CushyStudio?style=flat&logo=reddit) ![Twitter Follow](https://img.shields.io/twitter/follow/CushyStudio?style=flat&logo=twitter) -->

![](website/static/img/screenshots/2023-03-24-09-29-45.png)

![](website/static/img/screenshots/2023-03-18-23-13-53.png)

---

## Install

1. [install ComfyUI](https://github.com/comfyanonymous/ComfyUI)

    - [Download Models](scripts/download-models.sh)
    - start Comfy `python main.py --listen 0.0.0.0`

2. install [vscode](https://code.visualstudio.com/) and [`node`](https://nodejs.org/en)

3. install `CushyStudio` (later: will be in the vscode marketplace)

    ```sh
    git clone github.com/rvion/CushyStudio
    cd CushyStudio
    npm install

    npm run vscode:dev # start a `vscode in development mode`
    npm run back:dev   # build and watch the extension node part
    npm run front:dev  # build and watch the extension webview part
    ```

4. configure your server properly in your vscode settings (`.vscode/settings.json`)

```json
{
    "cushystudio.serverHostHTTP": "http://192.168.1.20:8188", // include the protocol, no trailing slash /
    "cushystudio.serverWSEndoint": "ws://192.168.1.20:8188/ws" // ws endpoint path mandatory (here: /ws)
}
```

---

## Getting started

This readme section will contain a minimalist tutorial so you can check everything works as expected.

1. create any file with name ending with `.cushy.ts`
2. CushyStudio will start automatically
3. ensure ComyUI server is connectly connected

---

<!-- This project has quite a backlog of suggestions! If you're new to the project, maybe you'd like to open a pull request to address one of them. -->

<!-- ## Comfy Wishlist

-   [ ] `store` node for persistng node output across flow evaluation
-   [ ] `promptID` that can be sent to the server to be included in every `'status'` , `'progress'` , `'executing'` & `'executed'` update payloads -->

## Goals, License, and Sustainability

Here are my updated goals with CushyStudio, since the vscode rewrite:

-   I want to make the best script-based generative-art studio and have fun in the process.
-   I want assets generated with CushyStudio to be free to use in commercial projects witout any restrictions.
-   I want CushyStudio to remain open-source and free to use as a creative tool.
-   This being said I don't want to work so that other can resell or redistribute CushyStudio, or make money off CushyStudio itself directly.
-   if you want to embed or redistribute part of CushyStudio code itself in your project, you'll have to contact me and buy a commercial license from me.

=> I'll proably go with a dual-license, a default **(A?)GPL** with a **Contributor License Agreement (CLA)**. so I can offer a commercial license in case anyone wants to make a

I think this is the best compromise: while it's free and open-source for all,
I'll still be able to make some money in a non agressive way from those who can:

-   Solicit donations, (though a Patreon or github support)
-   Sell support, either by contract or by incident.
-   Sell development services, where people pay to add features to CushyStudio.
-   Sell a non-GPL version of the code to companies that want to embed CushyStudio in their products.
-   ~~WON'T DO: sell a premium version with extra feature.~~

This way, I'll be able to keep working and supporting CushyStudio for the years to come. 🚀

## Early Features-Set / Roadmap

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
-   MISC
    -   [ ] better onboarding UI to help people have a working setup
    -   [ ] properly fix/finish workspace.openScript
    -   [ ] finish loading projects
    -   [ ] save projects on disk / via metadata
    -   [ ] improve comfy import
    -   [ ] add folder of examples

## Architecture

-   `CushyStudio` is a distributed as a **vscode extension**.
-   It's a `node` application that runs as a set of `vscode` subprocess and embedded webviews.
-   before being a vscode extension, it used to be
    -   a standalone webpage made to be embbeed
    -   then a regular web app with a deno server used to be a standalone electron app.
    -   then an electron app
    -   then a tauri app
    -   then a vscode extension
