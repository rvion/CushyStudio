import { OutputFor } from '../../_prefabs'
import { Cnet_args } from '../../prefab_cnet'
import { ipAdapterDoc } from './_ipAdapterDoc'
import { ipAdapterModelList } from './_ipAdapterModelList'
import { ui_ipadapter_CLIPSelection, ui_subform_IPAdapter_common } from './_ipAdapterUtils'
import { ui_ipadapter_modelSelection } from './ui_ipadapter_modelSelection'

// 🅿️ IPAdapter Basic ===================================================
export const ui_subform_IPAdapter = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'IPAdapter',
        requirements: [{ type: 'customNodesByTitle', title: 'ComfyUI_IPAdapter_plus' }],
        items: () => ({
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            ...ui_subform_IPAdapter_common(form),
            models: form.group({
                label: 'Select or Download Models',
                // startCollapsed: true,
                items: () => ({
                    ...ui_ipadapter_CLIPSelection(form),
                    ...ui_ipadapter_modelSelection(form, 'ip-adapter-faceid-plus_sd15.bin' as any, ipAdapterModelList),
                }),
            }),
        }),
    })
}

// 🅿️ IPAdapter RUN ===================================================
export const run_cnet_IPAdapter = (
    IPAdapter: OutputFor<typeof ui_subform_IPAdapter>,
    cnet_args: Cnet_args,
    image: _IMAGE,
): {
    ip_adapted_model: _MODEL
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const ip = IPAdapter
    //crop the image to the right size
    //todo: make these editable
    image = graph.PrepImageForClipVision({
        image,
        interpolation: 'LANCZOS',
        crop_position: 'center',
        sharpening: 0,
    })._IMAGE
    const ip_model = graph.IPAdapterModelLoader({ ipadapter_file: ip.models.cnet_model_name })
    const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ip.models.clip_name })
    const ip_adapted_model = graph.IPAdapterApply({
        ipadapter: ip_model,
        clip_vision: ip_clip_name,
        image: image,
        model: cnet_args.ckptPos,
        weight: ip.strength,
        noise: ip.settings.noise,
        weight_type: 'original',
        start_at: ip.settings.startAtStepPercent,
        end_at: ip.settings.endAtStepPercent,
        unfold_batch: ip.settings.unfold_batch,
    })._MODEL

    return { ip_adapted_model }
}
