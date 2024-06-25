# Prefabs


Prefabs are piece of a model definition you can re-use across your model/apps.
CushyStudio comes with a lot of prefabs, and lots of utilities to create new prefabs.

# Example of built-in prefabs

`library/built-in/_prefabs/prefab_model.ts`

this is a picture of the model prefab available in cushy studio.

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/f496643b645444236c4da8686f424d9a38668e41.jpg)



# Making prefabs for comfy_ui nodes

When you just want to have the exact same fields as you can find in a

You can use

# Making your prefabs very fast to typecheck


to make your prefabs very fast to typecheck, you can:
- export a named type alias for your prefab return type
- annotate the return of your prefab function with that type

since 2024-06-25, there is now a globally available `X` namespace that allow to
quickly add typings to your prefabs without having to import anything


```tsx
import type { FormBuilder } from '../../../src/controls/FormBuilder'
import type { SchemaDict } from '../../../src/csuite'
import type { MediaImageL } from '../../../src/models/MediaImage'
import type { OutputFor } from './_prefabs'

// add an explicit type
// HINT: you don't have to type that manually, vscode can write it for you
export type UI_Mask = X.XChoice<{
    noMask: X.XGroup<SchemaDict>
    mask: X.XGroup<{
        image: X.XImage
        mode: X.XEnum<Enum_LoadImageMask_channel>
        invert: X.XBool
        grow: X.XNumber
        feather: X.XNumber
        preview: X.XBool
    }>
}>

// and add explit return type to your function
//                         VVVVV
export function ui_mask(): UI_Mask {
    const form: FormBuilder = getCurrentForm()
    return form.choice({
        appearance: 'tab',
        icon: 'mdiDominoMask',
        label: 'Mask',
        default: 'noMask',
        // box: { base: { hue: 20, chroma: 0.03 } },
        items: {
            noMask: form.group(),
            mask: form.group({
                collapsed: false,
                label: false,
                items: {
                    image: form.image({}),
...

```


# copy automatically your prefab typings in vscode

first, install the vscode extension

`Young-Vform.copy-hover-type`

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/995dd74a590834c97303b14d07fec6450e2b3cfa.jpg)


then, you can copy the type of a variable by hovering over it and pressing the proper keybinding (`ctrl+k ctrl+h` on windows by default)

# Making sure your typescript will always show full types

typescript will bail-out and show `...` if the type is too long to be displayed.
sadly, the extension mentioned above will not be able to expand those `...` and
typescript codebase do not have any option to change that. (some people will mention using `noErrorTruncation`, but it doesn't work for this use-case, since we do not have any error here, just a truncation of the type given by the Language Server)

https://stackoverflow.com/questions/53113031/how-to-see-a-fully-expanded-typescript-type-without-n-more-and

you need to edit the `tsserver.js` file your vscode instance is using

```
/resources/app/extensions/node_modules/typescript/lib/tsserver.js
```

e.g. for mac

```sh
# if you use the default vscode tsserver.js
code /Applications/Visual\ Studio\ Code.app/Contents/resources/app/extensions/node_modules/typescript/lib/tsserver.js

#or if you use the local tsserver.js
code ./node_modules/typescript/lib/tsserver.js

```

and update the `defaultMaximumTruncationLength` from `160` to some higher value (e.g. `4000`)

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/e08647c65c92af799acc84d1e7b944f3469ce444.jpg)


# Debug vscode slow autocompletion

CushyStudio comes with some advanced typescript tooling to debug
inference speed issues, and help to troubleshoot code slowness.


![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/991a1e9552932f051abae65015e002e455f352ac.jpg
)

to start the tool, you just need to:

uncomment those two lines in your `.vscode/settings.json`


```json
{
    //...
    "typescript.tsserver.log": "normal",
    "typescript.tsserver.enableTracing": true,
    //...
}
```

start the tool with the command

```shell
bun src/perfs/monitorVSCodePerfs.ts
```
