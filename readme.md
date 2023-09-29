<div align="center">

# 🛋 CushyStudio

### `CushyStudio`: a Awesome Stable Diffusion Frontend.

<div>CushyStudio is a Modern, Cross-platform, Extensible, Scriptable, full-featured Stable Diffusion and generative art GUI. Alpha Quality </div>

</div>

# Installation

```sh
git clone https://github.com/rvion/CushyStudio
cd CushyStudio
npm install
npm start
```

# Features

## 1. Turn any ComfyUI workflow into a powerful Action with dedicated UI custom execution logic

![](docs/static/img/screenshots/2023-09-29-21-15-36.png)

## 2. Edit and Inpaint like a pro

![](docs/static/img/screenshots/2023-09-29-22-40-45.png)

1. layers, efects, masks, blending modes, etc. You name it.

## 3. create your own Actions with a

![](docs/static/img/screenshots/2023-09-29-22-35-25.png)

![](docs/static/img/screenshots/2023-09-29-22-37-47.png)

1. define your own UI
2. build one or many prompts with custom logic in typescript
3. type-safe experience pushed to the MAXIMUM
    1. every single value / enum is typed
    2. a built-in standard library made to quickly build your dream workflow
    3. use lambda to get completion only for the node that produce value needed

<!-- global config file to change path to ComfyUI:

```
./flows/CONFIG.json
``` -->

<!--

---

# Features

- Custom nodes
- maximum type safety when writing scripts
-->
