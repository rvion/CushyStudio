import { ui_startImage } from './_prefab'

app({
    ui: (formBuilder) => {
        return {
            a: ui_startImage(formBuilder),
            b: ui_startImage(formBuilder),
            c: formBuilder.int({ default: 1 }),
        }
    },
    run: async (flow, p) => {
        flow.print(`startImage: ${p.a.startImage}`)
        flow.print(`startImage: ${p.b.startImage}`)
    },
})
