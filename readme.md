<div align="center">

# 🛋 CushyStudio - _Generative Art studio_

`CushyStudio` is an AI-powered Generative-Art studio for creatives and developpers,
enabling new ways to produce art, assets, or animations.
It offers scripting tools and dynamic interfaces for live human-feedback, curation
and guidance along generation processes. It is cross-platform and open-source.

👉 requires a [ComfyUI](https://github.com/comfyanonymous/ComfyUI) setup available.

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rvion/CushyStudio?style=flat)
![Visual Studio Marketplace Version (including pre-releases)](https://img.shields.io/visual-studio-marketplace/v/rvion.cushystudio?include_prereleases)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/rvion.cushystudio)

[![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)

|
[Features](#features) |
[Getting started](#getting-started) |
[🗂️ Installation](#🗂️-Installation) |
[🎉 Getting Started](#-Getting-Started) |
[Configuration](#configuration) |
[Integrations](#third-party-integrations) |
[Developpment](#developpment) |
[Contributing](#contributing) |
[Architecture](#architecture) |

</div>

---

<div align="center">

<!-- https://stackoverflow.com/questions/4279611/how-to-embed-a-video-into-github-readme-md/4279746#4279746 -->
<!-- [![video](./public/2023-04-16_15-48-30.mp4)](./public/2023-04-16_15-48-30.mp4) -->

https://user-images.githubusercontent.com/2150990/235221672-8aa28171-0734-4e57-8f9d-ce8b0889f179.mp4

</div>

## Introduction

-   CushyStudio allows you to build **self-contained mini-application** called **workflows** .
    you're a character artist, you can probably automate your wokflow with a few scripts and a few interractive widgets.

<!-- ![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/CushyStudio?style=flat&logo=reddit) ![Twitter Follow](https://img.shields.io/twitter/follow/CushyStudio?style=flat&logo=twitter) -->

<!-- ![](website/static/img/screenshots/2023-03-24-09-29-45.png) -->
<!-- ![](website/static/img/screenshots/2023-03-18-23-13-53.png) -->

---

## 🗂️ Installation

1. install [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
    - [Download Models](scripts/download-models.sh) (🔶 temporary, until CushyStudio can download them for you)
    - start Comfy `python main.py --listen 0.0.0.0`
2. install [vscode](https://code.visualstudio.com/)
3. install `CushyStudio` in the extension menu

    - [(maretplace link)](https://marketplace.visualstudio.com/items?itemName=rvion.cushystudio)

    <!-- ![](docs/static/img/screenshots/2023-04-17-21-59-43.png) -->

    ![](docs/static/img/screenshots/2023-04-18-00-27-02.png)

4. configure your server properly in your vscode settings (`.vscode/settings.json`)

    ```jsonc
    {
        "cushystudio.serverHostHTTP": "http://192.168.1.20:8188", // include the protocol, no trailing slash /
        "cushystudio.serverWSEndoint": "ws://192.168.1.20:8188/ws" // ws endpoint path mandatory (here: /ws)
    }
    ```

    (🔶 you may need to restart vscode for now, until I make the config dynamic)

---

## 🎉 Getting Started

1. ensure you have `ComfyUI` running and accessible from your machine and the `CushyStudio` extension installed.
1. start vscode and open a folder or a workspace ( 👉you need a folder open for cushy to work)
1. create a new file ending with `.cushy.ts` (e.g. `demo-1.cushy.ts`)
1. you should see CushyStudio activating

    - it will create a `.cushy` folder at the root of your workspace, that will contain typescript definitions

        ![](docs/static/img/screenshots/2023-04-17-21-48-42.png)

1. CushyStudio extension should start automatically

    - it will create a `.cushy` folder at the root of your workspace

1. ensure ComyUI server is connectly connected (check the "Cushy" **status bar** at the bottom)

```ts
WORKFLOW('demo-1', async ({ graph, flow }) => {
    //                                                      V replace this string with one you have
    const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'deliberate_v2.safetensors' })
    const latent = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = graph.CLIPTextEncode({ text: 'masterpiece, (chair:1.3)', clip: ckpt })
    const negative = graph.CLIPTextEncode({ text: '', clip: ckpt })
    const sampler = graph.KSampler({
        seed: flow.randomSeed(),
        steps: 20,
        cfg: 10,
        sampler_name: 'euler',
        scheduler: 'normal',
        denoise: 0.8,
        model: ckpt,
        positive,
        negative,
        latent_image: latent,
    })
    const vae = graph.VAEDecode({ samples: sampler, vae: ckpt })
    graph.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    await flow.PROMPT()
})
```

## 💡 Key Concepts

-   **WORKFLOW**: a workflow is a script that define a self-contained mini-application, with persistent config, controls, interractive widgets, etc. If you're a character artist, you can probably automate your wokflow with a few scripts and a few interractive widgets.

-   Workflows gives you access to various `APIs` you can use to build your mini-app

```ts
WORKFLOW('demo-1', async ({ graph, flow }) => {
    // ...
})
WORKFLOW('demo-1', async ({ preset }) => {
    // ...
})
WORKFLOW('demo-1', async ({ preset, openpose, stage }) => {
    // ...
})
```

## 🛟 Intellisense, Validation, Type safety

when everything is correctly configured, you should have autocompletion for most values, and type checks almost everywhere.

![](docs/static/img/screenshots/2023-04-18-00-30-30.png)

---

# 🥷 Keyboard Shortcuts

VScode is packed with keyboard shortcuts.

By default, you can run any workflow by moving anywhere in a script and typing

| command                  | macos         | windows        |
| ------------------------ | ------------- | -------------- |
| trigger autocompletion   | `ctrl+space`  | `ctrl+shift+e` |
| focus file tree          | `cmd+shift+e` | `ctrl+shift+e` |
| focus left pane          | `cmd+1`       | `ctrl+1`       |
| focus right pane         | `cmd+2`       | `ctrl+2`       |
| Test: Run Test at cursor | `cmd+;` `c`   | `ctrl+;` `c`   |
| toggle word wrap         | `alt+z`       | `alt+z`        |
| open the command palette | `cmd+shift+p` | `ctrl+shift+p` |
| jump to a file           | `cmd+p`       | `ctrl+p`       |

📝 all shortcuts are discoverable using the command palette (`cmd+shift+p` or `ctrl+shift+p`)
📝 in the command palette, click on the cog icon on the left of any command to add/edit its keybinding.

---

## 💎 dynamic features

`CushyStudio` scripts come packed with dynamic features
to make your flow more interactive and dynamic:

```ts
WORKFLOW("test", async ({graph, flow}) => {
```

```ts
export interface IFlowExecution {
    // flow dependencies params
    addParam(param: FlowParam): void

    // random value generation
    randomSeed(): number
    range(start: number, end: number, increment?: number): number[]

    ensureModel(p: { name: string; url: string }): Promise<void>
    ensureCustomNodes(p: { path: string; url: string }): Promise<void>

    // debug
    print(msg: Printable): void
    showHTMLContent(content: string): void
    showMarkdownContent(content: string): void
    createAnimation(
        /** image to incldue (defaults to all images generated in the run) */
        source?: IGeneratedImage[],
        /** frame duration, in ms:
         * - default is 200 (= 5fps)
         * - use 16 for ~60 fps
         * */
        frameDuration?: number,
    ): Promise<void>

    // path manipulation
    resolveRelative(path: string): RelativePath
    resolveAbsolute(path: string): AbsolutePath

    // file upload
    uploadWorkspaceFile(path: string): Promise<ComfyUploadImageResult>
    uploadWorkspaceFileAndLoad(path: string): Promise<LATER<'LoadImage'>>
    uploadAnyFile(path: string): Promise<ComfyUploadImageResult>
    uploadURL(url: string): Promise<ComfyUploadImageResult>

    // interractions
    askBoolean(msg: string, def?: Maybe<boolean>): Promise<boolean>
    askString(msg: string, def?: Maybe<string>): Promise<string>
    askPaint(msg: string, path: string): Promise<string>

    // commands
    exec(cmd: string): string
    sleep(ms: number): Promise<void>

    // file features
    saveTextFile(relativePath: string, content: string): Promise<void>

    // summary
    writeFlowSummary(): void
    get flowSummaryMd(): MDContent
    get flowSummaryHTML(): HTMLContent

    // prompts
    PROMPT(): Promise<IPromptExecution>
    wildcards: Wildcards

    // images
    generatedImages: IGeneratedImage[]
    get firstImage(): IGeneratedImage
    get lastImage(): IGeneratedImage
}
```

## 🐰 Relation With ComfyUI

-   `ComfyUI` is a powerful and modular stable diffusion backend (and graph GUI).
-   `CushyStudio` will connect to your ComfyUI server, fetch the schema of all available nodes, generates a typescript SDK, augment it with extra interractive features, and expose it to your scripts along a self contained runtime.

---

## 🐍 Custom node support

`CushyStudio` will automatically generate a typescript SDK for all nodes available on your ComfyUI server. **INCLUDING CUSTOM NODES**.

if your custom node does not work with cushy studio, you should open an issue.

I'll try my best to setup your custom nodes locally to ensure they work well with cushy.
I can possibly also add dedicated support or custom ui widget for your custom nodes, contact me on discord or github.

nodes I've setup locally:

-   ComfyUI-Impact-Pack https://github.com/ltdrdata/ComfyUI-Impact-Pack
-   comfy_controlnet_preprocessors: https://github.com/Fannovel16/comfy_controlnet_preprocessors
-   ComfyUI_Cutoff: https://github.com/BlenderNeko/ComfyUI_Cutoff
-   was-node-suite-comfyui: https://github.com/WASasquatch/was-node-suite-comfyui
-   comfy_clipseg https://github.com/diffus3/comfy_clipseg
-   WIP tiled sampling for ComfyUI https://github.com/BlenderNeko/ComfyUI_TiledKSampler
-   ComfyUI Noise https://github.com/BlenderNeko/ComfyUI_Noise
-   ComfyUI_Dave_CustomNode:
-   ComfyUI-nodes-hnmr:
-   efficiency-nodes-comfyui:
-   example_node.py.exampl:
-   JustNetralExtras:
-   yk-node-suite-comfyui

want to add your own custom node to the list? open a PR!

## 🤝 Contributing

1. install [vscode](https://code.visualstudio.com/)
2. install [node](https://nodejs.org/en)
    - I use `v19.9.0`
    - I recommand using [nvm (node version manager)](https://github.com/nvm-sh/nvm) to install it
        - install nvm: https://github.com/nvm-sh/nvm#install--update-script
        - install node: `nvm install v19.9.0`
        - then `nvm use v19.9.0 --default`
3. clone the repo and install dependencies
    ```sh
    git clone https://github.com/rvion/CushyStudio.git
    cd CushyStudio
    npm install
    ```
4. watch/build the extension front and back
    ```sh
    npm run back:dev   # build and watch the extension node part
    npm run front:dev  # build and watch the extension webview part
    ```
5. open a new vscode in `extension development` mode

    - with `F5` (recommanded) from the vscode extension source
        - or with `npm run vscode:dev` (may not properly reload)
          ![](docs/static/img/screenshots/2023-05-07-19-43-19.png | height=200)

6. open the WebUI at [http://localhost:5173/](http://localhost:5173/)

<details>
<summary>
pointers: add a new interraction
</summary>
-   in `src/core-types/MessageFromExtensionToWebview.ts`:

    -   see `type MessageFromExtensionToWebview`
    -   see `type MessageFromWebviewToExtension`

-   in `src/core-back/FrontWebview.ts`,

    -   see `onMessageFromWebview` function

-   in `src/core-front/FrontState.ts`

    -   see `onMessageFromExtension` function

-   in `src/ui/WebviewUI.tsx`, to add custom ui for your step
</details>

---

## ✅ Early Features-Set / Roadmap

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
-   [✅] Deep ComfyUI Integration
    -   ✅ Custom nodes support
-   [◐] Civitai Integration
    -   [◐] search
-   [◐] Parrallel Execution
    -   [◐] multiple Comfy Server support
    -   [◐] multiple Comfy Server support
-   ✅ Work with cloud GPU offers
    -   ✅ yes, examples soon.
-   [✅] QOL
    -   [✅] more shortcuts
    -   [✅] open in explorer
-   MISC
    -   [ ] better onboarding UI to help people have a working setup
    -   [ ] properly fix/finish workspace.openScript
    -   [ ] finish loading projects
    -   [ ] save projects on disk / via metadata
    -   [✅] improve comfy import
    -   [ ] add folder of examples

---

## 🚧 Architecture

-   `CushyStudio` is a packaged as a **VSCode extension**, but has few dependencies on VSCode itself, and use to be independent from it. VSCode simply turned out to be the best target / shell I found for the project.

I treat VSCode as a cross platform standalone `web browser distribution` + `nodejs distribution` + `typescript distribution` + `Marketplace / distribution canal (through it's extension canal)` + `update system` + `script editor UI` + `powerfull window system with dockable, logs windows` + `keybinding cloud save` + `productivity toolset`.

-   It's unusual, but it makes perfect sense. Before being a vscode extension, it used to be
    -   a standalone webpage made to be embbeed
    -   then a regular web app with a deno server
    -   then an electron app
    -   then a tauri app
    -   then a vscode extension

VScode simply turned out to be best host I found for a script-based generative-art studio.

-   A: because vscode can be seen as a standalone `web browser distribution` + `nodejs distribution` + `script editor UI` + `typescript distribution` + `productivity toolset`
    -   the `vscode` extension spwan `nodejs` processes and open `webviews`.
    -   it has with config saving, it has a great keybinding system, with great set of default shortcuts.
    -   plugin ditribution is easy, no need to bother with complex binary signing processes, or app-store validation processes.
    -   A large part of my audience (myself included) already has vscode setup.
    -   it offers a principled way to create productivity tools.

---

## ❤️ Goals, License, and Sustainability

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
