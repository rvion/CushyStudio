import { ui_startImage } from './_shared/_prefab'

app({
    ui: (formBuilder) => {
        return {
            a: ui_startImage(formBuilder),
            b: ui_startImage(formBuilder),
            c: formBuilder.int({ default: 1 }),
        }
    },
    run: async (flow, p) => {
        flow.output_text(`startImage: ${p.a.startImage}`)
        flow.output_text(`startImage: ${p.b.startImage}`)
    },
})
