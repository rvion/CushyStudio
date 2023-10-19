<div align="center">

#  🛋️ CushyStudio (Alpha)

## The **easiest** and most **powerful** Stable Diffusion frontend

[![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)

</div>

---

## Discover a world of `Actions`

-   CushyStudio ***Actions*** are interactive generative "apps" with dedicated UIs.
-   They make it super easy and fun to explore all generative art has to offer.
-   CushyStudio allows you to run, create, and share ***Actions***

<div style='display:flex;gap:1rem;'>

<img src='docs/static/img/screenshots/2023-10-18-22-12-01.png' style='width:60%'></img> <img src='docs/static/img/screenshots/2023-10-18-22-13-26.png' style='width:30%'></img>

</div>

🎭 Cushy is made both for Tinkereers and Artists

<table style='width:100%'>
<thead>
<tr>
<th>

# For Artists

</th>
<th>

# For Tinkerers

</th>
</tr>
</thead>
<tbody>
<tr>
<td>

-   Non-technical ***Actions*** interfaces

    -   Per use-case UI
    -   Simple widgets

-   Fast previews, real-time feedback

    -   Interactive at its core
    -   Real-time actions with continuous generations

-   Built-in commodities

    -   Image and Mask editors
    -   Modular Layout to keep every creative tool at hand

</td>
<td>

-   🚀 The most practical toolset to build actions

    -   Pre-configured ecosystem: NO SETUP NEEDED
    -   Built-in ***ComfyUI*** to ***Action*** converter
    -   Graphical Action builder
    -   A full ***TypeScript Action SDK*** + Compiler to go further

-   🧠 ***ComfyUI*** engine At its core

    -   All custom nodes are supported
    -   Deep integration with ***ComfyUI Graph***
    -   A well-thought interface to explore and play with nodes

-   💪 From 0 to 100 in no time

    -   Modularize, reuse, and grow your toolset
    -   Share your actions with the world

</td>
</tr>
</tbody>
</table>

![](docs/static/img/screenshots/2023-10-18-21-40-09.png)

# Installation

Ensure you have:

-   [NodeJS](https://nodejs.org/en/download) installed (18 or higher)
-   [ComfyUI](https://github.com/comfyanonymous/ComfyUI) installed
-   [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed

Install CushyStudio by running these commands in a terminal

```sh
git clone https://github.com/rvion/CushyStudio
cd CushyStudio
npm install
npm start
```

# Quickstart Guide

When you start `CushyStudio` ... TODO

## See it in action

TODO: place video here

# Features

## Work with remote ComfyUI as if they were local

-   Automatically download images in your local outputs folder
-   Automatically upload files

## Switch between ComfyUI remotes like you would

-   ✅ Quickly switch between various ComfyUI setups
-   ⏳ Parallelize work across multiple instances

Edit the list of ComfyUI setups in `CONFIG.json`

![](docs/static/img/screenshots/2023-10-18-21-41-49.png)

https://github.com/rvion/CushyStudio/assets/2150990/2121db07-c246-4523-ac0e-294572450b32

## ComfyUI compatible: Convert workflow to Action.

***🛋️ CushyStudio*** is directly compatible with ***ComfyUI*** workflow json format and images. Add them to the action folder to quickly use them inside CushyStudio.

## Real-time enabled

https://github.com/rvion/CushyStudio/assets/2150990/d71d7f9a-b0e9-415d-ab5a-7852b17894dc

## Built-in CivitAI integration

![](docs/static/img/screenshots/2023-10-19-00-31-02.png)

-   ✅ Embedded Civitai browser
-   ✅ Civitai custom ComfyUI Nodes support
-   ✅ Dedicated Civitai input widgets to augment your own actions

## Built-in full-featured Image Editor

Layers, effects, masks, blending modes, ...and more. Always one click away

![](docs/static/img/screenshots/2023-10-18-22-51-22.png)

## Easy to extend

👉 In case you have a problem, check the logs and report what you see

<details>
  <summary> Click here to see how to reveal the debug console</summary>

![](docs/static/img/screenshots/2023-10-03-22-36-49.png)

</details>

## 3. Create your own Actions to streamline any image or video production

![](docs/static/img/screenshots/2023-09-29-22-35-25.png)

<p align="center">
  <img alt="Light" src="./docs/static/img/screenshots/2023-09-29-22-37-47.png" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark" src="./docs/static/img/screenshots/2023-09-30-08-40-13.png" width="45%">
</p>

1. Define your own UI
2. Build one or many prompts with custom logic in TypeScript
3. Type-safe experience pushed to the MAXIMUM
    1. Every single value/enum is typed
    2. A built-in standard library made to quickly build your dream workflow
    3. Use lambda to get completion only for the node that produces the value needed

<!-- global config file to change the path to ComfyUI:

```
./workspace/CONFIG.json
``` -->

<!--

---

# Features

- Custom nodes
- maximum type safety when writing scripts
-->

---

# Quickstart Guide For Action Creators

***🛋️ CushyStudio*** comes packed with features to allow you to create your own AI-powered image and video creation tools.

In Cushy, tools are called `Actions`.

Creating actions is easy because `🛋️ CushyStudio`

1. On startup, ensure ***CushyStudio*** is connected to some ***ComfyUI*** server

    - A whole ***TypeScript Action SDK*** will be generated in the `schema/` folder
    - All your custom nodes, models, and images will be converted to `enums`, `classes`, `helpers`, etc, allowing you to create actions with maximum type safety and completion.

1. Create a folder in the `actions/` subfolder at the root
1. Create any `myaction.ts` file inside this folder
1. Open the whole ***CushyStudio*** repository in ***Visual Studio Code***

    - 👉 Open the whole CushyStudio installed repository
    - NOT just the action folder, NOR the action file itself, but:

1. Initialize your action from some basic code or generated code from existing workflows

    ```ts
    action('demo1-basic', {
        author: 'rvion',
        // A. define the UI
        ui: (form) => ({
            positive: form.str({ label: 'Positive', default: 'flower' }),
        }),
        // B. defined the execution logic
        run: async (action, form) => {
            //  build a ComfyUI graph
            const graph = action.nodes
            const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'albedobaseXL_v02.safetensors' })
            const seed = action.randomSeed()
            const sampler = graph.KSampler({
                seed: seed,
                steps: 20,
                cfg: 14,
                sampler_name: 'euler',
                scheduler: 'normal',
                denoise: 0.8,
                model: ckpt,
                positive: graph.CLIPTextEncode({ text: form.positive, clip: ckpt }),
                negative: graph.CLIPTextEncode({ text: '', clip: ckpt }),
                latent_image: graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 }),
            })

            graph.SaveImage({
                images: graph.VAEDecode({ samples: sampler, vae: ckpt }),
                filename_prefix: 'ComfyUI',
            })

            // run the graph you built
            await action.PROMPT()
        },
    })
    ```

1. See how actions look like by dropping any ***ComfyUI*** `workflow` or `image` into the action and looking at the `converted.ts`

An Action is a file containing

-   An UI definition (widgets, form, styles, default values, tabs, etc...) (a bit like Gradio in Python)
-   A piece of code that runs your action
-   ...And more

## Publish your Action pack

Publishing your action is easy!

1.  Create a GitHub repository. (https://github.com/new)

    ![](docs/static/img/screenshots/2023-10-18-23-15-11.png)

2.  Commit your actions files (follow instructions given by Git Hub on the new repository page).

3.  Open an issue asking to add your `action pack` to the `marketplace`.

    -   https://github.com/rvion/CushyStudio/issues/new/choose

<details>
<summary>SHOW EXAMPLE</summary>

```sh
cd actions/rvion

git init
Initialized empty Git repository in /Users/loco/dev/CushyStudio/actions/rvion/.git/

git add .

git commit -m "first commit"
[master (root-commit) 602fab1] first commit
 4 files changed, 146 insertions(+)
 create mode 100644 mask-face.ts
 create mode 100644 rembg.ts
 create mode 100644 replace-part.ts
 create mode 100644 test.ts

git remote add origin git@github.com:rvion/cushy-example-actions.git
```

Then open an issue asking [there](https://github.com/rvion/CushyStudio/issues/new/choose)

</details>
