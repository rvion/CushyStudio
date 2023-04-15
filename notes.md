-   codegen
    -   no `HasSingel{Float or any primitive}` to allow for `node.inputs.foo++` syntax ?

<!-- - find a way to execute -->

---

copy pasta from matrix chanel for future documentation

-   A singleton `ComfyManager` that handles backend connection, functions to open / close projects. (holds global config). handles retrieval of `ComfySchema`, `ComfyCodegen`,
-   `ComfyProject`s: named projects, project specific config, manage its `ComfyScript`s
-   `ComfyScript` a script that can evaluate to produce a sequence fo `ComfyGraphs`.
-   `ComfyScripts` have two evaluation modes: `ComfyScript.EvalMode.Discover` (to generate a sequence of graph instantly and keep UI in sync) and `ComfyScript.EvalMode.Generate`, that actually evaluate the prompts and gather its results.
-   `ComfyLib`: an sdk available in `ComfyScripts` to quickly create / link / clone / unlink / clone nodes, and handle `CONTROL FLOW` (🎉): loops, if, human validation, choice selection, etc.
    `ComfyGraph`: several produced along a script execution. can be serialized to a JSON prompt.

and a few goodies along to help smooth the process

-   `ComfyCodegen` that generate type-safe interfaces and help and snippets.
-   ...

one can think of `ComfyScripts` as superset of workflows: any current Comfy workflow edited in the currentUI maps to a `trivial Script` that just create and link nodes.

so you'll be able to simply drag and drop any image with metadata in the IDE to convert it to a script if you want to add control flow logic, or process validation UIs.
Similarly, you'll be able to take any `ComfyGraph` outputed by your script and use it the the graph ide, since every sequential Graph (~prompt) outputed by a Script can be serialized to a Comfy workflow JSON file

drag-and-dropping an image with metadata will convert it to a script, and running the script-as-is will produce a single graph, that will itself serialize to the exact same json as initially present in the image metadata

---

hopefully final major early change occurring right now in CushyStudio:
Comfy workspaces folders are now clean, with only scripts and json workflows, json workflows (old UI) will now be supported as in the current UI, new demo system for quick onboarding being built, large codebase re-organisation for simpler contribution, etc
I'll also probably require a few custom nodes that will probably ship with CushyStudio, and CushyStudio will auto-install them, so I can add missing bits and keep them up-to-date (like LoadOutputImage accepting any path within the output folder)
I've also add a few major UI improvements, and planned out quite a few scripting SDK changes (ability to use function instead of any value for lazy execution at prompt time, etc)
and an auto-fill missing arguments based on context: like, you only have one ckpt loaded ? adding any node requiring a ckpt will auto connect to it if you want to ommit
also, node defaults will be configurable per workspace
so you can avoid boilerplate
slowly, but surely :)
but the really best think IMO, is that I can now have CushyStudio script living type-checked outside of CushyStudio, and execute them in CushyStudio 🎉, so I can simply create my script in my vscode IDE, within a project, and run it inside CushyStudio any time with a simple button
CushyStudio will act as a "binary" to evaluate those scripts
with all goodies one can expect
this project went though many phases x)
I'll probably need a few days to get there;
image.png
the ver very cool thing for the future of demos, is that doing refactor actions (e.g. f2 to rename a symbol) will also rename those symbols into the demo library
so contributors having meaningful demos commited in the repo will be maintained and kept up-to-date and compatible with CushyStudio releases
(and ComfyUI release too, since Cushy will remain compatible)

<!--  -->

```sh
venv
cd ComfyUI/custom_nodes
git clone https://github.com/Fannovel16/comfy_controlnet_preprocessors
cd comfy_controlnet_preprocessors
python install.py
# seems to overwrite my pytorch setup 😅
```
