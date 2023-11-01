# modular decks example

This deck define a few cards that reuse the same high-level widgets via modular UI kits

in this image, both fields `"a"` and `"b"` re-use the same helper

```ts
import { subform_startImage } from './_ui'

card({
    name: 'card1',
    ui: (formBuilder) => {
        return {
            a: subform_startImage(formBuilder),
            b: subform_startImage(formBuilder),
            c: formBuilder.int({ default: 1 }),
        }
    },
    run: async (flow, p) => {
        flow.print(`startImage: ${p.a.startImage}`)
        flow.print(`startImage: ${p.b.startImage}`)
    },
})
```

![](_docs/image.webp)
