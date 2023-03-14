<div align="center">

# StableIDE

[![Downloads][downloads-badge]][releases]

StableIDE is a **Full-featured** web-based stable-diffusion playground IDE.

Build multi-step stable diffusion pipelines.
Handle loops, manual image selection steps.

[Getting started](#getting-started) •
[Installation](#installation) •
[Configuration](#configuration) •
[Integrations](#third-party-integrations)

</div>

## Getting started

![](docs/images/2023-03-14_06-47-30.png)

## Installation

install https://github.com/comfyanonymous/ComfyUI

---

# Goals:

-   type-safety everywhere
-   best-in-class editor support both for `generated SDK` and within the `standalone IDE`.

---

## Comfy Wishlist

-   [ ] `store` node for persistng node output across flow evaluation
-   [ ] `promptID` that can be sent to the server to be included in every `'status'` , `'progress'` , `'executing'` & `'executed'` update payloads

## Concepts:

main front classes

-   ComfyIDEState
    -   ComfyManager
    -   ComfyProject[]
        -   ComfyScript..
            -   code
            -   versions[]

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
