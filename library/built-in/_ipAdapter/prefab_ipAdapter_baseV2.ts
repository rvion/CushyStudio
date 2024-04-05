import type { FormBuilder } from '../../../src/CUSHY'
import type { OutputFor } from '../_prefabs/_prefabs'

import { ipAdapterDoc } from './_ipAdapterDoc'
import { ipAdapterModelList } from './_ipAdapterModelList'
import { ui_ipadapter_modelSelection } from './ui_ipadapter_modelSelection'

// 🅿️ IPAdapter Common FORM ===================================================
export const ui_subform_IPAdapter_commonV2 = (form: FormBuilder, defaultStrength: number = 1) => ({})

export type Cnet_argsV2 = {
    positive: _CONDITIONING
    negative: _CONDITIONING
    width: number
    height: number
    ckptPos: _MODEL
}

//🅿️ IPAdapter CLIP Selection ===================================================
export const ui_ipadapter_CLIPSelectionV2 = (form: FormBuilder) => ({
    clip_name: form.enum.Enum_CLIPVisionLoader_clip_name({
        // @ts-ignore
        default: 'CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors',
        requirements: [{ type: 'modelInManager', modelName: 'CLIPVision model (IP-Adapter) CLIP-ViT-H-14-laion2B-s32B-b79K' }],
        label: 'CLIP Vision Model',
    }),
})

export const ui_IPAdapterImageInput = (form: FormBuilder) => {
    return form.fields(
        {
            image: form.image({ label: 'Image' }),
            advanced: form.fields(
                {
                    imageAttentionMask: form
                        .image({
                            label: 'Image Attention Mask',
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
                        return `weight:${ui.imageWeight}|combo:${ui.embedding_combination}|mask:${
                            ui.imageAttentionMask ? 'yes' : 'no'
                        }`
                    },
                },
            ),
            // crop: form.bool({ default: true }),
        },
        {
            summary: (ui) => {
                return `weight:${ui.advanced.imageWeight}|combo:${ui.advanced.embedding_combination}|mask:${
                    ui.advanced.imageAttentionMask ? 'yes' : 'no'
                }`
            },
        },
    )
}

// 🅿️ IPAdapter Basic ===================================================
export const ui_IPAdapterV2 = () => {
    const form = getCurrentForm()
    return form.fields(
        {
            baseImage: ui_IPAdapterImageInput(form),
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
                    extra: form.list({
                        label: 'Extra Images',
                        element: ui_IPAdapterImageInput(form),
                    }),
                    advancedSettings: form.fields(
                        {
                            startAtStepPercent: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
                            endAtStepPercent: form.float({ default: 1, min: 0, max: 1, step: 0.1 }),
                            adapterAttentionMask: form
                                .image({
                                    label: 'Attention Mask',
                                    tooltip: 'This defines the region of the generated image the IPAdapter will apply to',
                                })
                                .optional(),
                            weight_type: form.enum.Enum_IPAdapterAdvanced_weight_type({ default: 'linear' }),
                            embedding_scaling: form.enum.Enum_IPAdapterAdvanced_embeds_scaling({ default: 'V only' }),
                            noise: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
                            unfold_batch: form.bool({ default: false }),
                        },
                        {
                            summary: (ui) => {
                                return `${ui.weight_type}|from:${ui.startAtStepPercent}=>${ui.endAtStepPercent}`
                            },
                        },
                    ),
                },
                {
                    label: 'IP Adapter Settings',
                    startCollapsed: true,
                    summary: (ui) => {
                        return `extra images:${ui.extra.length}|strength:${ui.adapterStrength}|model:${ui.models.type}|`
                    },
                },
            ),
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
        },
        {
            label: 'IPAdapter',
            summary: (ui) => {
                return `images:${1 + ui.settings.extra.length}|strength:${ui.settings.adapterStrength}|model:${
                    ui.settings.models.type
                }`
            },
        },
    )
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

    let image: _IMAGE = await run.loadImageAnswer(ui.baseImage.image)
    image = graph.PrepImageForClipVision({ image, crop_position: 'center', sharpening: 0, interpolation: 'LANCZOS' })
    let baseMask: _MASK | undefined
    if (ui.baseImage.advanced.imageAttentionMask) {
        const maskLoad = await run.loadImageAnswer(ui.baseImage.advanced.imageAttentionMask)
        const maskClipped = graph.PrepImageForClipVision({
            image: maskLoad,
            crop_position: 'center',
            sharpening: 0,
            interpolation: 'LANCZOS',
        })
        baseMask = graph.ImageToMask({ image: maskClipped._IMAGE, channel: 'red' })
    }

    let image_ = graph.IPAdapterEncoder({
        ipadapter: ip_adapter,
        image,
        weight: ui.baseImage.advanced.imageWeight,
        mask: baseMask,
    }).outputs
    let pos_embed: _EMBEDS = image_.pos_embed
    let neg_embed: _EMBEDS = image_.neg_embed
    for (const ex of ui.settings.extra) {
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
        const extraImage = graph.IPAdapterEncoder({
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
        // merge pos
        const combinedPos = graph.IPAdapterCombineEmbeds({
            embed1: pos_embed,
            embed2: extraImage.outputs.pos_embed,
            method: ex.advanced.embedding_combination,
        })
        pos_embed = combinedPos.outputs.EMBEDS
        // merge neg
        const combinedNeg = graph.IPAdapterCombineEmbeds({
            embed1: pos_embed,
            embed2: extraImage.outputs.neg_embed,
            method: ex.advanced.embedding_combination,
        })
        neg_embed = combinedNeg.outputs.EMBEDS
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
