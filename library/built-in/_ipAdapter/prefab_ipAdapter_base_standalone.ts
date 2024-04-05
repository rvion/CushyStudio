import type { OutputFor } from '../_prefabs/_prefabs'

import { ipAdapterDoc } from './_ipAdapterDoc'
import { ipAdapterModelList } from './_ipAdapterModelList'
import { ui_ipadapter_CLIPSelection, ui_subform_IPAdapter_common } from './_ipAdapterUtils'
import { ui_ipadapter_modelSelection } from './ui_ipadapter_modelSelection'

// 🅿️ IPAdapter Basic ===================================================
export const ui_ipadapter_standalone = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'IPAdapter',
        requirements: [
            //
            { type: 'customNodesByTitle', title: 'ComfyUI_IPAdapter_plus' },
            { type: 'modelInManager', modelName: 'ip-adapter_sdxl_vit-h.safetensors' },
            { type: 'modelInManager', modelName: 'ip-adapter-plus_sdxl_vit-h.safetensors' },
            { type: 'modelInManager', modelName: 'ViT-H SAM model' },
        ],
        items: () => ({
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            image: form.image({ label: 'Image' }),
            extra: form.list({ label: 'Extra', element: form.image({ label: 'Image' }) }),
            embedding_scaling: form.enum.Enum_IPAdapterAdvanced_embeds_scaling({ default: 'V only' }),
            ...ui_ipadapter_CLIPSelection(form),
            ...ui_ipadapter_modelSelection(form, 'ip-adapter-plus_sd15.safetensors', ipAdapterModelList),
            ...ui_subform_IPAdapter_common(form),
        }),
    })
}

// 🅿️ IPAdapter RUN ===================================================
export const run_ipadapter_standalone = async (
    ui: OutputFor<typeof ui_ipadapter_standalone>,
    ckpt: _MODEL,
): Promise<{ ip_adapted_model: _MODEL }> => {
    const run = getCurrentRun()
    const graph = run.nodes

    const ip_model = graph.IPAdapterModelLoader({ ipadapter_file: ui.cnet_model_name })

    let image: _IMAGE = await run.loadImageAnswer(ui.image)
    let image_ = graph.IPAdapterEncoder({ ipadapter: ip_model, image }).outputs
    let pos_embed: _EMBEDS = image_.pos_embed
    let neg_embed: _EMBEDS = image_.neg_embed

    const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ui.clip_name })
    for (const ex of ui.extra) {
        const extraImage = graph.IPAdapterEncoder({
            image: await run.loadImageAnswer(ex),
            ipadapter: ip_model,
            clip_vision: ip_clip_name,
        })
        // merge pos
        const combinedPos = graph.IPAdapterCombineEmbeds({
            embed1: pos_embed,
            embed2: extraImage.outputs.pos_embed,
            method: 'average',
        })
        pos_embed = combinedPos.outputs.EMBEDS
        // merge neg
        const combinedNeg = graph.IPAdapterCombineEmbeds({
            embed1: pos_embed,
            embed2: extraImage.outputs.neg_embed,
            method: 'average',
        })
        neg_embed = combinedNeg.outputs.EMBEDS
    }
    const ip_adapted_model = graph.IPAdapterEmbeds({
        ipadapter: ip_model,
        clip_vision: ip_clip_name,
        pos_embed,
        neg_embed,
        // image: image,
        model: ckpt,
        weight_type: ui.settings.weight_type,
        // weight_type: 'original',
        weight: ui.strength,
        // noise: ui.settings.noise,
        start_at: ui.settings.startAtStepPercent,
        end_at: ui.settings.endAtStepPercent,
        embeds_scaling: 'V only',
        // unfold_batch: ui.settings.unfold_batch,
        embeds_scaling: ui.embedding_scaling,
    })._MODEL

    return { ip_adapted_model }
}
