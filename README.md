<div align="center">

# 🛋 CushyStudio

(ALPHA version)

## The most easy and powerful Stable Diffusion frontend

[![](https://dcbadge.vercel.app/api/server/GfAN6hF2ad)](https://discord.gg/GfAN6hF2ad)

</div>

![](docs/static/img/screenshots/2023-10-18-21-40-09.png)

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

# Overview

🎭 Cushy is made both for `Tinkereers` and for `artists`

<table class="tg">
<thead>
<tr>
<th class="tg-0pky">

# For artists

</th>
<th class="tg-0pky">

# For Tinkerers

</th>
</tr>
</thead>
<tbody>
<tr>
<td>

-   a full Action creation SDK
-   Deep integration with ComfyUI graph editor
-   a powerful **action publishing**

</td>
<td>

-   Simple and non technical `Actions`

    -   per use-case UI
    -   simple widgets

</td>
</tr>
</tbody>
</table>

---

## Details

## A marketplace of community-made Actions

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

![](docs/static/img/screenshots/2023-09-29-22-40-45.png)

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
