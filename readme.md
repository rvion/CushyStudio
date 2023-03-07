# Intuition

-   a dev-oridented IDE to build and run any stable diffusion pipeline.
-   a typescript SDK to integrate any complex stable diffusion pipelines into your project
-   type-safety everywhere and best-in-class editor support both for `generated SDK` and `standalone IDE`
-   a SDK generator toolkit to generate SDKs for your own language.
-   built on top / aims to merge with the ComfyUI project.

---

## Comfy Wishlist

-   [ ] `store` node for persistng node output across flow evaluation
-   [ ] `promptID` that can be sent to the server to be included in every `'status'` , `'progress'` , `'executing'` & `'executed'` update payloads

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

## Current TODOs:

-   [ ] write some more TODOs
