import type { FormBuilder } from '../../../src/CUSHY'
import type { OutputFor } from '../_prefabs/_prefabs'

import { ipAdapterDoc } from './_ipAdapterDoc'

export const ui_ipadapter_advancedSettings = (
    form: FormBuilder,
    start: number = 0,
    end: number = 1,
    weight_type: Enum_IPAdapterAdvanced_weight_type = 'linear',
) => {
    return form.fields(
        {
            startAtStepPercent: form.float({ default: start, min: 0, max: 1, step: 0.1 }),
            endAtStepPercent: form.float({ default: end, min: 0, max: 1, step: 0.1 }),
            adapterAttentionMask: form
                .image({
                    label: 'Attention Mask',
                    tooltip: 'This defines the region of the generated image the IPAdapter will apply to',
                })
                .optional(),
            weight_type: form.enum.Enum_IPAdapterAdvanced_weight_type({ default: weight_type }),
            embedding_scaling: form.enum.Enum_IPAdapterAdvanced_embeds_scaling({ default: 'V only' }),
            noise: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            unfold_batch: form.bool({ default: false }),
        },
        {
            summary: (ui) => {
                return `${ui.weight_type} | from:${ui.startAtStepPercent}=>${ui.endAtStepPercent}`
            },
        },
    )
}

export const ui_IPAdapterImageInput = (form: FormBuilder) => {
    return form.fields(
        {
            image: form.image({ label: 'Image' }),
            advanced: form.fields(
                {
                    imageAttentionMask: form
                        .image({
                            label: 'Image Attention Mask',
                            startCollapsed: true,
                            tooltip:
                                'This defines the region of the image the clip vision will attempt to interpret into an embedding',
                        })
                        .optional(),
                    imageWeight: form.float({ default: 1, min: 0, max: 2, step: 0.1 }),
                    embedding_combination: form.enum.Enum_IPAdapterAdvanced_combine_embeds({ default: 'average' }),
                },
                {
                    startCollapsed: true,
                    label: 'Image Settings',
                    summary: (ui) => {
                        return `weight:${ui.imageWeight} | combo:${ui.embedding_combination} | mask:${
                            ui.imageAttentionMask ? 'yes' : 'no'
                        }`
                    },
                },
            ),
        },
        {
            summary: (ui) => {
                return `weight:${ui.advanced.imageWeight} | combo:${ui.advanced.embedding_combination} | mask:${
                    ui.advanced.imageAttentionMask ? 'yes' : 'no'
                }`
            },
        },
    )
}

// 🅿️ IPAdapter Basic ===================================================
export const ui_IPAdapterV2 = () => {
    const form = getCurrentForm()
    return form
        .fields(
            {
                //baseImage: ui_IPAdapterImageInput(form),
                images: form.list({
                    element: ui_IPAdapterImageInput(form),
                    min: 1,
                }),
                settings: form.fields(
                    {
                        adapterStrength: form.float({ default: 0.8, min: 0, max: 2, step: 0.1 }),
                        models: form.fields(
                            {
                                type: form.enum.Enum_IPAdapterUnifiedLoader_preset({ default: 'STANDARD (medium strength)' }),
                            },
                            {
                                startCollapsed: true,
                                summary: (ui) => {
                                    return `model:${ui.type}`
                                },
                            },
                        ),
                        advancedSettings: ui_ipadapter_advancedSettings(form),
                    },
                    {
                        label: 'IP Adapter Settings',
                        startCollapsed: true,
                        summary: (ui) => {
                            return `strength:${ui.adapterStrength} | model:${ui.models.type}|`
                        },
                    },
                ),
                help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            },
            {
                icon: 'mdiAnvil',
                label: 'IPAdapter',
                box: { base: { hue: 70, chroma: 0.1 } },
                summary: (ui) => {
                    return `images:${1 + ui.images.length} | strength:${ui.settings.adapterStrength} | model:${
                        ui.settings.models.type
                    }`
                },
            },
        )
        .addRequirements([{ type: 'customNodesByTitle', title: 'ComfyUI_IPAdapter_plus' }])
}

