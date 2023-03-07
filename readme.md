# Intuition

-   a dev-oridented IDE to build and run any stable diffusion pipeline.
-   a typescript SDK to integrate any complex stable diffusion pipelines into your project
-   a SDK generator toolkit to generate SDKs for your own language.
-   built on top / aims to merge with the ComfyUI project.

planned features:

    - SDK generator for a few languages (typescript, C++) so anyone can embed satble diffusion pipeline
    - standalone web editor to `build` and `build` any complex stable diffusion
    - type-safety everywhere and best-in-class editor support both for `generated SDK` and `standalone IDE`

---

## Comfy Wishlist

-   [ ] `store` node for persistng node output across flow evaluation

## main scripts

```sh
yarn sync # update ./src/core/ComfySpec.json from server
yarn lib # generate a type-safe library from the spec fetched
yarn dev # start the UI dev-server
```

---

## initial setup

needed:

-   node: js runtime
-   yarn: package manager
-   nvm: node version manager

```sh
# use node 19
nvm use 19 --default

# install all dependencies
yarn install
```
