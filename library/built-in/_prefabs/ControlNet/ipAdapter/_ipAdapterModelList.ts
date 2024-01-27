import type { ComfyUIManagerKnownModelNames } from 'src/wiki/modelListType'

export const ipAdapterModelList: ComfyUIManagerKnownModelNames[] = [
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

export const ipAdapter_faceID_ClipModelList: ComfyUIManagerKnownModelNames[] = [
    //
    'ip-adapter-faceid_sd15.bin',
    'ip-adapter-faceid-plusv2_sd15.bin',
]

export const ipAdapter_faceID_LoraList: ComfyUIManagerKnownModelNames[] = [
    //
    'ip-adapter-faceid_sd15_lora.safetensors',
    'ip-adapter-faceid-plusv2_sd15_lora.safetensors',
]
