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
