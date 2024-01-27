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
    clip_name: form.enum.Enum_CLIPVisionLoader_clip_name({
        default: 'SD1.5\\CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors',
        recommandedModels: {
            modelFolderPrefix: 'models/clip_vision',
            knownModel: ipAdapterClipModelList,
        },
        // default: 'ip-adapter_sd15.safetensors'
        label: 'CLIP Vision Model',
    }),
})