// 🅿️ IPAdapter RUN ===================================================
export const run_IPAdapterV2 = async (
    ui: OutputFor<typeof ui_IPAdapterV2>,
    ckpt: _MODEL,
    // cnet_args: Cnet_argsV2,
    previousIPAdapter?: _IPADAPTER | undefined,
): Promise<{
    ip_adapted_model: _MODEL
    ip_adapter: _IPADAPTER | undefined
}> => {
    const run = getCurrentRun()
    const graph = run.nodes
    if (!ui) {
        return { ip_adapted_model: ckpt, ip_adapter: previousIPAdapter }
    }

    let ip_adapter: _IPADAPTER
    let ip_adapter_out: _IPADAPTER
    let ckpt_pos: _MODEL = ckpt
    if (previousIPAdapter) {
        ip_adapter = previousIPAdapter
        ip_adapter_out = previousIPAdapter
    } else {
        const ip_adapter_loader = graph.IPAdapterUnifiedLoader({
            model: ckpt,
            ipadapter: previousIPAdapter,
            preset: ui.settings.models.type,
        })
        ip_adapter = ip_adapter_loader._IPADAPTER
        ckpt_pos = ip_adapter_loader._MODEL
    }

    let pos_embed: _EMBEDS | null = null
    let neg_embed: _EMBEDS | null = null
    let i: number = 0
    for (const ex of ui.images) {
        const extra = await run.loadImageAnswer(ex.image)
        let mask: _MASK | undefined
        if (ex.advanced.imageAttentionMask) {
            const maskLoad = await run.loadImageAnswer(ex.advanced.imageAttentionMask)
            const maskClipped = graph.PrepImageForClipVision({
                image: maskLoad,
                crop_position: 'center',
                sharpening: 0,
                interpolation: 'LANCZOS',
            })
            mask = graph.ImageToMask({ image: maskClipped._IMAGE, channel: 'red' })
        }
        const Image = graph.IPAdapterEncoder({
            image: graph.PrepImageForClipVision({
                image: extra._IMAGE,
                crop_position: 'center',
                sharpening: 0,
                interpolation: 'LANCZOS',
            }),
            ipadapter: ip_adapter,
            weight: ex.advanced.imageWeight,
            mask: mask,
        })
        if (pos_embed && neg_embed) {
            // merge pos
            const combinedPos = graph.IPAdapterCombineEmbeds({
                embed1: pos_embed,
                embed2: Image.outputs.pos_embed,
                method: ex.advanced.embedding_combination,
            })
            pos_embed = combinedPos.outputs.EMBEDS
            // merge neg
            const combinedNeg = graph.IPAdapterCombineEmbeds({
                embed1: pos_embed,
                embed2: Image.outputs.neg_embed,
                method: ex.advanced.embedding_combination,
            })
            neg_embed = combinedNeg.outputs.EMBEDS
        } else {
            pos_embed = Image.outputs.pos_embed
            neg_embed = Image.outputs.neg_embed
        }
        i += 0
    }
    if (pos_embed == null || neg_embed == null) {
        throw new Error('No embedding pipe generated.')
    }
    const ip_adapted_model = graph.IPAdapterEmbeds({
        ipadapter: ip_adapter,
        pos_embed,
        neg_embed,
        model: ckpt_pos,
        weight_type: ui.settings.advancedSettings.weight_type,
        weight: ui.settings.adapterStrength,
        start_at: ui.settings.advancedSettings.startAtStepPercent,
        end_at: ui.settings.advancedSettings.endAtStepPercent,
        embeds_scaling: ui.settings.advancedSettings.embedding_scaling,
    })._MODEL

    return { ip_adapted_model, ip_adapter }
}
