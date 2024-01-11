import type { FormBuilder } from 'src'
import { OutputFor } from '../_prefabs'
import { Cnet_args } from '../prefab_cnet'
import type { ComfyUIManagerKnownModelNames } from 'src/wiki/modelListType'

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
const ipAdapterModelList: ComfyUIManagerKnownModelNames[] = [
    'ip-adapter_sd15.safetensors',
    'ip-adapter_sd15_light.safetensors',
    'ip-adapter_sd15_vit-G.safetensors',
    'ip-adapter-plus_sd15.safetensors',
    'ip-adapter-plus-face_sd15.safetensors',
    'ip-adapter-full-face_sd15.safetensors',
    'ip-adapter_sdxl.safetensors',
    'ip-adapter_sdxl_vit-h.safetensors',
    'ip-adapter-plus_sdxl_vit-h.safetensors',
    'ip-adapter-plus-face_sdxl_vit-h.safetensors',
]

const ipAdapterClipModelList: ComfyUIManagerKnownModelNames[] = ['ip-adapter-faceid_sd15.bin']

const ipAdapterFaceIDLoraList: ComfyUIManagerKnownModelNames[] = ['ip-adapter-faceid_sd15_lora.safetensors']

// 🅿️ IPAdapter Basic ===================================================
export const ui_subform_IPAdapter = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'IPAdapter',
        customNodes: ['ComfyUI_IPAdapter_plus'],
        items: () => ({
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            ...ui_ipadapter_CLIPSelection(form),
            ...ui_ipadapter_modelSelection(form, 'ip-adapter-faceid-plus_sd15.bin', ipAdapterModelList),
            ...ui_subform_IPAdapter_common(form),
        }),
    })
}

// 🅿️ IPAdapter FaceID ===================================================
export const ui_IPAdapterFaceID = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'FaceID IPAdapter',
        customNodes: ['ComfyUI_IPAdapter_plus'],
        items: () => ({
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            ...ui_ipadapter_CLIPSelection(form),
            ...ui_ipadapter_modelSelection(form, 'ip-adapter-faceid-plus_sd15.bin', ipAdapterClipModelList),
            lora: form.enum({
                enumName: 'Enum_AV$_CheckpointModelsToParametersPipe_lora_1_name',
                default: { value: 'ip-adapter-faceid-plus_sd15_lora.safetensors' },
                label: 'Face ID Lora',
                recommandedModels: {
                    modelFolderPrefix: 'models/lora',
                    knownModel: ipAdapterFaceIDLoraList,
                },
                tooltip:
                    'Select the same LORA as the model. So for ip-adapter-faceid-plus, select ip-adapter-faceid-plus_sd15_lora',
            }),
            lora_strength: form.float({ default: 0.5, min: 0, max: 2, step: 0.1 }),
            ...ui_subform_IPAdapter_common(form),
            includeAdditionalIPAdapter: form.groupOpt({
                default: false,
                tooltip:
                    'Enabling will apply an additional IPAdapter. This usually makes faces more accurate, but pulls along more features from the face image.',
                items: () => ({
                    help: form.markdown({
                        startCollapsed: true,
                        markdown: `Recommended to select a model with "face" in it but NOT "faceID". So ip-adapter-plus-face_sd15 for example.\nAlso keep the strength pretty low. Like 0.3 unless you want the image dominated by the face image style.`,
                    }),
                    ...ui_ipadapter_modelSelection(form, 'ip-adapter-plus-face_sd15.safetensors', ipAdapterModelList),
                    ...ui_subform_IPAdapter_common(form, 0.3),
                }),
            }),
        }),
    })
}

// 🅿️ IPAdapter Common FORM ===================================================
const ui_subform_IPAdapter_common = (form: FormBuilder, defaultStrength: number = 1.0) => ({
    strength: form.float({ default: defaultStrength, min: 0, max: 2, step: 0.1 }),
    crop: form.bool({ default: true }),
    advanced: form.groupOpt({
        label: 'Advanced',
        items: () => ({
            startAtStepPercent: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            endAtStepPercent: form.float({ default: 1, min: 0, max: 1, step: 0.1 }),
            noise: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            unfold_batch: form.bool({ default: false }),
        }),
    }),
})

