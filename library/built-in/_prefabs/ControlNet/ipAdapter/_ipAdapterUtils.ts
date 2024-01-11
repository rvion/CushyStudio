import type { ComfyUIManagerKnownModelNames } from 'src/wiki/modelListType'
import type { FormBuilder } from 'src'
import { ipAdapterClipModelList } from './_ipAdapterModelList'

// 🅿️ IPAdapter Common FORM ===================================================
export const ui_subform_IPAdapter_common = (form: FormBuilder, defaultStrength: number = 1) => ({
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
export const ui_ipadapter_CLIPSelection = (form: FormBuilder) => ({
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
export const ui_ipadapter_modelSelection = (
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
