<div align="center">

# 🛋 CushyStudio

(ALPHA version)

## The most easy and powerful Stable Diffusion frontend

[![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)

</div>

![](docs/static/img/screenshots/2023-10-18-21-40-09.png)

---

# Overview

🎭 Cushy is made both for `Tinkereers` and for `artists`

<table style='width:100%'>
<thead>
<tr>
<th>

# For artists

</th>
<th>

# For Tinkerers

</th>
</tr>
</thead>
<tbody>
<tr>
<td>

-   Simple and non technical `Actions`

    -   per use-case UI
    -   simple widgets
    -

</td>
<td>

-   a full Action creation SDK
-   Deep integration with ComfyUI graph editor
-   a powerful **action publishing**

</td>
</tr>
</tbody>
</table>

# Installation

Ensure you have

-   [NodeJS](https://nodejs.org/en/download) installed (18 or higher)
-   [ComfyUI](https://github.com/comfyanonymous/ComfyUI) installed
-   [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed

Install CushyStudio by running these command in a terminal

```sh
git clone https://github.com/rvion/CushyStudio
cd CushyStudio
npm install
npm start
```

---

# Intro Guide For Tinkerers

`🛋️ CushyStudio` comes packed with feature to allow you to create your own AI-powered image and video creation tools.

In Cushy, tools are called `Actions`.

Creating actions is easy because `🛋️ CushyStudio`

1. on startup, ensure `CushyStudio` is connected to some `ComfyUI` server

    - a whole `typescript SDK` will be generated in the `schema/` folder
    - All your custom nodes, models, images will be converted to `enums`, `classes`, `helpers`, etc allowing you to create actions with maximum type safety and completion.

1. create a folder in the `actions/` subfolder at the root
1. create any `myaction.ts` file inside this folder
1. open the whole CushyStudio repository in `vscode`

    - 👉 open the whole CushyStudio installed repository
    - NOT just the action folder, NOR the action file itself, but

1. initialize your action from some basic code or generated code from existing workflows

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

1. see how actions look like by dropping any ComfyUI `workflow` or `image` into the action and looking at the conver

An Action is a file containing

-   A UI definition (widgets, form, styles, default values, tabs, etc...) (a bit like gradio in python)
-   A piece of code that runs your action
-   ... more stuff

## Publish your Action pack

Publishing your action is easy !

1.  Create a github repository. (https://github.com/new)

    ![](docs/static/img/screenshots/2023-10-18-23-15-11.png)

2.  Commit your actions files (follow instructions given by github on the new repository page).

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

then open an issue asking [there](https://github.com/rvion/CushyStudio/issues/new/choose)

</details>

## A powerful `Action` creation SDK

-   create tailor-made UI on top of your ComfyUI workflow.
-   only display relevant widgets

<div style='display:flex;gap:1rem;'>

<img src='docs/static/img/screenshots/2023-10-18-22-12-01.png' style='width:60%'></img> <img src='docs/static/img/screenshots/2023-10-18-22-13-26.png' style='width:30%'></img>

</div>

## Work with remote ComfyUI as if they were local

-   automatically download images in your local outputs folder
-   automatically upload files

## Switch between ComfyUI remotes like you would

-   ✅ quickly switch between various ComfyUI setups
-   ⏳ parallelize work across multiple instances

edit the list of ComfyUI setups in `CONFIG.json`

![](docs/static/img/screenshots/2023-10-18-21-41-49.png)

https://github.com/rvion/CushyStudio/assets/2150990/2121db07-c246-4523-ac0e-294572450b32

## ComfyUI compatible: convert workflow to Action.

`🛋️ CushyStudio` is directly compatible with `ComfyUI` workflow json format and images. Add them to the action folder to quickly use them inside Cushy.

## Built-in full-featured Image editor

Layers, efects, masks, blending modes, ...and more. Always one click away

![](docs/static/img/screenshots/2023-10-18-22-51-22.png)

## Easy to extend

👉 In case you have a problem, can you check the logs and report what you see ?

<details>
  <summary>click here to see how to reveal the debug console</summary>

![](docs/static/img/screenshots/2023-10-03-22-36-49.png)

</details>

## 3. create your own Actions to streamline any image or video production

![](docs/static/img/screenshots/2023-09-29-22-35-25.png)

<p align="center">
  <img alt="Light" src="./docs/static/img/screenshots/2023-09-29-22-37-47.png" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark" src="./docs/static/img/screenshots/2023-09-30-08-40-13.png" width="45%">
</p>

1. define your own UI
2. build one or many prompts with custom logic in typescript
3. type-safe experience pushed to the MAXIMUM
    1. every single value / enum is typed
    2. a built-in standard library made to quickly build your dream workflow
    3. use lambda to get completion only for the node that produce value needed

<!-- global config file to change path to ComfyUI:

```
./workspace/CONFIG.json
``` -->

<!--

---

# Features

- Custom nodes
- maximum type safety when writing scripts
-->
