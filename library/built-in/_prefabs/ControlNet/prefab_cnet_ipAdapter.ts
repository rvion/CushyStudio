import { OutputFor } from '../_prefabs'
import { Cnet_args } from '../prefab_cnet'

const ipAdapterDoc = `\
The following table shows the combination of Checkpoint and Image encoder to use for each IPAdapter Model. Any Tensor size mismatch you may get it is likely caused by a wrong combination.

| SD v. | IPadapter | Img encoder | Notes |
|---|---|---|---|
| v1.5 | [ip-adapter_sd15](https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15.safetensors) | ViT-H | Basic model, average strength |
| v1.5 | [ip-adapter_sd15_light](https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15_light.safetensors) | ViT-H | Light model, very light impact |
| v1.5 | [ip-adapter-plus_sd15](https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus_sd15.safetensors) | ViT-H | Plus model, very strong |
| v1.5 | [ip-adapter-plus-face_sd15](https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus-face_sd15.safetensors) | ViT-H | Face model, use only for faces |
| v1.5 | [ip-adapter-full-face_sd15](https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-full-face_sd15.safetensors) | ViT-H | Strongher face model, not necessarily better |
| v1.5 | [ip-adapter_sd15_vit-G](https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15_vit-G.safetensors) | ViT-bigG | Base model trained with a bigG encoder |
| SDXL | [ip-adapter_sdxl](https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter_sdxl.safetensors) | ViT-bigG | Base SDXL model, mostly deprecated |
| SDXL | [ip-adapter_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter_sdxl_vit-h.safetensors) | ViT-H | New base SDXL model |
| SDXL | [ip-adapter-plus_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors) | ViT-H | SDXL plus model, stronger |
| SDXL | [ip-adapter-plus-face_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter-plus-face_sdxl_vit-h.safetensors) | ViT-H | SDXL face model |

**FaceID** requires \`insightface\`, you need to install them in your ComfyUI environment. Check [this issue](https://github.com/cubiq/ComfyUI_IPAdapter_plus/issues/162) for help.

When the dependencies are satisfied you need:

| SD v. | IPadapter | Img encoder | Lora |
|---|---|---|---|
| v1.5 | [FaceID](https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sd15.bin) | (not used¹) | [FaceID Lora](https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sd15_lora.safetensors) |
| v1.5 | [FaceID Plus](https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plus_sd15.bin) | ViT-H | [FaceID Plus Lora](https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plus_sd15_lora.safetensors) |
| v1.5 | [FaceID Plus v2](https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sd15.bin) | ViT-H | [FaceID Plus v2 Lora](https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sd15_lora.safetensors) |
| SDXL | [FaceID](https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sdxl.bin) | (not used¹) | [FaceID SDXL Lora](https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sdxl_lora.safetensors) |

`
// 🅿️ IPAdapter FORM ===================================================
export const ui_subform_IPAdapter = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'IPAdapter',
        customNodes: 'ComfyUI_IPAdapter_plus',
        items: () => ({
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            strength: form.float({ default: 1, min: 0, max: 2, step: 0.1 }),
            advanced: form.groupOpt({
                label: 'Advanced',
                items: () => ({
                    startAtStepPercent: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
                    endAtStepPercent: form.float({ default: 1, min: 0, max: 1, step: 0.1 }),

                    interpolation: form.enum({
                        enumName: 'Enum_PrepImageForClipVision_interpolation',
                        default: 'LANCZOS',
                        label: 'Prep Image Scaling Type',
                    }),
                    crop_position: form.enum({
                        enumName: 'Enum_PrepImageForClipVision_crop_position',
                        default: 'center',
                        label: 'Prep Image Crop Position',
                    }),
                    weight_type: form.enum({
                        enumName: 'Enum_IPAdapterApply_weight_type',
                        default: 'original',
                        label: 'Weight Type',
                    }),
                    noise: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
                    prep_sharpening: form.float({ default: 0, min: 0, max: 1, step: 0.01 }),
                    unfold_batch: form.bool({ default: false }),
                }),
            }),
            clip_name: form.enum({
                enumName: 'Enum_CLIPVisionLoader_clip_name',
                label: 'Clip Vision Model',
                default: { value: 'model.safetensors' },
                recommandedModels: {
                    modelFolderPrefix: 'models/clip_vision',
                    knownModel: [
                        'CLIPVision model (IP-Adapter) CLIP-ViT-H-14-laion2B-s32B-b79K',
                        'CLIPVision model (IP-Adapter) CLIP-ViT-bigG-14-laion2B-39B-b160k',
                        'CLIPVision model (IP-Adapter) 1.5',
                        'CLIPVision model (IP-Adapter) XL',
                        'CLIPVision model (openai/clip-vit-large)',
                        'CLIPVision model (stabilityai/clip_vision_g)',
                    ],
                },
            }),
            cnet_model_name: form.enum({
                enumName: 'Enum_IPAdapterModelLoader_ipadapter_file',
                default: { value: 'ip-adapter_sd15.safetensors' },
                recommandedModels: {
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