//🅿️ IPAdapter CLIP Selection ===================================================
const ui_ipadapter_CLIPSelection = (form: FormBuilder) => ({
    clip_name: form.enum({
        enumName: 'Enum_CLIPVisionLoader_clip_name',
        default: { value: 'model.safetensors' },
        recommandedModels: {
            modelFolderPrefix: 'models/clip_vision',
            knownModel: ipAdapterClipModelList,
        },
        // default: 'ip-adapter_sd15.safetensors'
        label: 'CLIP Vision Model',
    }),
})

//🅿️ IPAdapter Model Selection ===================================================
const ui_ipadapter_modelSelection = (
    form: FormBuilder,
    defaultModel: Enum_IPAdapterModelLoader_ipadapter_file = 'ip-adapter_sd15.safetensors',
    knownModels: ComfyUIManagerKnownModelNames | ComfyUIManagerKnownModelNames[] | undefined,
) => ({
    cnet_model_name: form.enum({
        enumName: 'Enum_IPAdapterModelLoader_ipadapter_file',
        default: { value: defaultModel },
        recommandedModels: {
            knownModel: knownModels,
        },
        // default: 'ip-adapter_sd15.safetensors'
        label: 'IP Adapter Model',
    }),
})

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
    const ip_model = graph.IPAdapterModelLoader({ ipadapter_file: ip.cnet_model_name })
    const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ip.clip_name })
    const ip_adapted_model = graph.IPAdapterApply({
        ipadapter: ip_model,
        clip_vision: ip_clip_name,
        image: image,
        model: cnet_args.ckptPos,
        weight: ip.strength,
        noise: ip.advanced?.noise ?? 0,
        weight_type: 'original',
        start_at: ip.advanced?.startAtStepPercent ?? 0,
        end_at: ip.advanced?.endAtStepPercent ?? 1,
        unfold_batch: ip.advanced?.unfold_batch ?? false,
    })._MODEL

    return { ip_adapted_model }
}

// 🅿️ IPAdapter FaceID RUN ===================================================
export const run_cnet_IPAdapterFaceID = (
    IPAdapter: OutputFor<typeof ui_IPAdapterFaceID>,
    cnet_args: Cnet_args,
    image: _IMAGE,
): {
    ip_adapted_model: _MODEL
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const ip = IPAdapter

    let ckpt = cnet_args.ckptPos
    ckpt = graph.Load_Lora({
        model: ckpt,
        clip: run.AUTO,
        strength_clip: ip.lora_strength,
        strength_model: ip.lora_strength,
        lora_name: ip.lora,
    })

    const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ip.clip_name })

    const faceIDnode = graph.IPAdapterApplyFaceID({
        ipadapter: graph.IPAdapterModelLoader({ ipadapter_file: ip.cnet_model_name }),
        clip_vision: ip_clip_name,
        insightface: graph.InsightFaceLoader({ provider: 'CPU' }),
        image: image,
        model: ckpt,
        weight: ip.strength,
        noise: ip.advanced?.noise ?? 0,
        weight_type: 'original',
        start_at: ip.advanced?.startAtStepPercent ?? 0.33,
        end_at: ip.advanced?.endAtStepPercent ?? 1,
        unfold_batch: ip.advanced?.unfold_batch ?? false,
    })

    ckpt = faceIDnode._MODEL

    if (ip.includeAdditionalIPAdapter) {
        const ip_model = graph.IPAdapterModelLoader({ ipadapter_file: ip.includeAdditionalIPAdapter.cnet_model_name })
        const ip_adapted_model = graph.IPAdapterApply({
            ipadapter: ip_model,
            clip_vision: ip_clip_name,
            image: image,
            model: ckpt,
            weight: ip.includeAdditionalIPAdapter.strength,
            noise: ip.includeAdditionalIPAdapter.advanced?.noise ?? 0,
            weight_type: 'original',
            start_at: ip.includeAdditionalIPAdapter.advanced?.startAtStepPercent ?? 0.33,
            end_at: ip.includeAdditionalIPAdapter.advanced?.endAtStepPercent ?? 0.67,
            unfold_batch: ip.includeAdditionalIPAdapter.advanced?.unfold_batch ?? false,
        })._MODEL
        ckpt = ip_adapted_model
    }

    return { ip_adapted_model: ckpt }
}
