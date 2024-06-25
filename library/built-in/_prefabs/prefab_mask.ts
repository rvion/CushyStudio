import type { FormBuilder } from '../../../src/controls/FormBuilder'
import type { SchemaDict } from '../../../src/csuite'
import type { MediaImageL } from '../../../src/models/MediaImage'
import type { OutputFor } from './_prefabs'

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

export async function run_mask(
    //
    x: OutputFor<typeof ui_mask>,
    imageOverride?: Maybe<MediaImageL>,
): Promise<HasSingle_MASK | null> {
    const p = x.mask
    if (p == null) return null

    const graph = getCurrentRun().nodes

    let mask: _MASK = await (imageOverride ?? p.image).loadInWorkflowAsMask(p.mode)

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
