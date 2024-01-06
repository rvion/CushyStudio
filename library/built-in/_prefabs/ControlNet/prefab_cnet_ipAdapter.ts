import { OutputFor } from '../_prefabs'
import { Cnet_args } from '../prefab_cnet'

// 🅿️ IPAdapter FORM ===================================================
export const ui_subform_IPAdapter = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'IPAdapter',
        customNodes: 'ComfyUI_IPAdapter_plus',
        items: () => ({
            strength: form.float({ default: 1, min: 0, max: 2, step: 0.1 }),
            advanced: form.groupOpt({
                label: 'Advanced',
                items: () => ({
                    startAtStepPercent: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
                    endAtStepPercent: form.float({ default: 1, min: 0, max: 1, step: 0.1 }),

                    interpolation: form.enum({
                        enumName: 'Enum_PrepImageForClipVision_interpolation',
                        default: 'LANCZOS',
                        group: 'IPAdapter',
                        label: 'Prep Image Scaling Type',
                    }),
                    crop_position: form.enum({
                        enumName: 'Enum_PrepImageForClipVision_crop_position',
                        default: 'center',
                        group: 'IPAdapter',
                        label: 'Prep Image Crop Position',
                    }),
                    weight_type: form.enum({
                        enumName: 'Enum_IPAdapterApply_weight_type',
                        default: 'original',
                        group: 'IPAdapter',
                        label: 'Weight Type',
                    }),
                    noise: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
                    prep_sharpening: form.float({ default: 0, min: 0, max: 1, step: 0.01 }),
                    unfold_batch: form.bool({ default: false }),
                }),
            }),
            clip_name: form.enum({
                enumName: 'Enum_CLIPVisionLoader_clip_name',
                default: {
                    value: 'model.safetensors',
                    knownModel: [
                        'CLIPVision model (IP-Adapter)',
                        'CLIPVision model (openai/clip-vit-large)',
                        'CLIPVision model (stabilityai/clip_vision_g)',
                    ],
                },
                group: 'IPAdapter',
                label: 'Clip Vision Model',
            }),
            cnet_model_name: form.enum({
                enumName: 'Enum_IPAdapterModelLoader_ipadapter_file',
                default: {
                    value: 'ip-adapter_sd15.safetensors',
                    knownModel: [
                        'ip-adapter_sd15.safetensors',
                        'ip-adapter_sd15_light.safetensors',
                        'ip-adapter_sd15_vit-G.safetensors',
                        'ip-adapter-plus_sd15.safetensors',
                        'ip-adapter-plus-face_sd15.safetensors',
                        'ip-adapter-full-face_sd15.safetensors',
                        'ip-adapter-faceid_sd15.bin',
                        'ip-adapter-faceid_sd15_lora.safetensors',
                        'ip-adapter_sdxl.safetensors',
                        'ip-adapter_sdxl_vit-h.safetensors',
                        'ip-adapter-plus_sdxl_vit-h.safetensors',
                        'ip-adapter-plus-face_sdxl_vit-h.safetensors',
                    ],
                },
                // default: 'ip-adapter_sd15.safetensors'
                group: 'IPAdapter',
                label: 'IP Adapter Model',
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
        interpolation: ip.advanced?.interpolation ?? 'LANCZOS',
        crop_position: ip.advanced?.crop_position ?? 'center',
        sharpening: ip.advanced?.prep_sharpening ?? 0,
    })._IMAGE

    const ip_model = graph.IPAdapterModelLoader({ ipadapter_file: ip.cnet_model_name })
    const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ip.clip_name })

    const ip_adapted_model = graph.IPAdapterApply({
        ipadapter: ip_model,
        clip_vision: ip_clip_name,
        image: image,
        model: cnet_args.ckptPos,
        weight: ip.strength,
        noise: ip.advanced?.noise ?? 0,
        weight_type: ip.advanced?.weight_type ?? 'original',
        start_at: ip.advanced?.startAtStepPercent ?? 0,
        end_at: ip.advanced?.endAtStepPercent ?? 1,
        unfold_batch: ip.advanced?.unfold_batch ?? false,
    })._MODEL

    return { ip_adapted_model }
}
