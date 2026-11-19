<a href="https://github.com/rvion/comfy-ts"><img src="docs/migrate-to-comfy-ts.png" alt="CushyStudio is legacy: move on to comfy-ts (bun add comfy-ts)" width="100%" /></a>

> [!IMPORTANT]
> **CushyStudio is a legacy project.** Its ComfyUI library is now a package of its own: **[comfy-ts](https://github.com/rvion/comfy-ts), an efficient way to create, run, maintain and operate your ComfyUI workflows, for humans and agents.** It has a terminal UI, a web panel and a guide for coding agents.
>
> ```sh
> bun add comfy-ts
> ```
>
> The Discord stays open, for comfy-ts and for CushyStudio.

<div align="center">

# 🛋️ CushyStudio

### _The **Generative AI Platform** for everyone_

<img height="21"  alt="Maturity"     src="https://img.shields.io/badge/status-LEGACY-lightgrey" />
<img height="21" alt="Build Status" src="https://img.shields.io/badge/build-passing-%20brightgreen" />
<img height="21"  alt="Activity"     src="https://img.shields.io/github/commit-activity/y/rvion/cushystudio" />

<!-- <img height="21"  alt="Sponsors"     src="https://img.shields.io/github/sponsors/rvion" /> -->

<!-- <br /> -->
<a href="https://discord.gg/GfAN6hF2ad">
    <img height="21" alt="Join our Discord" src="https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white">
</a>
<a href="https://twitter.com/_rvion">
    <img height="21" alt="Follow _rvion on Twitter" src="https://img.shields.io/badge/%40__rvion-666666?style=flat&logo=twitter&labelColor=555&label=Follow">
</a>

</div>

---



**CushyStudio** is the go-to platform for easy generative AI use, empowering creatives of any level to effortlessly create stunning images, videos, and 3D models.


**What You'll Love:**

* **CushyApps**: A collection of visual tools tailored for different artistic tasks. Simplify your AI art creation process and have fun exploring a wide range of versatile to niche tools in the Cushy Library.

* **CushyKit:** Speed up your projects with our extensive toolkit for custom apps development and task automation.  Quickly design interfaces, add custom logic, and access tools like ComfyUI in a user-friendly, preconfigured typescript environment.

**Dive into the AI Revolution with CushyStudio**. Unleash your creativity, share your projects, and connect with a vibrant community pushing the boundries of generative AI. Experience the fusion of simplicity and innovation.

> [!NOTE]
> CushyStudio is no longer under active development. The code stays here as it is, and some of it may not work with recent ComfyUI versions. New work on ComfyUI happens in [comfy-ts](https://github.com/rvion/comfy-ts): report its issues there, or ask on the Discord.

-----------

## QuickStart guide:

1. Have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed
2. Clone this repository with git
    ```sh
    git clone https://github.com/rvion/CushyStudio
    cd CushyStudio
    ```
3. Install with `_windows_INSTALL.bat` or `_mac-linux-install.sh`
4. Start with `_mac-linux-start.sh` or `_windows-start.bat`

----------

Screenshots and Videos


![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion-screenshots/2024-02-18_00-07-15.jpg)

![](https://cushy.fra1.cdn.digitaloceanspaces.com/old/screenshots/2024-02-02-example-panels.jpg)

<!--

screenshot ideas
- regional prompting
- model management
- videos
- animated-diff
-->

# Table of contents

* [🛋 CushyStudio](https://docs.cushystudio.com)

## Getting Started

* [🛠 Installation](https://docs.cushystudio.com/getting-started/installation)
  * [Installing Cushy](https://docs.cushystudio.com/getting-started/installation/windows)
  * [Updating Cushy](https://docs.cushystudio.com/getting-started/installation/updating-cushy)
  * [Installing Modules](https://docs.cushystudio.com/getting-started/installation/installing-modules)
    * [Install ComfyUI](https://docs.cushystudio.com/getting-started/installation/installing-modules/cloud)
    * [Install FFMpeg (optional)](https://docs.cushystudio.com/getting-started/installation/installing-modules/install-ffmpeg-optional)
    * [Installing Models](https://docs.cushystudio.com/getting-started/installation/installing-modules/installing-models)
    * [Install ImageMagick (optional)](https://docs.cushystudio.com/getting-started/installation/installing-modules/install-imagemagick-optional)
* [👋 First Steps](https://docs.cushystudio.com/getting-started/getting-started)
  * [Intro to Generative AI](https://docs.cushystudio.com/getting-started/getting-started/intro-to-generative-ai)
  * [Making an image](https://docs.cushystudio.com/getting-started/getting-started/making-an-image)
  * [Coming From...](https://docs.cushystudio.com/getting-started/getting-started/coming-from...)
* [🎁 Built-in apps](https://docs.cushystudio.com/getting-started/built-in-apps)
  * [CushyDiffusion](https://docs.cushystudio.com/getting-started/built-in-apps/cushydiffusion)
  * [Rotate anything](https://docs.cushystudio.com/getting-started/built-in-apps/rotate-anything)
  * [Cushy Cascade](https://docs.cushystudio.com/getting-started/built-in-apps/cushy-cascade)
  * [Remove Background](https://docs.cushystudio.com/getting-started/built-in-apps/remove-background)
  * [Slay the Spire - Art Pack](https://docs.cushystudio.com/getting-started/built-in-apps/slay-the-spire-art-pack)
  * [Manga Coloring](https://docs.cushystudio.com/getting-started/built-in-apps/manga-coloring)
* [🚶 Cushy Interface](https://docs.cushystudio.com/getting-started/cushy-interface)
  * [Minipaint](https://docs.cushystudio.com/getting-started/cushy-interface/minipaint)
  * [File Explorer](https://docs.cushystudio.com/getting-started/cushy-interface/file-explorer)
  * [Quick-Civitai](https://docs.cushystudio.com/getting-started/cushy-interface/quick-civitai)
  * [Iframes](https://docs.cushystudio.com/getting-started/cushy-interface/iframes)
    * [Minipaint](https://docs.cushystudio.com/getting-started/cushy-interface/iframes/minipaint)
    * [Civitai](https://docs.cushystudio.com/getting-started/cushy-interface/iframes/civitai)
  * [Image Comtext menu](https://docs.cushystudio.com/getting-started/cushy-interface/image-comtext-menu)
* [🍏 Images, Videos, 3d scenes](https://docs.cushystudio.com/getting-started/features)
  * [Quick Actions](https://docs.cushystudio.com/getting-started/features/quick-actions)
  * [LLM (Large Language Model)](https://docs.cushystudio.com/getting-started/features/llm)
* [😁 Unified canvas](https://docs.cushystudio.com/getting-started/unified-canvas)
  * [Starin](https://docs.cushystudio.com/getting-started/unified-canvas/starin)
  * [Inpainting](https://docs.cushystudio.com/getting-started/unified-canvas/inpainting)
  * [Outpainting](https://docs.cushystudio.com/getting-started/unified-canvas/outpainting)
* [🧪 Prompting](https://docs.cushystudio.com/getting-started/prompting)
  * [adding Loras](https://docs.cushystudio.com/getting-started/prompting/adding-loras)

## Going further

* [💡 Creating apps](https://docs.cushystudio.com/going-further/creating-apps)
  * [Creating a new App file](https://docs.cushystudio.com/going-further/creating-apps/creating-a-new-app-file)
  * [Prefabs](https://docs.cushystudio.com/going-further/creating-apps/prefabs)
  * [App Structure](https://docs.cushystudio.com/going-further/creating-apps/app-structure)
  * [Contextual Apps](https://docs.cushystudio.com/going-further/creating-apps/contextual-apps)
  * [For loops](https://docs.cushystudio.com/going-further/creating-apps/for-loops)
  * [App UI](https://docs.cushystudio.com/going-further/creating-apps/app-ui)
  * [Using ImageMagick in your app](https://docs.cushystudio.com/going-further/creating-apps/using-imagemagick-in-your-app)
* [⚙ CushyKit](https://docs.cushystudio.com/going-further/cushy-sdk)
* [🏈 Importing from ComfyUI](https://docs.cushystudio.com/going-further/importing-workflows)
* [🤝 Extending Cushy](https://docs.cushystudio.com/going-further/contribution)
  * [Setting up VSCode](https://docs.cushystudio.com/going-further/contribution/setting-up-vscode)
  * [Contributing on the UI](https://docs.cushystudio.com/going-further/contribution/contributing-on-the-ui)
  * [Database](https://docs.cushystudio.com/going-further/contribution/database)
  * [Migrations](https://docs.cushystudio.com/going-further/contribution/migrations)
* [🔥 Troubleshooting](https://docs.cushystudio.com/going-further/wip-pad)
  * [Page 1](https://docs.cushystudio.com/going-further/wip-pad/page-1)

## Community

* [🤝 Community](https://docs.cushystudio.com/community/community)
* [💬 FAQs](https://docs.cushystudio.com/community/faqs)
  * [⁉ Can Cushy...](https://docs.cushystudio.com/community/faqs/can-cushy...)
* [📰 News](https://docs.cushystudio.com/community/news)
  * [💬 Blog](https://docs.cushystudio.com/community/news/blog)
    * [2024-02-18 - creating the website](https://docs.cushystudio.com/community/news/blog/2024-02-18-creating-the-website)
  * [😁 Changelog](https://docs.cushystudio.com/community/news/changelog)
  * [🚀 Roadmap](https://docs.cushystudio.com/community/news/roadmap)
* [🚂 Other Softwares](https://docs.cushystudio.com/community/fast-track)
  * [Coming from Krita](https://docs.cushystudio.com/community/fast-track/coming-from-krita)
  * [Coming from A1111](https://docs.cushystudio.com/community/fast-track/coming-from-a1111)
  * [Coming from ComfyUI](https://docs.cushystudio.com/community/fast-track/coming-from-comfyui)
  * [Coming from InvokeAI](https://docs.cushystudio.com/community/fast-track/coming-from-invokeai)
  * [Coming from Fooocus](https://docs.cushystudio.com/community/fast-track/coming-from-fooocus)
* [Contributing](https://docs.cushystudio.com/community/contributing)
  * [Supporting the team](https://docs.cushystudio.com/community/contributing/supporting-the-team)
  * [Writing Docs](https://docs.cushystudio.com/community/contributing/guidelines)
