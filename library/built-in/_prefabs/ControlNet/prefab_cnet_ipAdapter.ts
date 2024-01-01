import { OutputFor } from '../_prefabs'
import { Cnet_args } from '../prefab_cnet'

// 🅿️ IPAdapter FORM ===================================================
export const ui_subform_IPAdapter = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'IPAdapter',
        customNodes: 'ComfyUI_IPAdapter_plus',
        items: () => ({
            image: form.image({
                default: 'cushy',
                group: 'Cnet_Image',
                tooltip:
                    'There is currently a bug with multiple controlnets where an image wont allow drop except for the first controlnet in the list. If you add multiple controlnets, then reload using Ctrl+R, it should allow you to drop an image on any of the controlnets.',
            }),
            strength: form.float({ default: 1, min: 0, max: 2, step: 0.1 }),
            startAtStepPercent: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            endAtStepPercent: form.float({ default: 1, min: 0, max: 1, step: 0.1 }),
            clip_name: form.enum({
                enumName: 'Enum_CLIPVisionLoader_clip_name',
                default: { knownModel: 'CLIPVision model (IP-Adapter)' },
                group: 'IPAdapter',
                label: 'Model',
            }),
            cnet_model_name: form.enum({
                enumName: 'Enum_IPAdapterModelLoader_ipadapter_file',
                default: { knownModel: ['ip-adapter_sd15.safetensors'] },
                // default: 'ip-adapter_sd15.safetensors'
                group: 'IPAdapter',
                label: 'Model',
            }),
            interpolation: form.enum({
                enumName: 'Enum_PrepImageForClipVision_interpolation',
                default: 'LANCZOS',
                group: 'IPAdapter',
                label: 'Model',
            }),
            crop_position: form.enum({
                enumName: 'Enum_PrepImageForClipVision_crop_position',
                default: 'center',
                group: 'IPAdapter',
                label: 'Model',
            }),
            weight_type: form.enum({
                enumName: 'Enum_IPAdapterApply_weight_type',
                default: 'original',
                group: 'IPAdapter',
                label: 'Model',
            }),
            noise: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            prep_sharpening: form.float({ default: 0, min: 0, max: 1, step: 0.01 }),
            unfold_batch: form.bool({ default: false }),
        }),
    })
}

// 🅿️ IPAdapter RUN ===================================================
export const run_cnet_IPAdapter = async (IPAdapter: OutputFor<typeof ui_subform_IPAdapter>, cnet_args: Cnet_args) => {
    const run = getCurrentRun()
    const graph = run.nodes
    const ip = IPAdapter
    let image: IMAGE
    //crop the image to the right size
    //todo: make these editable
    image = graph.PrepImageForClipVision({
        image: (await run.loadImageAnswer(ip.image))._IMAGE,
        interpolation: ip.interpolation,
        crop_position: ip.crop_position,
        sharpening: ip.prep_sharpening,
    })._IMAGE

    const ip_model = graph.IPAdapterModelLoader({ ipadapter_file: ip.cnet_model_name })
    const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ip.clip_name })

    const ip_adapted_model = graph.IPAdapterApply({
        ipadapter: ip_model,
        clip_vision: ip_clip_name,
        image: image,
        model: cnet_args.ckptPos,
        weight: ip.strength,
        noise: ip.noise,
        weight_type: ip.weight_type,
        start_at: ip.startAtStepPercent,
        end_at: ip.endAtStepPercent,
        unfold_batch: ip.unfold_batch,
    })._MODEL

    return { ip_adapted_model }
}
