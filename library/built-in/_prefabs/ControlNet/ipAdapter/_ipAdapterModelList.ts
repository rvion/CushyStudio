import type { KnownModel_Name } from 'src/manager/model-list/KnownModel_Name'

export const ipAdapterModelList: KnownModel_Name[] = [
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

export const ipAdapter_faceID_ClipModelList: KnownModel_Name[] = [
    //
    'ip-adapter-faceid_sd15.bin',
    'ip-adapter-faceid-plusv2_sd15.bin',
    'ip-adapter-faceid_sdxl.bin',
]

export const ipAdapter_faceID_LoraList: KnownModel_Name[] = [
    //
    'ip-adapter-faceid_sd15_lora.safetensors',
    'ip-adapter-faceid-plusv2_sd15_lora.safetensors',
    'ip-adapter-faceid-plusv2_sdxl_lora.safetensors',
]
