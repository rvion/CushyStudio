import type { FormBuilder } from '../../../src/controls/FormBuilder'
import type { OutputFor } from './_prefabs'

export const ui_mask = () => {
    const form: FormBuilder = getCurrentForm()
    return form.choice({
        appearance: 'tab',
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
                    mode: form.enum.Enum_LoadImageMask_channel({}),
                    invert: form.bool({}),
                    grow: form.int({ default: 0, min: -100, max: 100 }),
                    feather: form.int({ default: 0, min: 0, max: 100 }),
                    preview: form.bool({}),
                    // interrogate: form.bool({}),
                },
            }),
        },
    })
}

export const run_mask = async (x: OutputFor<typeof ui_mask>): Promise<HasSingle_MASK | null> => {
    const p = x.mask
    if (p == null) return null

    const graph = getCurrentRun().nodes
    let mask: _MASK = await p.image.loadInWorkflowAsMask(p.mode)
    if (p.invert) mask = graph.InvertMask({ mask: mask })
    if (p.grow) mask = graph.GrowMask({ mask: mask, expand: p.grow })
    if (p.feather)
        mask = graph.FeatherMask({
            mask: mask,
            bottom: p.feather,
            top: p.feather,
            left: p.feather,
            right: p.feather,
        })
    if (p.preview) graph.PreviewImage({ images: graph.MaskToImage({ mask }) })
    return mask
}
