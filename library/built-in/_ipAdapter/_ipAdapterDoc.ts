export const ipAdapterDoc = `\
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
