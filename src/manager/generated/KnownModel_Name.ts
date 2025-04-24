// prettier-ignore
export type KnownModel_Name =
    /** Antelopev2 1k3d68.onnx model for InstantId. (InstantId needs all Antelopev2 models)
     * 143.6MB - https://huggingface.co/MonsterMMORPG/tools/resolve/main/1k3d68.onnx
     * see https://github.com/cubiq/ComfyUI_InstantID#installation
     */
    | "1k3d68.onnx"
    /** Buffalo_l 1k3d68.onnx model for IpAdapterPlus
     * 143.6MB - https://huggingface.co/public-data/insightface/resolve/main/models/buffalo_l/1k3d68.onnx
     * see https://github.com/cubiq/ComfyUI_IPAdapter_plus?tab=readme-ov-file#faceid
     */
    | "1k3d68.onnx"
    /** Antelopev2 2d106det.onnx model for InstantId. (InstantId needs all Antelopev2 models)
     * 5.03MB - https://huggingface.co/MonsterMMORPG/tools/resolve/main/2d106det.onnx
     * see https://github.com/cubiq/ComfyUI_InstantID#installation
     */
    | "2d106det.onnx"
    /** Buffalo_l 2d106det.onnx model for IpAdapterPlus
     * 5.03MB - https://huggingface.co/public-data/insightface/resolve/main/models/buffalo_l/2d106det.onnx
     * see https://github.com/cubiq/ComfyUI_IPAdapter_plus?tab=readme-ov-file#faceid
     */
    | "2d106det.onnx"
    /** 4x_foolhardy_Remacri upscaler model
     * 67.0MB - https://huggingface.co/FacehugmanIII/4x_foolhardy_Remacri/resolve/main/4x_foolhardy_Remacri.pth
     * see https://huggingface.co/FacehugmanIII/4x_foolhardy_Remacri
     */
    | "4x_foolhardy_Remacri"
    /** 4x_NMKD-Siax_200k upscaler model
     * 67.0MB - https://huggingface.co/gemasai/4x_NMKD-Siax_200k/resolve/main/4x_NMKD-Siax_200k.pth
     * see https://huggingface.co/gemasai/4x_NMKD-Siax_200k
     */
    | "4x_NMKD-Siax_200k"
    /** 4xRealWebPhoto_v4_dat2
     * undefined - https://huggingface.co/gemasai/4x_NMKD-Siax_200k/resolve/main/4xRealWebPhoto_v4_dat2.pth
     * see https://openmodeldb.info/models/4x-RealWebPhoto-v4-dat2
     */
    | "4x_NMKD-Siax_200k"
    /** 4x-AnimeSharp upscaler model
     * 67.0MB - https://huggingface.co/Kim2091/AnimeSharp/resolve/main/4x-AnimeSharp.pth
     * see https://huggingface.co/Kim2091/AnimeSharp/
     */
    | "4x-AnimeSharp"
    /** 4x-UltraSharp upscaler model
     * 67.0MB - https://huggingface.co/Kim2091/UltraSharp/resolve/main/4x-UltraSharp.pth
     * see https://huggingface.co/Kim2091/UltraSharp/
     */
    | "4x-UltraSharp"
    /** 8x_NMKD-Faces_160000_G upscaler model
     * 67.2MB - https://huggingface.co/gemasai/8x_NMKD-Faces_160000_G/resolve/main/8x_NMKD-Faces_160000_G.pth
     * see https://huggingface.co/gemasai/8x_NMKD-Faces_160000_G/tree/main
     */
    | "8x_NMKD-Faces_160000_G"
    /** 8x_NMKD-Superscale_150000_G upscaler model
     * 67.1MB - https://huggingface.co/uwg/upscaler/resolve/main/ESRGAN/8x_NMKD-Superscale_150000_G.pth
     * see https://huggingface.co/uwg/upscaler
     */
    | "8x_NMKD-Superscale_150000_G"
    /** AbyssOrangeMix2 - hard version (anime style)
     * 5.57GB - https://huggingface.co/WarriorMama777/OrangeMixs/resolve/main/Models/AbyssOrangeMix2/AbyssOrangeMix2_hard.safetensors
     * see https://huggingface.co/WarriorMama777/OrangeMixs
     */
    | "AbyssOrangeMix2 (hard)"
    /** AbyssOrangeMix3 - A1 (anime style)
     * 2.13GB - https://huggingface.co/WarriorMama777/OrangeMixs/resolve/main/Models/AbyssOrangeMix3/AOM3A1_orangemixs.safetensors
     * see https://huggingface.co/WarriorMama777/OrangeMixs
     */
    | "AbyssOrangeMix3 A1"
    /** AbyssOrangeMix - A3 (anime style)
     * 2.13GB - https://huggingface.co/WarriorMama777/OrangeMixs/resolve/main/Models/AbyssOrangeMix3/AOM3A3_orangemixs.safetensors
     * see https://huggingface.co/WarriorMama777/OrangeMixs
     */
    | "AbyssOrangeMix3 A3"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.67GB - https://huggingface.co/manshoety/AD_Stabilized_Motion/resolve/main/mm-Stabilized_high.pth
     * see https://huggingface.co/manshoety/AD_Stabilized_Motion
     */
    | "AD_Stabilized_Motion/mm-Stabilized_high.pth (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.67GB - https://huggingface.co/manshoety/AD_Stabilized_Motion/resolve/main/mm-Stabilized_mid.pth
     * see https://huggingface.co/manshoety/AD_Stabilized_Motion
     */
    | "AD_Stabilized_Motion/mm-Stabilized_mid.pth (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.82GB - https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v15_v2.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/mm_sd_v15_v2.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.67GB - https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v15.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/mm_sd_v15.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the ArtVentureX/AnimateDiff extension node.
     * 1.67GB - https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v15.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/mm_sd_v15.ckpt (comfyui-animatediff) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 950.1MB - https://huggingface.co/guoyww/animatediff/resolve/main/mm_sdxl_v10_beta.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/mm_sdxl_v10_beta.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.67GB - https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v14.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/mmd_sd_v14.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the ArtVentureX/AnimateDiff extension node.
     * 1.67GB - https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v14.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/mmd_sd_v14.ckpt (comfyui-animatediff) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 77.5MB - https://huggingface.co/guoyww/animatediff/resolve/main/v2_lora_PanLeft.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v2_lora_PanLeft.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 77.5MB - https://huggingface.co/guoyww/animatediff/resolve/main/v2_lora_PanRight.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v2_lora_PanRight.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 77.5MB - https://huggingface.co/guoyww/animatediff/resolve/main/v2_lora_RollingAnticlockwise.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v2_lora_RollingAnticlockwise.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 77.5MB - https://huggingface.co/guoyww/animatediff/resolve/main/v2_lora_RollingClockwise.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v2_lora_RollingClockwise.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 77.5MB - https://huggingface.co/guoyww/animatediff/resolve/main/v2_lora_TiltDown.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v2_lora_TiltDown.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 77.5MB - https://huggingface.co/guoyww/animatediff/resolve/main/v2_lora_TiltUp.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v2_lora_TiltUp.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 77.5MB - https://huggingface.co/guoyww/animatediff/resolve/main/v2_lora_ZoomIn.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v2_lora_ZoomIn.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 77.5MB - https://huggingface.co/guoyww/animatediff/resolve/main/v2_lora_ZoomOut.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v2_lora_ZoomOut.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** AnimateDiff Adapter LoRA (SD1.5)
     * 102.1MB - https://huggingface.co/guoyww/animatediff/resolve/main/v3_sd15_adapter.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v3_sd15_adapter.ckpt"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.67GB - https://huggingface.co/guoyww/animatediff/resolve/main/v3_sd15_mm.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v3_sd15_mm.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** AnimateDiff SparseCtrl RGB ControlNet model
     * 1.99GB - https://huggingface.co/guoyww/animatediff/resolve/main/v3_sd15_sparsectrl_rgb.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v3_sd15_sparsectrl_rgb.ckpt (ComfyUI-AnimateDiff-Evolved)"
    /** AnimateDiff SparseCtrl Scribble ControlNet model
     * 1.99GB - https://huggingface.co/guoyww/animatediff/resolve/main/v3_sd15_sparsectrl_scribble.ckpt
     * see https://huggingface.co/guoyww/animatediff
     */
    | "animatediff/v3_sd15_sparsectrl_scribble.ckpt"
    /** The idea behind this embedding was to somehow train the negative prompt as an embedding, thus unifying the basis of the negative prompt into one word or embedding.
     * 25KB - https://civitai.com/api/download/models/60095
     * see https://civitai.com/models/55700/badprompt-negative-embedding
     */
    | "bad_prompt Negative Embedding"
    /** BLIP ImageCaption (COCO) w/ ViT-B and CapFilt-L
     * 2.12GB - https://storage.googleapis.com/sfr-vision-language-research/BLIP/models/model_base_capfilt_large.pth
     * see https://github.com/salesforce/BLIP
     */
    | "BLIP ImageCaption (COCO) w/ ViT-B and CapFilt-L"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.67GB - https://huggingface.co/CiaraRowles/TemporalDiff/resolve/main/temporaldiff-v1-animatediff.ckpt
     * see https://huggingface.co/CiaraRowles/TemporalDiff
     */
    | "CiaraRowles/temporaldiff-v1-animatediff.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** This is TemporalNet1XL, it is a re-train of the controlnet TemporalNet1 with Stable Diffusion XL.
     * 5.00GB - https://huggingface.co/CiaraRowles/controlnet-temporalnet-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/CiaraRowles/controlnet-temporalnet-sdxl-1.0
     */
    | "CiaraRowles/TemporalNet1XL (1.0)"
    /** TemporalNet was a ControlNet model designed to enhance the temporal consistency of generated outputs
     * 5.71GB - https://huggingface.co/CiaraRowles/TemporalNet2/resolve/main/temporalnetversion2.safetensors
     * see https://huggingface.co/CiaraRowles/TemporalNet2
     */
    | "CiaraRowles/TemporalNet2"
    /** FLUX.1 [Dev] Diffusion model (f16/.gguf)
     * 23.8GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-F16.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-F16.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q2_K/.gguf)
     * 4.03GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q2_K.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q2_K.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q3_K_S/.gguf)
     * 5.23GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q3_K_S.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q3_K_S.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q4_0/.gguf)
     * 6.79GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q4_0.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q4_0.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q4_1/.gguf)
     * 7.53GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q4_1.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q4_1.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q4_K_S/.gguf)
     * 6.81GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q4_K_S.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q4_K_S.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q5_0/.gguf)
     * 8.27GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q5_0.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q5_0.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q5_1/.gguf)
     * 9.01GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q5_1.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q5_1.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q5_K_S/.gguf)
     * 8.29GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q5_K_S.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q5_K_S.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q6_K/.gguf)
     * 9.86GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q6_K.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q6_K.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q8_0/.gguf)
     * 12.7GB - https://huggingface.co/city96/FLUX.1-dev-gguf/resolve/main/flux1-dev-Q8_0.gguf
     * see https://huggingface.co/city96/FLUX.1-dev-gguf
     */
    | "city96/flux1-dev-Q8_0.gguf"
    /** FLUX.1 [Dev] Diffusion model (f16/.gguf)
     * 23.8GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-F16.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-F16.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q2_K/.gguf)
     * 4.01GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q2_K.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q2_K.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q3_K_S/.gguf)
     * 5.21GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q3_K_S.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q3_K_S.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q4_0/.gguf)
     * 6.77GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q4_0.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q4_0.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q4_1/.gguf)
     * 7.51GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q4_1.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q4_1.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q4_K_S/.gguf)
     * 6.78GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q4_K_S.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q4_K_S.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q5_0/.gguf)
     * 8.25GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q5_0.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q5_0.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q5_1/.gguf)
     * 8.99GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q5_1.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q5_1.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q5_K_S/.gguf)
     * 8.26GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q5_K_S.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q5_K_S.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q6_K/.gguf)
     * 9.83GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q6_K.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q6_K.gguf"
    /** FLUX.1 [Dev] Diffusion model (Q8_0/.gguf)
     * 12.7GB - https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q8_0.gguf
     * see https://huggingface.co/city96/FLUX.1-schnell-gguf
     */
    | "city96/flux1-schnell-Q8_0.gguf"
    /** t5xxl Text Encoder GGUF model. (float 16)
     * 9.53GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-f16.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-f16.gguf"
    /** t5xxl Text Encoder GGUF model. (float 32)
     * 19.1GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-f32.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-f32.gguf"
    /** t5xxl Text Encoder GGUF model. (Q3_K_L quantized)
     * 2.46GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q3_K_L.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q3_K_L.gguf"
    /** t5xxl Text Encoder GGUF model. (Q3_K_M quantized)
     * 2.3GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q3_K_M.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q3_K_M.gguf"
    /** t5xxl Text Encoder GGUF model. (Q3_K_S quantized)
     * 2.1GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q3_K_S.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q3_K_S.gguf"
    /** t5xxl Text Encoder GGUF model. (Q4_K_M quantized)
     * 2.9GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q4_K_M.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q4_K_M.gguf"
    /** t5xxl Text Encoder GGUF model. (Q4_K_S quantized)
     * 2.74GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q4_K_S.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q4_K_S.gguf"
    /** t5xxl Text Encoder GGUF model. (Q5_K_M quantized)
     * 3.39GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q5_K_M.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q5_K_M.gguf"
    /** t5xxl Text Encoder GGUF model. (Q5_K_S quantized)
     * 3.29GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q5_K_S.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q5_K_S.gguf"
    /** t5xxl Text Encoder GGUF model. (Q6_K quantized)
     * 3.91GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q6_K.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q6_K.gguf"
    /** t5xxl Text Encoder GGUF model. (Q8_0 quantized)
     * 5.06GB - https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/resolve/main/t5-v1_1-xxl-encoder-Q8_0.gguf
     * see https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf
     */
    | "city96/t5-v1_1-xxl-encoder-Q8_0.gguf"
    /** CLIPVision model (needed for IP-Adapter)
     * 3.69GB - https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/image_encoder/model.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "CLIPVision model (IP-Adapter) CLIP-ViT-bigG-14-laion2B-39B-b160k"
    /** CLIPVision model (needed for IP-Adapter)
     * 2.53GB - https://huggingface.co/h94/IP-Adapter/resolve/main/models/image_encoder/model.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "CLIPVision model (IP-Adapter) CLIP-ViT-H-14-laion2B-s32B-b79K"
    /** CLIPVision model (needed for IP-Adapter)
     * 1.71GB - https://huggingface.co/Kwai-Kolors/Kolors-IP-Adapter-Plus/resolve/main/image_encoder/pytorch_model.bin
     * see https://huggingface.co/Kwai-Kolors/Kolors-IP-Adapter-Plus
     */
    | "CLIPVision model (Kwai-Kolors/Kolors-IP-Adapter-Plus/clip-vit-large)"
    /** CLIPVision model (needed for styles model)
     * 1.71GB - https://huggingface.co/openai/clip-vit-large-patch14/resolve/main/model.safetensors
     * see https://huggingface.co/openai/clip-vit-large-patch14
     */
    | "CLIPVision model (openai/clip-vit-large)"
    /** clip_g vision model
     * 3.69GB - https://huggingface.co/stabilityai/control-lora/resolve/main/revision/clip_vision_g.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "CLIPVision model (stabilityai/clip_vision_g)"
    /** AnyTest Controlnet Lora (dim128) for Animagine. A strict control model.
     * 395.7MB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v3-50000_am_dim128.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v3-50000_am_dim128.safetensors (dim128/Animagine)"
    /** AnyTest Controlnet Lora (dim256) for Animagine. A strict control model.
     * 774.4MB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v3-50000_am_dim256.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v3-50000_am_dim256.safetensors (dim256/Animagine)"
    /** AnyTest Controlnet. A strict control model.
     * 2.50GB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v3-50000_fp16.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v3-50000_fp16.safetensors (fp16)"
    /** AnyTest Controlnet Lora (dim128) for Pony. A strict control model.
     * 395.7MB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v3-50000_pn_dim128.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v3-50000_pn_dim128.safetensors (dim128/Pony)"
    /** AnyTest Controlnet Lora (dim256) for Pony. A strict control model.
     * 774.4MB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v3-50000_pn_dim256.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v3-50000_pn_dim256.safetensors (dim256/Pony)"
    /** AnyTest Controlnet Lora (dim128) for Animagine. A model for style transfer.
     * 395.7MB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v4-marged_am_dim128.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v4-marged_am_dim128.safetensors (dim128/Animagine)"
    /** AnyTest Controlnet Lora (dim256) for Animagine. A model for style transfer.
     * 774.4MB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v4-marged_am_dim256.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v4-marged_am_dim256.safetensors (dim256/Animagine)"
    /** AnyTest Controlnet Lora (dim128) for Pony. A model for style transfer.
     * 395.7MB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v4-marged_pn_dim128.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v4-marged_pn_dim128.safetensors (dim128/Pony)"
    /** AnyTest Controlnet Lora (dim256) for Pony. A model for style transfer.
     * 774.4MB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v4-marged_pn_dim256.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v4-marged_pn_dim256.safetensors (dim256/Pony)"
    /** AnyTest Controlnet. A model for style transfer.
     * 2.50GB - https://huggingface.co/2vXpSwA7/iroiro-lora/resolve/main/test_controlnet2/CN-anytest_v4-marged.safetensors
     * see https://huggingface.co/2vXpSwA7/iroiro-lora/tree/main
     */
    | "CN-anytest_v4-marged.safetensors"
    /** Face Restoration Models. Download the model required for using the 'Facerestore CF (Code Former)' custom node.
     * 376.6MB - https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/codeformer.pth
     * see https://github.com/sczhou/CodeFormer/releases
     */
    | "codeformer.pth"
    /** FLUX.1 [dev] Checkpoint model (fp8)
     * 17.2GB - https://huggingface.co/Comfy-Org/flux1-dev/resolve/main/flux1-dev-fp8.safetensors
     * see https://huggingface.co/Comfy-Org/flux1-dev/tree/main
     */
    | "Comfy Org/FLUX.1 [dev] Checkpoint model (fp8)"
    /** FLUX.1 [schnell] Checkpoint model (fp8)
     * 17.2GB - https://huggingface.co/Comfy-Org/flux1-schnell/resolve/main/flux1-schnell-fp8.safetensors
     * see https://huggingface.co/Comfy-Org/flux1-dev/tree/main
     */
    | "Comfy Org/FLUX.1 [schnell] Checkpoint model (fp8)"
    /** clip_g model (for SDXL, SD3.5)
     * 1.39GB - https://huggingface.co/Comfy-Org/stable-diffusion-3.5-fp8/resolve/main/text_encoders/clip_g.safetensors
     * see https://huggingface.co/Comfy-Org/stable-diffusion-3.5-fp8
     */
    | "Comfy-Org/clip_g"
    /** clip_l model (for SD1.x, SD2.x, SDXL, SD3.5, FLUX.1, HunyuanVideo, ...) 
     * 246MB - https://huggingface.co/Comfy-Org/stable-diffusion-3.5-fp8/resolve/main/text_encoders/clip_l.safetensors
     * see https://huggingface.co/Comfy-Org/stable-diffusion-3.5-fp8
     */
    | "Comfy-Org/clip_l"
    /** Huyuan Video Image2Video diffusion model. repackaged version.
     * 25.6GB - https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged/resolve/main/split_files/diffusion_models/hunyuan_video_image_to_video_720p_bf16.safetensors
     * see https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged
     */
    | "Comfy-Org/hunyuan_video_image_to_video_720p_bf16.safetensors"
    /** Huyuan Video diffusion model. repackaged version.
     * 25.6GB - https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged/resolve/main/split_files/diffusion_models/hunyuan_video_t2v_720p_bf16.safetensors
     * see https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged
     */
    | "Comfy-Org/hunyuan_video_t2v_720p_bf16.safetensors"
    /** Huyuan Video VAE model. repackaged version.
     * 493MB - https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged/resolve/main/split_files/vae/hunyuan_video_vae_bf16.safetensors
     * see https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged
     */
    | "Comfy-Org/hunyuan_video_vae_bf16.safetensors"
    /** llava_llama3_fp16 text encoder model. This is required for using Hunyuan Video.
     * 16.1GB - https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged/resolve/main/split_files/text_encoders/llava_llama3_fp16.safetensors
     * see https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged
     */
    | "Comfy-Org/llava_llama3_fp16.safetensors"
    /** llava_llama3_fp8_scaled text encoder model. This is required for using Hunyuan Video.
     * 9.09GB - https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged/resolve/main/split_files/text_encoders/llava_llama3_fp8_scaled.safetensors
     * see https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged
     */
    | "Comfy-Org/llava_llama3_fp8_scaled.safetensors"
    /** llava_llama3_vision clip vison model. This is required for using Hunyuan Video Image2Video.
     * 649MB - https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged/resolve/main/split_files/clip_vision/llava_llama3_vision.safetensors
     * see https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged
     */
    | "Comfy-Org/llava_llama3_vision.safetensors"
    /** This clip vision model is required for FLUX.1 Redux.
     * 857MB - https://huggingface.co/Comfy-Org/sigclip_vision_384/resolve/main/sigclip_vision_patch14_384.safetensors
     * see https://huggingface.co/Comfy-Org/sigclip_vision_384/tree/main
     */
    | "Comfy-Org/sigclip_vision_384 (patch14_384)"
    /** VAE model for Cosmos 1.0
     * 211MB - https://huggingface.co/comfyanonymous/cosmos_1.0_text_encoder_and_VAE_ComfyUI/resolve/main/vae/cosmos_cv8x8x8_1.0.safetensors
     * see https://huggingface.co/comfyanonymous/cosmos_1.0_text_encoder_and_VAE_ComfyUI/tree/main
     */
    | "comfyanonymous/cosmos_cv8x8x8_1.0.safetensors"
    /** Text Encoders for FLUX (fp16)
     * 9.79GB - https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/flux_text_encoders
     */
    | "comfyanonymous/flux_text_encoders - t5xxl (fp16)"
    /** Text Encoders for FLUX (fp16)
     * 5.16GB - https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp8_e4m3fn_scaled.safetensors
     * see https://huggingface.co/comfyanonymous/flux_text_encoders
     */
    | "comfyanonymous/flux_text_encoders - t5xxl (fp8_e4m3fn_scaled)"
    /** Text Encoders for FLUX (fp8_e4m3fn)
     * 4.89GB - https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp8_e4m3fn.safetensors
     * see https://huggingface.co/comfyanonymous/flux_text_encoders
     */
    | "comfyanonymous/flux_text_encoders - t5xxl (fp8_e4m3fn)"
    /** Loose ControlNet model
     * 722.6MB - https://huggingface.co/ioclab/LooseControl_WebUICombine/resolve/main/control_boxdepth_LooseControlfp16.safetensors
     * see https://huggingface.co/ioclab/LooseControl_WebUICombine
     */
    | "control_boxdepth_LooseControlfp16 (fp16)"
    /** This inpaint-depth controlnet model is specialized for the hand refiner.
     * 722.6MB - https://huggingface.co/hr16/ControlNet-HandRefiner-pruned/resolve/main/control_sd15_inpaint_depth_hand_fp16.safetensors
     * see https://huggingface.co/hr16/ControlNet-HandRefiner-pruned
     */
    | "ControlNet-HandRefiner-pruned (inpaint-depth-hand; fp16)"
    /** ControlNet depth-zoe model for SDXL
     * 5.00GB - https://huggingface.co/SargeZT/controlnet-sd-xl-1.0-depth-16bit-zoe/resolve/main/depth-zoe-xl-v1.0-controlnet.safetensors
     * see https://huggingface.co/SargeZT/controlnet-sd-xl-1.0-depth-16bit-zoe
     */
    | "controlnet-SargeZT/controlnet-sd-xl-1.0-depth-16bit-zoe"
    /** ControlNet softedge model for SDXL
     * 5.00GB - https://huggingface.co/SargeZT/controlnet-sd-xl-1.0-softedge-dexined/resolve/main/controlnet-sd-xl-1.0-softedge-dexined.safetensors
     * see https://huggingface.co/SargeZT/controlnet-sd-xl-1.0-softedge-dexined
     */
    | "controlnet-SargeZT/controlnet-sd-xl-1.0-softedge-dexined"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (anime)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15s2_lineart_anime_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (anime; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (canny)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_canny_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (canny; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (depth)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11f1p_sd15_depth_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (depth; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (inpaint)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_inpaint_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (inpaint; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (ip2p)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11e_sd15_ip2p_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (ip2p; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (lineart)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_lineart_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (lineart; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (mlsd)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_mlsd_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (mlsd; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (normalbae)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_normalbae_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (normalbae; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (openpose)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_openpose_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (openpose; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (scribble)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_scribble_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (scribble; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (seg)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_seg_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (seg; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (shuffle)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11e_sd15_shuffle_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (shuffle; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (softedge)
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_softedge_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (softedge; fp16)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (tile) / v11f1e
You need to this model for <B>Tiled Resample</B>
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11f1e_sd15_tile_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (tile; fp16; v11f1e)"
    /** Safetensors/FP16 versions of the new ControlNet-v1-1 checkpoints (tile) / v11u
     * 722.6MB - https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11u_sd15_tile_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors
     */
    | "ControlNet-v1-1 (tile; fp16; v11u)"
    /** These embedding learn what disgusting compositions and color patterns are, including faulty human anatomy, offensive color schemes, upside-down spatial structures, and more. Placing it in the negative can go a long way to avoiding these things.
     * 226KB - https://civitai.com/api/download/models/5637
     * see https://civitai.com/models/4629/deep-negative-v1x
     */
    | "Deep Negative V1.75"
    /** Checkpoint of the deepbump model to generate height and normal maps textures from an image (requires comfy_mtb)
     * 26.7MB - https://github.com/HugoTini/DeepBump/raw/master/deepbump256.onnx
     * see https://github.com/HugoTini/DeepBump
     */
    | "Deepbump"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 23.9MB - https://huggingface.co/Bingsu/adetailer/resolve/main/deepfashion2_yolov8s-seg.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "deepfashion2_yolov8s (segm)"
    /** [SNAPSHOT] Janus-Pro-1B model.[w/You cannot download this item on ComfyUI-Manager versions below V3.18]
     * 7.8GB - deepseek-ai/Janus-Pro-1B
     * see https://huggingface.co/deepseek-ai/Janus-Pro-1B
     */
    | "deepseek-ai/Janus-Pro-1B"
    /** [SNAPSHOT] Janus-Pro-7B model.[w/You cannot download this item on ComfyUI-Manager versions below V3.18]
     * 14.85GB - deepseek-ai/Janus-Pro-7B
     * see https://huggingface.co/deepseek-ai/Janus-Pro-7B
     */
    | "deepseek-ai/Janus-Pro-7B"
    /** Depth pro model for [a/ComfyUI-Depth-Pro](https://github.com/spacepxl/ComfyUI-Depth-Pro)
     * 1.9GB - https://huggingface.co/spacepxl/ml-depth-pro/resolve/main/depth_pro.fp16.safetensors
     * see https://huggingface.co/spacepxl/ml-depth-pro
     */
    | "Depth Pro model"
    /** Depth-FM monocular depth estimation model
     * 1.73GB - https://huggingface.co/Kijai/depth-fm-pruned/resolve/main/depthfm-v1_fp16.safetensors
     * see https://huggingface.co/Kijai/depth-fm-pruned
     */
    | "Depth-FM-v1 fp16 safetensors"
    /** Depth-FM monocular depth estimation model
     * 3.46GB - https://huggingface.co/Kijai/depth-fm-pruned/resolve/main/depthfm-v1_fp32.safetensors
     * see https://huggingface.co/Kijai/depth-fm-pruned
     */
    | "Depth-FM-v1 fp32 safetensors"
    /** Buffalo_l det_10g.onnx model for IpAdapterPlus
     * 16.9MB - https://huggingface.co/public-data/insightface/resolve/main/models/buffalo_l/det_10g.onnx
     * see https://github.com/cubiq/ComfyUI_IPAdapter_plus?tab=readme-ov-file#faceid
     */
    | "det_10g.onnx"
    /** Face Detection Models. Download the model required for using the 'Facerestore CF (Code Former)' custom node.
     * 1.79MB - https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_mobilenet0.25_Final.pth
     * see https://github.com/xinntao/facexlib
     */
    | "detection_mobilenet0.25_Final.pth"
    /** Face Detection Models. Download the model required for using the 'Facerestore CF (Code Former)' custom node.
     * 109.5MB - https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth
     * see https://github.com/xinntao/facexlib
     */
    | "detection_Resnet50_Final.pth"
    /** Stable Diffusion XL inpainting model 0.1. You need UNETLoader instead of CheckpointLoader.
     * 5.14GB - https://huggingface.co/diffusers/stable-diffusion-xl-1.0-inpainting-0.1/resolve/main/unet/diffusion_pytorch_model.fp16.safetensors
     * see https://huggingface.co/diffusers/stable-diffusion-xl-1.0-inpainting-0.1
     */
    | "diffusers/stable-diffusion-xl-1.0-inpainting-0.1 (diffusion_models/fp16)"
    /** Stable Diffusion XL inpainting model 0.1. You need UNETLoader instead of CheckpointLoader.
     * 10.3GB - https://huggingface.co/diffusers/stable-diffusion-xl-1.0-inpainting-0.1/resolve/main/unet/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/diffusers/stable-diffusion-xl-1.0-inpainting-0.1
     */
    | "diffusers/stable-diffusion-xl-1.0-inpainting-0.1 (UNET)"
    /** InstantId controlnet model
     * 2.50GB - https://huggingface.co/InstantX/InstantID/resolve/main/ControlNetModel/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/InstantX/InstantID
     */
    | "diffusion_pytorch_model.safetensors"
    /** DMD2 LoRA (4steps)
     * 787MB - https://huggingface.co/tianweiy/DMD2/resolve/main/dmd2_sdxl_4step_lora.safetensors
     * see https://huggingface.co/tianweiy/DMD2
     */
    | "DMD2 LoRA (4steps)"
    /** DMD2 LoRA (4steps/fp16)
     * 394MB - https://huggingface.co/tianweiy/DMD2/resolve/main/dmd2_sdxl_4step_lora_fp16.safetensors
     * see https://huggingface.co/tianweiy/DMD2
     */
    | "DMD2 LoRA (4steps/fp16)"
    /** DynamiCrafter image2video model 1024x575
     * 5.22GB - https://huggingface.co/Kijai/DynamiCrafter_pruned/resolve/main/dynamicrafter_1024_v1_bf16.safetensors
     * see https://huggingface.co/Kijai/DynamiCrafter_pruned/
     */
    | "DynamiCrafter 1024 bf16 safetensors"
    /** DynamiCrafter image2video interpolation model 512
     * 5.22GB - https://huggingface.co/Kijai/DynamiCrafter_pruned/resolve/main/dynamicrafter_512_interp_v1_bf16.safetensors
     * see https://huggingface.co/Kijai/DynamiCrafter_pruned/
     */
    | "DynamiCrafter 512 interpolation bf16 safetensors"
    /** This embedding should be used in your NEGATIVE prompt. Adjust the strength as desired (seems to scale well without any distortions), the strength required may vary based on positive and negative prompts.
     * 25KB - https://civitai.com/api/download/models/9208
     * see https://civitai.com/models/7808/easynegative
     */
    | "EasyNegative"
    /** Install efficient_sam_s_cpu.jit into ComfyUI-YoloWorld-EfficientSAM
     * 106.0MB - https://huggingface.co/camenduru/YoloWorld-EfficientSAM/resolve/main/efficient_sam_s_cpu.jit
     * see https://huggingface.co/camenduru/YoloWorld-EfficientSAM/tree/main
     */
    | "efficient_sam_s_cpu.jit [ComfyUI-YoloWorld-EfficientSAM]"
    /** Install efficient_sam_s_gpu.jit into ComfyUI-YoloWorld-EfficientSAM
     * 106.0MB - https://huggingface.co/camenduru/YoloWorld-EfficientSAM/resolve/main/efficient_sam_s_gpu.jit
     * see https://huggingface.co/camenduru/YoloWorld-EfficientSAM/tree/main
     */
    | "efficient_sam_s_gpu.jit [ComfyUI-YoloWorld-EfficientSAM]"
    /** ESRGAN x4 upscaler model
     * 66.9MB - https://huggingface.co/Afizi/ESRGAN_4x.pth/resolve/main/ESRGAN_4x.pth
     * see https://huggingface.co/Afizi/ESRGAN_4x.pth
     */
    | "ESRGAN x4"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 52.0MB - https://huggingface.co/Bingsu/adetailer/resolve/main/face_yolov8m.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "face_yolov8m (bbox)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 54.8MB - https://github.com/hben35096/assets/releases/download/yolo8/face_yolov8m-seg_60.pt
     * see https://github.com/hben35096/assets/releases/tag/yolo8
     */
    | "face_yolov8m-seg_60.pt (segm)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 6.23MB - https://huggingface.co/Bingsu/adetailer/resolve/main/face_yolov8n.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "face_yolov8n (bbox)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 6.24MB - https://huggingface.co/Bingsu/adetailer/resolve/main/face_yolov8n_v2.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "face_yolov8n_v2 (bbox)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 6.77MB - https://github.com/hben35096/assets/releases/download/yolo8/face_yolov8n-seg2_60.pt
     * see https://github.com/hben35096/assets/releases/tag/yolo8
     */
    | "face_yolov8n-seg2_60.pt (segm)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 22.5MB - https://huggingface.co/Bingsu/adetailer/resolve/main/face_yolov8s.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "face_yolov8s (bbox)"
    /** FLUX.1 [Dev] Diffusion model (scaled fp8)[w/Due to the large size of the model, it is recommended to download it through a browser if possible.]
     * 11.9GB - https://huggingface.co/comfyanonymous/flux_dev_scaled_fp8_test/resolve/main/flux_dev_fp8_scaled_diffusion_model.safetensors
     * see https://huggingface.co/comfyanonymous/flux_dev_scaled_fp8_test
     */
    | "FLUX.1 [Dev] Diffusion model (scaled fp8)"
    /** FLUX.1 [Schnell] Diffusion model (a.k.a. FLUX.1 turbo model)[w/Due to the large size of the model, it is recommended to download it through a browser if possible.]
     * 23.8GB - https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/flux1-schnell.safetensors
     * see https://huggingface.co/black-forest-labs/FLUX.1-schnell
     */
    | "FLUX.1 [Schnell] Diffusion model"
    /** FLUX.1 VAE model
     * 335MB - https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/ae.safetensors
     * see https://huggingface.co/black-forest-labs/FLUX.1-schnell
     */
    | "FLUX.1 VAE model"
    /** Antelopev2 genderage.onnx model for InstantId. (InstantId needs all Antelopev2 models)
     * 1.32MB - https://huggingface.co/MonsterMMORPG/tools/resolve/main/genderage.onnx
     * see https://github.com/cubiq/ComfyUI_InstantID#installation
     */
    | "genderage.onnx"
    /** Buffalo_l genderage.onnx model for IpAdapterPlus
     * 1.32MB - https://huggingface.co/public-data/insightface/resolve/main/models/buffalo_l/genderage.onnx
     * see https://github.com/cubiq/ComfyUI_IPAdapter_plus?tab=readme-ov-file#faceid
     */
    | "genderage.onnx"
    /** Face restoration
     * 348.6MB - https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth
     * see https://github.com/TencentARC/GFPGAN
     */
    | "GFPGAN 1.3"
    /** Face restoration
     * 348.6MB - https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth
     * see https://github.com/TencentARC/GFPGAN
     */
    | "GFPGAN 1.4"
    /** Face Restoration Models. Download the model required for using the 'Facerestore CF (Code Former)' custom node.
     * 348.6MB - https://github.com/TencentARC/GFPGAN/releases/download/v1.3.4/GFPGANv1.4.pth
     * see https://github.com/TencentARC/GFPGAN/releases
     */
    | "GFPGANv1.4.pth"
    /** GLIGEN textbox model
     * 418.2MB - https://huggingface.co/comfyanonymous/GLIGEN_pruned_safetensors/resolve/main/gligen_sd14_textbox_pruned_fp16.safetensors
     * see https://huggingface.co/comfyanonymous/GLIGEN_pruned_safetensors
     */
    | "GLIGEN textbox (fp16; pruned)"
    /** Antelopev2 glintr100.onnx model for InstantId. (InstantId needs all Antelopev2 models)
     * 260.7MB - https://huggingface.co/MonsterMMORPG/tools/resolve/main/glintr100.onnx
     * see https://github.com/cubiq/ComfyUI_InstantID#installation
     */
    | "glintr100.onnx"
    /** T5 Base: Text-To-Text Transfer Transformer. This model can be loaded via CLIPLoader for Stable Audio workflow.
     * 892MB - https://huggingface.co/google-t5/t5-base/resolve/main/model.safetensors
     * see https://huggingface.co/google-t5/t5-base
     */
    | "google-t5/t5-base"
    /** The encoder part of https://huggingface.co/google/t5-v1_1-xxl, used with SD3 and Flux1
     * 10.1GB - https://huggingface.co/mcmonkey/google_t5-v1_1-xxl_encoderonly/resolve/main/model.safetensors
     * see https://huggingface.co/mcmonkey/google_t5-v1_1-xxl_encoderonly
     */
    | "google-t5/t5-v1_1-xxl_encoderonly-fp16"
    /** The encoder part of https://huggingface.co/google/t5-v1_1-xxl, used with SD3 and Flux1
     * 4.89GB - https://huggingface.co/mcmonkey/google_t5-v1_1-xxl_encoderonly/resolve/main/t5xxl_fp8_e4m3fn.safetensors
     * see https://huggingface.co/mcmonkey/google_t5-v1_1-xxl_encoderonly
     */
    | "google-t5/t5-v1_1-xxl_encoderonly-fp8_e4m3fn"
    /** GroundingDINO SwinT OGC CFG File
     * 1.01KB - https://huggingface.co/ShilongLiu/GroundingDINO/raw/main/GroundingDINO_SwinT_OGC.cfg.py
     * see https://huggingface.co/ShilongLiu/GroundingDINO/resolve/main/GroundingDINO_SwinT_OGC.cfg.py
     */
    | "GroundingDINO SwinT OGC - CFG File"
    /** GroundingDINO SwinT OGC Model
     * 694.0MB - https://huggingface.co/ShilongLiu/GroundingDINO/resolve/main/groundingdino_swint_ogc.pth
     * see https://huggingface.co/ShilongLiu/GroundingDINO
     */
    | "GroundingDINO SwinT OGC - Model"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 6.77MB - https://github.com/hben35096/assets/releases/download/yolo8/hair_yolov8n-seg_60.pt
     * see https://github.com/hben35096/assets/releases/tag/yolo8
     */
    | "hair_yolov8n-seg_60.pt (segm)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 6.24MB - https://huggingface.co/Bingsu/adetailer/resolve/main/hand_yolov8n.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "hand_yolov8n (bbox)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 22.5MB - https://huggingface.co/Bingsu/adetailer/resolve/main/hand_yolov8s.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "hand_yolov8s (bbox)"
    /** Different versions of HunyuanDIT packaged for ComfyUI use.
     * 8.24GB - https://huggingface.co/comfyanonymous/hunyuan_dit_comfyui/resolve/main/hunyuan_dit_1.0.safetensors
     * see https://huggingface.co/comfyanonymous/hunyuan_dit_comfyui
     */
    | "hunyuan_dit_1.0.safetensors"
    /** Different versions of HunyuanDIT packaged for ComfyUI use.
     * 8.24GB - https://huggingface.co/comfyanonymous/hunyuan_dit_comfyui/resolve/main/hunyuan_dit_1.1.safetensors
     * see https://huggingface.co/comfyanonymous/hunyuan_dit_comfyui
     */
    | "hunyuan_dit_1.1.safetensors"
    /** Different versions of HunyuanDIT packaged for ComfyUI use.
     * 8.24GB - https://huggingface.co/comfyanonymous/hunyuan_dit_comfyui/resolve/main/hunyuan_dit_1.2.safetensors
     * see https://huggingface.co/comfyanonymous/hunyuan_dit_comfyui
     */
    | "hunyuan_dit_1.2.safetensors"
    /** Hyper-SD CFG LoRA (12steps)
     * 269MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD15-12steps-CFG-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD CFG LoRA (12steps) - SD1.5"
    /** Hyper-SD CFG LoRA (12steps) - SDXL
     * 787MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SDXL-12steps-CFG-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD CFG LoRA (12steps) - SDXL"
    /** Hyper-SD CFG LoRA (16steps) - SD3
     * 472MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD3-16steps-CFG-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD CFG LoRA (16steps) - SD3"
    /** Hyper-SD CFG LoRA (4steps) - SD3
     * 472MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD3-4steps-CFG-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD CFG LoRA (4steps) - SD3"
    /** Hyper-SD CFG LoRA (8steps)
     * 269MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD15-8steps-CFG-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD CFG LoRA (8steps) - SD1.5"
    /** Hyper-SD CFG LoRA (8steps) - SD3
     * 472MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD3-8steps-CFG-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD CFG LoRA (8steps) - SD3"
    /** Hyper-SD CFG LoRA (8steps) - SDXL
     * 787MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SDXL-8steps-CFG-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD CFG LoRA (8steps) - SDXL"
    /** Hyper-SD LoRA (16steps) - FLUX.1 [Dev]
     * 1.39GB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-FLUX.1-dev-16steps-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (16steps) - FLUX.1 [Dev]"
    /** Hyper-SD LoRA (1step) - SD1.5
     * 269MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD15-1step-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (1step) - SD1.5"
    /** Hyper-SD LoRA (1step) - SDXL
     * 787MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SDXL-1step-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (1step) - SDXL"
    /** Hyper-SD LoRA (2steps) - SD1.5
     * 269MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD15-2steps-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (2steps) - SD1.5"
    /** Hyper-SD LoRA (2steps) - SDXL
     * 787MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SDXL-2steps-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (2steps) - SDXL"
    /** Hyper-SD LoRA (4steps)
     * 269MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD15-4steps-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (4steps) - SD1.5"
    /** Hyper-SD LoRA (4steps) - SDXL
     * 787MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD15-4steps-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (4steps) - SDXL"
    /** Hyper-SD LoRA (8steps) - FLUX.1 [Dev]
     * 1.39GB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-FLUX.1-dev-8steps-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (8steps) - FLUX.1 [Dev]"
    /** Hyper-SD LoRA (8steps)
     * 269MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SD15-8steps-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (8steps) - SD1.5"
    /** Hyper-SD LoRA (8steps) - SDXL
     * 787MB - https://huggingface.co/ByteDance/Hyper-SD/resolve/main/Hyper-SDXL-8steps-lora.safetensors
     * see https://huggingface.co/ByteDance/Hyper-SD
     */
    | "Hyper-SD LoRA (8steps) - SDXL"
    /** Relighting model conditioned with text, foreground, and background
     * 1.72GB - https://huggingface.co/lllyasviel/ic-light/resolve/main/iclight_sd15_fbc.safetensors
     * see https://huggingface.co/lllyasviel/ic-light
     */
    | "IC-Light/fbc"
    /** The default relighting model, conditioned on text and foreground
     * 1.72GB - https://huggingface.co/lllyasviel/ic-light/resolve/main/iclight_sd15_fc.safetensors
     * see https://huggingface.co/lllyasviel/ic-light
     */
    | "IC-Light/fc"
    /** Same as iclight_sd15_fc.safetensors, but trained with offset noise
     * 1.72GB - https://huggingface.co/lllyasviel/ic-light/resolve/main/iclight_sd15_fcon.safetensors
     * see https://huggingface.co/lllyasviel/ic-light
     */
    | "IC-Light/fcon"
    /** Mix model (SD2.1 unCLIP + illuminatiDiffusionV1_v11)
     * 3.98GB - https://huggingface.co/comfyanonymous/illuminatiDiffusionV1_v11_unCLIP/resolve/main/illuminatiDiffusionV1_v11-unclip-h-fp16.safetensors
     * see https://huggingface.co/comfyanonymous/illuminatiDiffusionV1_v11_unCLIP
     */
    | "illuminatiDiffusionV1_v11 unCLIP model"
    /** Fusers checkpoints for multi-object prompting with InstanceDiffusion.
     * 832.1MB - https://huggingface.co/logtd/instance_diffusion/resolve/main/fusers.ckpt
     * see https://huggingface.co/logtd/instance_diffusion
     */
    | "InstanceDiffusion/fusers"
    /** PositionNet checkpoints for multi-object prompting with InstanceDiffusion.
     * 643.2MB - https://huggingface.co/logtd/instance_diffusion/resolve/main/position_net.ckpt
     * see https://huggingface.co/logtd/instance_diffusion
     */
    | "InstanceDiffusion/position_net"
    /** ScaleU checkpoints for multi-object prompting with InstanceDiffusion.
     * 53.1KB - https://huggingface.co/logtd/instance_diffusion/resolve/main/scaleu.ckpt
     * see https://huggingface.co/logtd/instance_diffusion
     */
    | "InstanceDiffusion/scaleu"
    /** instantid controlnet model for cubiq/InstantID
     * 2.50GB - https://huggingface.co/InstantX/InstantID/resolve/main/ControlNetModel/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/InstantX/InstantID
     */
    | "InstantID/ControlNet"
    /** ip-adapter model for cubiq/InstantID
     * 1.69GB - https://huggingface.co/InstantX/InstantID/resolve/main/ip-adapter.bin
     * see https://huggingface.co/InstantX/InstantID
     */
    | "InstantID/ip-adapter"
    /** FLUX.1 [Dev] Union Controlnet. Supports Canny, Depth, Pose, Tile, Blur, Gray Low Quality.
     * 6.6GB - https://huggingface.co/InstantX/FLUX.1-dev-Controlnet-Union/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/InstantX/FLUX.1-dev-Controlnet-Union
     */
    | "InstantX/FLUX.1-dev Controlnet (Union)"
    /** FLUX.1-dev-IP-Adapter
     * 5.29GB - https://huggingface.co/InstantX/FLUX.1-dev-IP-Adapter/resolve/main/ip-adapter.bin
     * see https://huggingface.co/InstantX/FLUX.1-dev-IP-Adapter
     */
    | "InstantX/FLUX.1-dev-IP-Adapter"
    /** Controlnet SD3 Canny model.
     * 1.19GB - https://huggingface.co/InstantX/SD3-Controlnet-Canny/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/InstantX/SD3-Controlnet-Canny
     */
    | "InstantX/SD3-Controlnet-Canny"
    /** Controlnet SD3 Pose model.
     * 1.19GB - https://huggingface.co/InstantX/SD3-Controlnet-Pose/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/InstantX/SD3-Controlnet-Pose
     */
    | "InstantX/SD3-Controlnet-Pose"
    /** Controlnet SD3 Tile model.
     * 1.19GB - https://huggingface.co/InstantX/SD3-Controlnet-Tile/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/InstantX/SD3-Controlnet-Tile
     */
    | "InstantX/SD3-Controlnet-Tile"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 98.2MB - https://huggingface.co/ostris/ip-composition-adapter/resolve/main/ip_plus_composition_sd15.safetensors
     * see https://huggingface.co/ostris/ip-composition-adapter
     */
    | "ip_plus_composition_sd15.safetensors"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 847.5MB - https://huggingface.co/ostris/ip-composition-adapter/resolve/main/ip_plus_composition_sdxl.safetensors
     * see https://huggingface.co/ostris/ip-composition-adapter
     */
    | "ip_plus_composition_sdxl.safetensors"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 44.6MB - https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15_light_v11.bin
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter_sd15_light_v11.bin"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 44.6MB - https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15_light.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter_sd15_light.safetensors [DEPRECATED]"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 46.2MB - https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15_vit-G.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter_sd15_vit-G.safetensors"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 44.6MB - https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter_sd15.safetensors"
    /** This model requires the use of the SD1.5 encoder despite being for SDXL checkpoints [ipadapter]
     * 698.4MB - https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter_sdxl_vit-h.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter_sdxl_vit-h.safetensors"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 702.6MB - https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter_sdxl.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter_sdxl.safetensors"
    /** IP-Adapter-FaceID LoRA Model (SD1.5) [ipadapter]
     * 51.1MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sd15_lora.safetensors
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid_sd15_lora.safetensors"
    /** IP-Adapter-FaceID Model (SD1.5) [ipadapter]
     * 96.7MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sd15.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid_sd15.bin"
    /** IP-Adapter-FaceID LoRA Model (SDXL) [ipadapter]
     * 371.8MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sdxl_lora.safetensors
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid_sdxl_lora.safetensors"
    /** IP-Adapter-FaceID Model (SDXL) [ipadapter]
     * 1.07GB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sdxl.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid_sdxl.bin"
    /** IP-Adapter-FaceID Plus LoRA Model (SD1.5) [ipadapter]
     * 51.1MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plus_sd15_lora.safetensors
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-plus_sd15_lora.safetensors [DEPRECATED]"
    /** IP-Adapter-FaceID Plus Model (SD1.5) [ipadapter]
     * 156.6MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plus_sd15.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-plus_sd15.bin [DEPRECATED]"
    /** IP-Adapter-FaceID-Plus V2 LoRA Model (SD1.5) [ipadapter]
     * 51.1MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sd15_lora.safetensors
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-plusv2_sd15_lora.safetensors"
    /** IP-Adapter-FaceID Plus V2 Model (SD1.5) [ipadapter]
     * 156.6MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sd15.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-plusv2_sd15.bin"
    /** IP-Adapter-FaceID-Plus V2 LoRA Model (SDXL) [ipadapter]
     * 371.8MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sdxl_lora.safetensors
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-plusv2_sdxl_lora.safetensors"
    /** IP-Adapter-FaceID Plus Model (SDXL) [ipadapter]
     * 1.49GB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sdxl.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-plusv2_sdxl.bin"
    /** IP-Adapter-FaceID Portrait Model (SD1.5) [ipadapter]
     * 64.6MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-portrait_sd15.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-portrait_sd15.bin [DEPRECATED]"
    /** IP-Adapter-FaceID Portrait Model (SDXL/unnorm) [ipadapter]
     * 1.01GB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-portrait_sdxl_unnorm.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-portrait_sdxl_unnorm.bin"
    /** IP-Adapter-FaceID Portrait Model (SDXL) [ipadapter]
     * 749.8MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-portrait_sdxl.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-portrait_sdxl.bin"
    /** IP-Adapter-FaceID Portrait V11 Model (SD1.5) [ipadapter]
     * 64.6MB - https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-portrait-v11_sd15.bin
     * see https://huggingface.co/h94/IP-Adapter-FaceID
     */
    | "ip-adapter-faceid-portrait-v11_sd15.bin"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 43.6MB - https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-full-face_sd15.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter-full-face_sd15.safetensors"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 98.2MB - https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus_sd15.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter-plus_sd15.safetensors"
    /** This model requires the use of the SD1.5 encoder despite being for SDXL checkpoints [ipadapter]
     * 847.5MB - https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter-plus_sdxl_vit-h.safetensors"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 98.2MB - https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus-face_sd15.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter-plus-face_sd15.safetensors"
    /** This model requires the use of the SD1.5 encoder despite being for SDXL checkpoints [ipadapter]
     * 847.5MB - https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter-plus-face_sdxl_vit-h.safetensors
     * see https://huggingface.co/h94/IP-Adapter
     */
    | "ip-adapter-plus-face_sdxl_vit-h.safetensors"
    /** InstantId main model based on IpAdapter
     * 1.69GB - https://huggingface.co/InstantX/InstantID/resolve/main/ip-adapter.bin
     * see https://huggingface.co/InstantX/InstantID
     */
    | "ip-adapter.bin"
    /** This is Flux.1-dev ControlNet for Depth map developed by Jasper research team.
     * 3.58GB - https://huggingface.co/jasperai/Flux.1-dev-Controlnet-Depth/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/jasperai/Flux.1-dev-Controlnet-Depth
     */
    | "jasperai/FLUX.1-dev-Controlnet-Depth"
    /** This is Flux.1-dev ControlNet for Surface Normals map developed by Jasper research team.
     * 3.58GB - https://huggingface.co/jasperai/Flux.1-dev-Controlnet-Surface-Normals/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/jasperai/Flux.1-dev-Controlnet-Surface-Normals
     */
    | "jasperai/Flux.1-dev-Controlnet-Surface-Normals"
    /** This is Flux.1-dev ControlNet for low resolution images developed by Jasper research team.
     * 3.58GB - https://huggingface.co/jasperai/Flux.1-dev-Controlnet-Upscaler/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/jasperai/Flux.1-dev-Controlnet-Upscaler
     */
    | "jasperai/FLUX.1-dev-Controlnet-Upscaler"
    /** This is required for Kolors
     * 12.52GB - https://huggingface.co/Kijai/ChatGLM3-safetensors/resolve/main/chatglm3-fp16.safetensors
     * see https://huggingface.co/Kijai/ChatGLM3-safetensors/tree/main
     */
    | "Kijai/ChatGLM3 (16bit)"
    /** This is required for Kolors
     * 3.92GB - https://huggingface.co/Kijai/ChatGLM3-safetensors/resolve/main/chatglm3-4bit.safetensors
     * see https://huggingface.co/Kijai/ChatGLM3-safetensors/tree/main
     */
    | "Kijai/ChatGLM3 (4bit)"
    /** This is required for Kolors
     * 3.92GB - https://huggingface.co/Kijai/ChatGLM3-safetensors/resolve/main/chatglm3-8bit.safetensors
     * see https://huggingface.co/Kijai/ChatGLM3-safetensors/tree/main
     */
    | "Kijai/ChatGLM3 (8bit)"
    /** DepthAnythingV2 model
     * 195.0MB - https://huggingface.co/Kijai/DepthAnythingV2-safetensors/resolve/main/depth_anything_v2_vitb_fp16.safetensors
     * see https://huggingface.co/Kijai/DepthAnythingV2-safetensors/tree/main
     */
    | "kijai/DepthAnythingV2 (vitb/fp16)"
    /** DepthAnythingV2 model
     * 389.9MB - https://huggingface.co/Kijai/DepthAnythingV2-safetensors/resolve/main/depth_anything_v2_vitb_fp32.safetensors
     * see https://huggingface.co/Kijai/DepthAnythingV2-safetensors/tree/main
     */
    | "kijai/DepthAnythingV2 (vitb/fp32)"
    /** DepthAnythingV2 model
     * 99.2MB - https://huggingface.co/Kijai/DepthAnythingV2-safetensors/resolve/main/depth_anything_v2_vits_fp32.safetensors
     * see https://huggingface.co/Kijai/DepthAnythingV2-safetensors/tree/main
     */
    | "kijai/DepthAnythingV2 (vitb/fp32)"
    /** DepthAnythingV2 model
     * 670.7MB - https://huggingface.co/Kijai/DepthAnythingV2-safetensors/resolve/main/depth_anything_v2_vitl_fp16.safetensors
     * see https://huggingface.co/Kijai/DepthAnythingV2-safetensors/tree/main
     */
    | "kijai/DepthAnythingV2 (vitl/fp16)"
    /** DepthAnythingV2 model
     * 1.34GB - https://huggingface.co/Kijai/DepthAnythingV2-safetensors/resolve/main/depth_anything_v2_vitl_fp32.safetensors
     * see https://huggingface.co/Kijai/DepthAnythingV2-safetensors/tree/main
     */
    | "kijai/DepthAnythingV2 (vitl/fp32)"
    /** DepthAnythingV2 model
     * 49.6MB - https://huggingface.co/Kijai/DepthAnythingV2-safetensors/resolve/main/depth_anything_v2_vits_fp16.safetensors
     * see https://huggingface.co/Kijai/DepthAnythingV2-safetensors/tree/main
     */
    | "kijai/DepthAnythingV2 (vits/fp16)"
    /** FLUX.1 [dev] Diffusion model (float8_e4m3fn)
     * 11.9GB - https://huggingface.co/Kijai/flux-fp8/resolve/main/flux1-dev-fp8.safetensors
     * see https://huggingface.co/Kijai/flux-fp8
     */
    | "kijai/FLUX.1 [dev] Diffusion model (float8_e4m3fn)"
    /** FLUX.1 [Schnell] Diffusion model (float8_e4m3fn)
     * 11.9GB - https://huggingface.co/Kijai/flux-fp8/resolve/main/flux1-schnell-fp8.safetensors
     * see https://huggingface.co/Kijai/flux-fp8
     */
    | "kijai/FLUX.1 [schnell] Diffusion model (float8_e4m3fn)"
    /** lotus depth d model v1.1 (fp16). This model can be used in ComfyUI-Lotus custom nodes.
     * 1.74GB - https://huggingface.co/Kijai/lotus-comfyui/resolve/main/lotus-depth-d-v-1-1-fp16.safetensors
     * see https://huggingface.co/Kijai/lotus-comfyui
     */
    | "kijai/lotus depth d model v1.1 (fp16)"
    /** lotus depth g model v1.0. This model can be used in ComfyUI-Lotus custom nodes.
     * 3.47GB - https://huggingface.co/Kijai/lotus-comfyui/resolve/main/lotus-depth-g-v1-0.safetensors
     * see https://huggingface.co/Kijai/lotus-comfyui
     */
    | "kijai/lotus depth g model v1.0"
    /** lotus depth g model v1.0 (fp16). This model can be used in ComfyUI-Lotus custom nodes.
     * 1.74GB - https://huggingface.co/Kijai/lotus-comfyui/resolve/main/lotus-depth-g-v1-0-fp16.safetensors
     * see https://huggingface.co/Kijai/lotus-comfyui
     */
    | "kijai/lotus depth g model v1.0 (fp16)"
    /** lotus normal d model v1.0. This model can be used in ComfyUI-Lotus custom nodes.
     * 3.47GB - https://huggingface.co/Kijai/lotus-comfyui/resolve/main/lotus-normal-d-v1-0.safetensors
     * see https://huggingface.co/Kijai/lotus-comfyui
     */
    | "kijai/lotus normal d model v1.0"
    /** lotus normal d model v1.0 (fp16). This model can be used in ComfyUI-Lotus custom nodes.
     * 1.74GB - https://huggingface.co/Kijai/lotus-comfyui/resolve/main/lotus-normal-d-v1-0-fp16.safetensors
     * see https://huggingface.co/Kijai/lotus-comfyui
     */
    | "kijai/lotus normal d model v1.0 (fp16)"
    /** lotus normal g model v1.0. This model can be used in ComfyUI-Lotus custom nodes.
     * 3.47GB - https://huggingface.co/Kijai/lotus-comfyui/resolve/main/lotus-normal-g-v1-0.safetensors
     * see https://huggingface.co/Kijai/lotus-comfyui
     */
    | "kijai/lotus normal g model v1.0"
    /** lotus normal g model v1.0 (fp16). This model can be used in ComfyUI-Lotus custom nodes.
     * 1.74GB - https://huggingface.co/Kijai/lotus-comfyui/resolve/main/lotus-normal-g-v1-0-fp16.safetensors
     * see https://huggingface.co/Kijai/lotus-comfyui
     */
    | "kijai/lotus normal g model v1.0 (fp16)"
    /** Safetensors versions of [a/https://github.com/microsoft/MoGe](https://github.com/microsoft/MoGe)
     * 628MB - https://huggingface.co/Kijai/MoGe_safetensors/resolve/main/MoGe_ViT_L_fp16.safetensors
     * see https://huggingface.co/Kijai/MoGe_safetensors
     */
    | "kijai/MoGe_ViT_L_fp16.safetensors"
    /** Safetensors versions of [a/https://github.com/microsoft/MoGe](https://github.com/microsoft/MoGe)
     * 1.26GB - https://huggingface.co/Kijai/MoGe_safetensors/resolve/main/MoGe_ViT_L_fp16.safetensors
     * see https://huggingface.co/Kijai/MoGe_safetensors
     */
    | "kijai/MoGe_ViT_L_fp16.safetensors"
    /** SUPIR checkpoint model
     * 2.66GB - https://huggingface.co/Kijai/SUPIR_pruned/resolve/main/SUPIR-v0F_fp16.safetensors
     * see https://huggingface.co/Kijai/SUPIR_pruned/tree/main
     */
    | "Kijai/SUPIR-v0F_fp16.safetensors (pruned)"
    /** SUPIR checkpoint model
     * 2.66GB - https://huggingface.co/Kijai/SUPIR_pruned/resolve/main/SUPIR-v0Q_fp16.safetensors
     * see https://huggingface.co/Kijai/SUPIR_pruned/tree/main
     */
    | "Kijai/SUPIR-v0Q_fp16.safetensors (pruned)"
    /** ToonCrafter checkpoint model for ComfyUI-DynamiCrafterWrapper
     * 5.25GB - https://huggingface.co/Kijai/DynamiCrafter_pruned/resolve/main/tooncrafter_512_interp-fp16.safetensors
     * see https://huggingface.co/Kijai/DynamiCrafter_pruned
     */
    | "Kijai/ToonCrafter model checkpoint (interpolation fp16)"
    /** kl-f8-anime2 vae model
     * 404.7MB - https://huggingface.co/hakurei/waifu-diffusion-v1-4/resolve/main/vae/kl-f8-anime2.ckpt
     * see https://huggingface.co/hakurei/waifu-diffusion-v1-4
     */
    | "kl-f8-anime2"
    /** Kolors UNet model
     * 10.3GB - https://huggingface.co/Kwai-Kolors/Kolors/resolve/main/unet/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/Kwai-Kolors/Kolors
     */
    | "Kolors UNet model"
    /** Kolors UNet model
     * 5.16GB - https://huggingface.co/Kwai-Kolors/Kolors/resolve/main/unet/diffusion_pytorch_model.fp16.safetensors
     * see https://huggingface.co/Kwai-Kolors/Kolors
     */
    | "Kolors UNet model (fp16)"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 2.39GB - https://huggingface.co/Kwai-Kolors/Kolors-IP-Adapter-FaceID-Plus/resolve/main/ipa-faceid-plus.bin
     * see https://huggingface.co/Kwai-Kolors/Kolors-IP-Adapter-FaceID-Plus
     */
    | "Kolors-IP-Adapter-FaceID-Plus.bin (Kwai-Kolors/Kolors-IP-Adapter-Plus)"
    /** You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.
     * 1.01GB - https://huggingface.co/Kwai-Kolors/Kolors-IP-Adapter-Plus/resolve/main/ip_adapter_plus_general.bin
     * see https://huggingface.co/Kwai-Kolors/Kolors-IP-Adapter-Plus
     */
    | "Kolors-IP-Adapter-Plus.bin (Kwai-Kolors/Kolors-IP-Adapter-Plus)"
    /** Kolors VAE
     * 167MB - https://huggingface.co/Kwai-Kolors/Kolors/resolve/main/vae/diffusion_pytorch_model.fp16.safetensors
     * see https://huggingface.co/Kwai-Kolors/Kolors
     */
    | "kolors/vae/diffusion_pytorch_model.fp16.safetensors"
    /** Kolors VAE
     * 335MB - https://huggingface.co/Kwai-Kolors/Kolors/resolve/main/vae/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/Kwai-Kolors/Kolors
     */
    | "kolors/vae/diffusion_pytorch_model.safetensors"
    /** Latent Consistency LoRA for SD1.5
     * 134.6MB - https://huggingface.co/latent-consistency/lcm-lora-sdv1-5/resolve/main/pytorch_lora_weights.safetensors
     * see https://huggingface.co/latent-consistency/lcm-lora-sdv1-5
     */
    | "LCM LoRA SD1.5"
    /** Latent Consistency LoRA for SDXL
     * 393.9MB - https://huggingface.co/latent-consistency/lcm-lora-sdxl/resolve/main/pytorch_lora_weights.safetensors
     * see https://huggingface.co/latent-consistency/lcm-lora-sdxl
     */
    | "LCM LoRA SDXL"
    /** Latent Consistency LoRA for SSD-1B
     * 210.0MB - https://huggingface.co/latent-consistency/lcm-lora-ssd-1b/resolve/main/pytorch_lora_weights.safetensors
     * see https://huggingface.co/latent-consistency/lcm-lora-ssd-1b
     */
    | "LCM LoRA SSD-1B"
    /** LDSR upscale model. Through the [a/ComfyUI-Flowty-LDSR](https://github.com/flowtyone/ComfyUI-Flowty-LDSR) extension, the upscale model can be utilized.
     * 2.04GB - https://heibox.uni-heidelberg.de/f/578df07c8fc04ffbadf3/?dl=1
     * see https://github.com/CompVis/latent-diffusion
     */
    | "LDSR(Latent Diffusion Super Resolution)"
    /** AnimateDiff-PIA Model
     * 1.67GB - https://huggingface.co/Leoxing/PIA/resolve/main/pia.ckpt
     * see https://huggingface.co/Leoxing/PIA/tree/main
     */
    | "Leoxing/pia.ckpt"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.83GB - https://huggingface.co/Lightricks/LongAnimateDiff/resolve/main/lt_long_mm_16_64_frames_v1.1.ckpt
     * see https://huggingface.co/Lightricks/LongAnimateDiff
     */
    | "LongAnimatediff/lt_long_mm_16_64_frames_v1.1.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.83GB - https://huggingface.co/Lightricks/LongAnimateDiff/resolve/main/lt_long_mm_16_64_frames.ckpt
     * see https://huggingface.co/Lightricks/LongAnimateDiff
     */
    | "LongAnimatediff/lt_long_mm_16_64_frames.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** Pressing 'install' directly downloads the model from the Kosinkadink/ComfyUI-AnimateDiff-Evolved extension node.
     * 1.82GB - https://huggingface.co/Lightricks/LongAnimateDiff/resolve/main/lt_long_mm_32_frames.ckpt
     * see https://huggingface.co/Lightricks/LongAnimateDiff
     */
    | "LongAnimatediff/lt_long_mm_32_frames.ckpt (ComfyUI-AnimateDiff-Evolved) (Updated path)"
    /** LTX-Video is the first DiT-based video generation model capable of generating high-quality videos in real-time. It produces 24 FPS videos at a 768x512 resolution faster than they can be watched. Trained on a large-scale dataset of diverse videos, the model generates high-resolution videos with realistic and varied content.
     * 9.37GB - https://huggingface.co/Lightricks/LTX-Video/resolve/main/ltx-video-2b-v0.9.safetensors
     * see https://huggingface.co/Lightricks/LTX-Video
     */
    | "LTX-Video 2B v0.9 Checkpoint"
    /** LTX-Video is the first DiT-based video generation model capable of generating high-quality videos in real-time. It produces 24 FPS videos at a 768x512 resolution faster than they can be watched. Trained on a large-scale dataset of diverse videos, the model generates high-resolution videos with realistic and varied content.
     * 5.72GB - https://huggingface.co/Lightricks/LTX-Video/resolve/main/ltx-video-2b-v0.9.1.safetensors
     * see https://huggingface.co/Lightricks/LTX-Video
     */
    | "LTX-Video 2B v0.9.1 Checkpoint"
    /** LTX-Video is the first DiT-based video generation model capable of generating high-quality videos in real-time. It produces 24 FPS videos at a 768x512 resolution faster than they can be watched. Trained on a large-scale dataset of diverse videos, the model generates high-resolution videos with realistic and varied content.
     * 6.34GB - https://huggingface.co/Lightricks/LTX-Video/resolve/main/ltx-video-2b-v0.9.5.safetensors
     * see https://huggingface.co/Lightricks/LTX-Video
     */
    | "LTX-Video 2B v0.9.5 Checkpoint"
    /** Cosmos 1.0 Text2World Diffusion Model (14B)
     * 28.5GB - https://huggingface.co/mcmonkey/cosmos-1.0/resolve/main/Cosmos-1_0-Diffusion-14B-Text2World.safetensors
     * see https://huggingface.co/mcmonkey/cosmos-1.0
     */
    | "mcmonkey/Cosmos-1_0-Diffusion-14B-Text2World.safetensors"
    /** Cosmos 1.0 Video2World Diffusion Model (14B)
     * 28.5GB - https://huggingface.co/mcmonkey/cosmos-1.0/resolve/main/Cosmos-1_0-Diffusion-14B-Video2World.safetensors
     * see https://huggingface.co/mcmonkey/cosmos-1.0
     */
    | "mcmonkey/Cosmos-1_0-Diffusion-14B-Video2World.safetensors"
    /** Cosmos 1.0 Text2World Diffusion Model (7B)
     * 14.5GB - https://huggingface.co/mcmonkey/cosmos-1.0/resolve/main/Cosmos-1_0-Diffusion-7B-Text2World.safetensors
     * see https://huggingface.co/mcmonkey/cosmos-1.0
     */
    | "mcmonkey/Cosmos-1_0-Diffusion-7B-Text2World.safetensors"
    /** Cosmos 1.0 Video2World Diffusion Model (7B)
     * 14.5GB - https://huggingface.co/mcmonkey/cosmos-1.0/resolve/main/Cosmos-1_0-Diffusion-7B-Video2World.safetensors
     * see https://huggingface.co/mcmonkey/cosmos-1.0
     */
    | "mcmonkey/Cosmos-1_0-Diffusion-7B-Video2World.safetensors"
    /** MobileSAM
     * 38.8MB - https://github.com/ChaoningZhang/MobileSAM/blob/master/weights/mobile_sam.pt
     * see https://github.com/ChaoningZhang/MobileSAM/
     */
    | "MobileSAM"
    /** monster-labs - Controlnet QR Code Monster v1 For SDXL
     * 5.00GB - https://huggingface.co/monster-labs/control_v1p_sdxl_qrcode_monster/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/monster-labs/control_v1p_sdxl_qrcode_monster
     */
    | "monster-labs - Controlnet QR Code Monster v1 For SDXL"
    /** MonsterMMORPG insightface model for cubiq/InstantID
     * 360.7MB - https://huggingface.co/MonsterMMORPG/tools/resolve/main/antelopev2.zip
     * see https://huggingface.co/MonsterMMORPG/tools/tree/main
     */
    | "MonsterMMORPG/insightface (for InstantID)"
    /** If you use this embedding with negatives, you can solve the issue of damaging your hands.
     * 25KB - https://civitai.com/api/download/models/60938
     * see https://civitai.com/models/56519/negativehand-negative-embedding
     */
    | "negative_hand Negative Embedding"
    /** OpenAI Consistency Decoder. Improved decoding for stable diffusion vaes.
     * 2.49GB - https://openaipublic.azureedge.net/diff-vae/c9cebd3132dd9c42936d803e33424145a748843c8f716c0814838bdc8a2fe7cb/decoder.pt
     * see https://github.com/openai/consistencydecoder
     */
    | "OpenAI Consistency Decoder"
    /** orangemix vae model
     * 822.8MB - https://huggingface.co/WarriorMama777/OrangeMixs/resolve/main/VAEs/orangemix.vae.pt
     * see https://huggingface.co/WarriorMama777/OrangeMixs
     */
    | "orangemix.vae"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 54.8MB - https://huggingface.co/Bingsu/adetailer/resolve/main/person_yolov8m-seg.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "person_yolov8m (segm)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 6.78MB - https://huggingface.co/Bingsu/adetailer/resolve/main/person_yolov8n-seg.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "person_yolov8n (segm)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 23.9MB - https://huggingface.co/Bingsu/adetailer/resolve/main/person_yolov8s-seg.pt
     * see https://huggingface.co/Bingsu/adetailer/tree/main
     */
    | "person_yolov8s (segm)"
    /** PhotoMaker model. This model is compatible with SDXL.
     * 934.1MB - https://huggingface.co/TencentARC/PhotoMaker/resolve/main/photomaker-v1.bin
     * see https://huggingface.co/TencentARC/PhotoMaker
     */
    | "photomaker-v1.bin"
    /** PhotoMaker model. This model is compatible with SDXL.
     * 1.8GB - https://huggingface.co/TencentARC/PhotoMaker-V2/resolve/main/photomaker-v2.bin
     * see https://huggingface.co/TencentARC/PhotoMaker-V2
     */
    | "photomaker-v2.bin"
    /** PixArt-Sigma Checkpoint model
     * 2.47GB - https://huggingface.co/PixArt-alpha/PixArt-Sigma/resolve/main/PixArt-Sigma-XL-2-1024-MS.pth
     * see https://huggingface.co/PixArt-alpha/PixArt-Sigma/tree/main
     */
    | "PixArt-Sigma-XL-2-1024-MS.pth (checkpoint)"
    /** PixArt-Sigma Diffusion model
     * 2.44GB - https://huggingface.co/PixArt-alpha/PixArt-Sigma-XL-2-1024-MS/resolve/main/transformer/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/PixArt-alpha/PixArt-Sigma-XL-2-1024-MS
     */
    | "PixArt-Sigma-XL-2-1024-MS.safetensors (diffusion)"
    /** PixArt-Sigma Diffusion model
     * 2.44GB - https://huggingface.co/PixArt-alpha/PixArt-Sigma-XL-2-512-MS/resolve/main/transformer/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/PixArt-alpha/PixArt-Sigma-XL-2-512-MS
     */
    | "PixArt-Sigma-XL-2-512-MS.safetensors (diffusion)"
    /** PixArt-Alpha Diffusion model
     * 2.45GB - https://huggingface.co/PixArt-alpha/PixArt-XL-2-1024-MS/resolve/main/transformer/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/PixArt-alpha/PixArt-XL-2-1024-MS
     */
    | "PixArt-XL-2-1024-MS.safetensors (diffusion)"
    /** This is required for PuLID (FLUX)
     * 1.14GB - https://huggingface.co/guozinan/PuLID/resolve/main/pulid_flux_v0.9.1.safetensors
     * see https://huggingface.co/guozinan/PuLID
     */
    | "pulid_flux_v0.9.1.safetensors"
    /** This is required for PuLID (SDXL)
     * 984MB - https://huggingface.co/guozinan/PuLID/resolve/main/pulid_v1.1.safetensors
     * see https://huggingface.co/guozinan/PuLID
     */
    | "pulid_v1.1.safetensors"
    /** RAM Recognize Anything Model
     * 5.63GB - https://huggingface.co/xinyu1205/recognize_anything_model/resolve/main/ram_swin_large_14m.pth
     * see https://huggingface.co/xinyu1205/recognize_anything_model
     */
    | "RAM"
    /** RAM++ Recognize Anything Model
     * 3.01GB - https://huggingface.co/xinyu1205/recognize-anything-plus-model/resolve/main/ram_plus_swin_large_14m.pth
     * see https://huggingface.co/xinyu1205/recognize-anything-plus-model
     */
    | "RAM++"
    /** RealESRGAN x2 upscaler model
     * 67.1MB - https://huggingface.co/ai-forever/Real-ESRGAN/resolve/main/RealESRGAN_x2.pth
     * see https://huggingface.co/ai-forever/Real-ESRGAN
     */
    | "RealESRGAN x2"
    /** RealESRGAN x4 upscaler model
     * 67.0MB - https://huggingface.co/ai-forever/Real-ESRGAN/resolve/main/RealESRGAN_x4.pth
     * see https://huggingface.co/ai-forever/Real-ESRGAN
     */
    | "RealESRGAN x4"
    /** Face restoration
     * 290.8MB - https://github.com/TencentARC/GFPGAN/releases/download/v1.3.4/RestoreFormer.pth
     * see https://github.com/TencentARC/GFPGAN
     */
    | "RestoreFormer"
    /** Antelopev2 scrfd_10g_bnkps.onnx model for InstantId. (InstantId needs all Antelopev2 models)
     * 16.9MB - https://huggingface.co/MonsterMMORPG/tools/resolve/main/scrfd_10g_bnkps.onnx
     * see https://github.com/cubiq/ComfyUI_InstantID#installation
     */
    | "scrfd_10g_bnkps.onnx"
    /** Stable Diffusion XL base model (VAE 0.9)
     * 6.94GB - https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0_0.9vae.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
     */
    | "sd_xl_base_1.0_0.9vae.safetensors"
    /** Stable Diffusion XL base model
     * 6.94GB - https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
     */
    | "sd_xl_base_1.0.safetensors"
    /** Stable Diffusion XL offset LoRA
     * 49.6MB - https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_offset_example-lora_1.0.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
     */
    | "sd_xl_offset_example-lora_1.0.safetensors"
    /** Stable Diffusion XL refiner model (VAE 0.9)
     * 6.08GB - https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0/resolve/main/sd_xl_refiner_1.0_0.9vae.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0
     */
    | "sd_xl_refiner_1.0_0.9vae.safetensors"
    /** SDXL Lightning LoRA (2steps)
     * 393.9MB - https://huggingface.co/ByteDance/SDXL-Lightning/resolve/main/sdxl_lightning_2step_lora.safetensors
     * see https://huggingface.co/ByteDance/SDXL-Lightning
     */
    | "SDXL Lightning LoRA (2steps)"
    /** SDXL Lightning LoRA (4steps)
     * 393.9MB - https://huggingface.co/ByteDance/SDXL-Lightning/resolve/main/sdxl_lightning_4step_lora.safetensors
     * see https://huggingface.co/ByteDance/SDXL-Lightning
     */
    | "SDXL Lightning LoRA (4steps)"
    /** SDXL Lightning LoRA (8steps)
     * 393.9MB - https://huggingface.co/ByteDance/SDXL-Lightning/resolve/main/sdxl_lightning_8step_lora.safetensors
     * see https://huggingface.co/ByteDance/SDXL-Lightning
     */
    | "SDXL Lightning LoRA (8steps)"
    /** SDXL-VAE
     * 334.6MB - https://huggingface.co/stabilityai/sdxl-vae/resolve/main/sdxl_vae.safetensors
     * see https://huggingface.co/stabilityai/sdxl-vae
     */
    | "sdxl_vae.safetensors"
    /** ControlNet openpose model for SDXL
     * 5.00GB - https://huggingface.co/thibaud/controlnet-openpose-sdxl-1.0/resolve/main/OpenPoseXL2.safetensors
     * see https://huggingface.co/thibaud/controlnet-openpose-sdxl-1.0
     */
    | "SDXL-controlnet: OpenPose (v2)"
    /** SDXL-Turbo 1.0
     * 13.9GB - https://huggingface.co/stabilityai/sdxl-turbo/resolve/main/sd_xl_turbo_1.0.safetensors
     * see https://huggingface.co/stabilityai/sdxl-turbo
     */
    | "SDXL-Turbo 1.0"
    /** SDXL-Turbo 1.0 fp16
     * 6.94GB - https://huggingface.co/stabilityai/sdxl-turbo/resolve/main/sd_xl_turbo_1.0_fp16.safetensors
     * see https://huggingface.co/stabilityai/sdxl-turbo
     */
    | "SDXL-Turbo 1.0 (fp16)"
    /** SeeCoder model
     * 1.18GB - https://huggingface.co/shi-labs/prompt-free-diffusion/resolve/main/pretrained/pfd/seecoder/seecoder-anime-v1-0.safetensors
     * see https://huggingface.co/shi-labs/prompt-free-diffusion/tree/main/pretrained/pfd/seecoder
     */
    | "seecoder anime v1.0"
    /** SeeCoder model
     * 1.19GB - https://huggingface.co/shi-labs/prompt-free-diffusion/resolve/main/pretrained/pfd/seecoder/seecoder-pa-v1-0.safetensors
     * see https://huggingface.co/shi-labs/prompt-free-diffusion/tree/main/pretrained/pfd/seecoder
     */
    | "seecoder pa v1.0"
    /** SeeCoder model
     * 1.18GB - https://huggingface.co/shi-labs/prompt-free-diffusion/resolve/main/pretrained/pfd/seecoder/seecoder-v1-0.safetensors
     * see https://huggingface.co/shi-labs/prompt-free-diffusion/tree/main/pretrained/pfd/seecoder
     */
    | "seecoder v1.0"
    /** The Segmind-Vega Model is a distilled version of the Stable Diffusion XL (SDXL), offering a remarkable 70% reduction in size and an impressive 100% speedup while retaining high-quality text-to-image generation capabilities.
     * 3.29GB - https://huggingface.co/segmind/Segmind-Vega/resolve/main/segmind-vega.safetensors
     * see https://huggingface.co/segmind/Segmind-Vega
     */
    | "Segmind-Vega"
    /** Segmind-VegaRT a distilled consistency adapter for Segmind-Vega that allows to reduce the number of inference steps to only between 2 - 8 steps.
     * 239.2MB - https://huggingface.co/segmind/Segmind-VegaRT/resolve/main/pytorch_lora_weights.safetensors
     * see https://huggingface.co/segmind/Segmind-VegaRT
     */
    | "Segmind-VegaRT - Latent Consistency Model (LCM) LoRA of Segmind-Vega"
    /** FLUX.1 [Dev] Union Controlnet. Supports Canny, Tile, Depth, Blur, Pose, Gray, Low Quality
     * 6.6GB - https://huggingface.co/Shakker-Labs/FLUX.1-dev-ControlNet-Union-Pro/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/Shakker-Labs/FLUX.1-dev-ControlNet-Union-Pro
     */
    | "Shakker-Labs/FLUX.1-dev-ControlNet-Union-Pro"
    /** FLUX.1 [Dev] Union Controlnet. Supports Canny, Tile, Depth, Blur, Pose, Gray, Low Quality
Version quantized to fp8_e4m3fn by Kijai
     * 3.3GB - https://huggingface.co/Kijai/flux-fp8/resolve/main/flux_shakker_labs_union_pro-fp8_e4m3fn.safetensors
     * see https://huggingface.co/Kijai/flux-fp8
     */
    | "Shakker-Labs/FLUX.1-dev-ControlNet-Union-Pro (fp8_e4m3fn) by Kijai"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 54.9MB - https://github.com/hben35096/assets/releases/download/yolo8/skin_yolov8m-seg_400.pt
     * see https://github.com/hben35096/assets/releases/tag/yolo8
     */
    | "skin_yolov8m-seg_400.pt (segm)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 6.83MB - https://github.com/hben35096/assets/releases/download/yolo8/skin_yolov8n-seg_400.pt
     * see https://github.com/hben35096/assets/releases/tag/yolo8
     */
    | "skin_yolov8n-seg_400.pt (segm)"
    /** These are the available models in the UltralyticsDetectorProvider of Impact Pack.
     * 6.84MB - https://github.com/hben35096/assets/releases/download/yolo8/skin_yolov8n-seg_800.pt
     * see https://github.com/hben35096/assets/releases/tag/yolo8
     */
    | "skin_yolov8n-seg_800.pt (segm)"
    /** Stable Cascade stage_b checkpoints
     * 4.55GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/comfyui_checkpoints/stable_cascade_stage_b.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/comfyui_checkpoints/stable_cascade_stage_b.safetensors"
    /** Stable Cascade stage_c checkpoints
     * 9.22GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/comfyui_checkpoints/stable_cascade_stage_c.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/comfyui_checkpoints/stable_cascade_stage_c.safetensors"
    /** Control-LoRA: canny rank128
     * 395.7MB - https://huggingface.co/stabilityai/control-lora/resolve/main/control-LoRAs-rank128/control-lora-canny-rank128.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "stabilityai/control-lora-canny-rank128.safetensors"
    /** Control-LoRA: canny rank256
     * 774.5MB - https://huggingface.co/stabilityai/control-lora/resolve/main/control-LoRAs-rank256/control-lora-canny-rank256.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "stabilityai/control-lora-canny-rank256.safetensors"
    /** Control-LoRA: depth rank128
     * 395.7MB - https://huggingface.co/stabilityai/control-lora/resolve/main/control-LoRAs-rank128/control-lora-depth-rank128.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "stabilityai/control-lora-depth-rank128.safetensors"
    /** Control-LoRA: depth rank256
     * 774.4MB - https://huggingface.co/stabilityai/control-lora/resolve/main/control-LoRAs-rank256/control-lora-depth-rank256.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "stabilityai/control-lora-depth-rank256.safetensors"
    /** Control-LoRA: recolor rank128
     * 395.7MB - https://huggingface.co/stabilityai/control-lora/resolve/main/control-LoRAs-rank128/control-lora-recolor-rank128.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "stabilityai/control-lora-recolor-rank128.safetensors"
    /** Control-LoRA: recolor rank256
     * 774.4MB - https://huggingface.co/stabilityai/control-lora/resolve/main/control-LoRAs-rank256/control-lora-recolor-rank256.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "stabilityai/control-lora-recolor-rank256.safetensors"
    /** Control-LoRA: sketch rank128 metadata
     * 395.7MB - https://huggingface.co/stabilityai/control-lora/resolve/main/control-LoRAs-rank128/control-lora-sketch-rank128-metadata.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "stabilityai/control-lora-sketch-rank128-metadata.safetensors"
    /** Control-LoRA: sketch rank256
     * 774.5MB - https://huggingface.co/stabilityai/control-lora/resolve/main/control-LoRAs-rank256/control-lora-sketch-rank256.safetensors
     * see https://huggingface.co/stabilityai/control-lora
     */
    | "stabilityai/control-lora-sketch-rank256.safetensors"
    /** Blur Controlnet model for SD3.5 Large
     * 8.65GB - https://huggingface.co/stabilityai/stable-diffusion-3.5-controlnets/resolve/main/sd3.5_large_controlnet_blur.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-3.5-controlnets
     */
    | "stabilityai/SD3.5-Large-Controlnet-Blur"
    /** Canny Controlnet model for SD3.5 Large
     * 8.65GB - https://huggingface.co/stabilityai/stable-diffusion-3.5-controlnets/resolve/main/sd3.5_large_controlnet_canny.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-3.5-controlnets
     */
    | "stabilityai/SD3.5-Large-Controlnet-Canny"
    /** Depth Controlnet model for SD3.5 Large
     * 8.65GB - https://huggingface.co/stabilityai/stable-diffusion-3.5-controlnets/resolve/main/sd3.5_large_controlnet_depth.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-3.5-controlnets
     */
    | "stabilityai/SD3.5-Large-Controlnet-Depth"
    /** Stable Cascade: effnet_encoder.
VAE encoder for stage_c latent.
     * 81.5MB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/effnet_encoder.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: effnet_encoder.safetensors (VAE)"
    /** Stable Cascade: stage_a
     * 73.7MB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_a.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_a.safetensors (VAE)"
    /** Stable Cascade: stage_b/bf16
     * 3.13GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_b_bf16.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_b_bf16.safetensors (UNET)"
    /** Stable Cascade: stage_b/lite
     * 2.80GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_b_lite.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_b_lite.safetensors (UNET)"
    /** Stable Cascade: stage_b/bf16,lite
     * 1.40GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_b_lite_bf16.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_b_lite.safetensors (UNET)"
    /** Stable Cascade: stage_b
     * 6.25GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_b.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_b.safetensors (UNET)"
    /** Stable Cascade: stage_c/bf16
     * 7.18GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_c_bf16.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_c_bf16.safetensors (UNET)"
    /** Stable Cascade: stage_c/lite
     * 4.12GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_c_lite.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_c_lite.safetensors (UNET)"
    /** Stable Cascade: stage_c/bf16,lite
     * 2.06GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_c_lite_bf16.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_c_lite.safetensors (UNET)"
    /** Stable Cascade: stage_c
     * 14.4GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/stage_c.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: stage_c.safetensors (UNET)"
    /** Stable Cascade: text_encoder
     * 1.39GB - https://huggingface.co/stabilityai/stable-cascade/resolve/main/text_encoder/model.safetensors
     * see https://huggingface.co/stabilityai/stable-cascade
     */
    | "stabilityai/Stable Cascade: text_encoder (CLIP)"
    /** Stable Zero123 is a model for view-conditioned image generation based on [a/Zero123](https://github.com/cvlab-columbia/zero123).
     * 8.58GB - https://huggingface.co/stabilityai/stable-zero123/resolve/main/stable_zero123.ckpt
     * see https://huggingface.co/stabilityai/stable-zero123
     */
    | "stabilityai/Stable Zero123"
    /** This upscaling model is a latent text-guided diffusion model and should be used with SD_4XUpscale_Conditioning and KSampler.
     * 3.53GB - https://huggingface.co/stabilityai/stable-diffusion-x4-upscaler/resolve/main/x4-upscaler-ema.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-x4-upscaler
     */
    | "stabilityai/stable-diffusion-x4-upscaler"
    /** Stable Video Diffusion (SVD) Image-to-Video is a diffusion model that takes in a still image as a conditioning frame, and generates a video from it.
NOTE: 14 frames @ 576x1024
     * 9.56GB - https://huggingface.co/stabilityai/stable-video-diffusion-img2vid/resolve/main/svd.safetensors
     * see https://huggingface.co/stabilityai/stable-video-diffusion-img2vid
     */
    | "Stable Video Diffusion Image-to-Video"
    /** Stable Video Diffusion (SVD) Image-to-Video is a diffusion model that takes in a still image as a conditioning frame, and generates a video from it.
NOTE: 25 frames @ 576x1024 
     * 9.56GB - https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt/resolve/main/svd_xt.safetensors
     * see https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt
     */
    | "Stable Video Diffusion Image-to-Video (XT)"
    /** Stable Diffusion XL refiner model
     * 6.08GB - https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0/resolve/main/sd_xl_refiner_1.0.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0
     */
    | "stable-diffusion-xl-refiner-1.0"
    /** SUPIR checkpoint model
     * 5.33GB - https://huggingface.co/camenduru/SUPIR/resolve/main/SUPIR-v0F.ckpt
     * see https://huggingface.co/camenduru/SUPIR/tree/main
     */
    | "SUPIR-v0F.ckpt"
    /** SUPIR checkpoint model
     * 5.33GB - https://huggingface.co/camenduru/SUPIR/resolve/main/SUPIR-v0Q.ckpt
     * see https://huggingface.co/camenduru/SUPIR/tree/main
     */
    | "SUPIR-v0Q.ckpt"
    /** ControlNet T2I-Adapter for canny
     * 308.0MB - https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_canny_sd14v1.pth
     * see https://huggingface.co/TencentARC/T2I-Adapter
     */
    | "T2I-Adapter (canny)"
    /** ControlNet T2I-Adapter for color
     * 74.8MB - https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_color_sd14v1.pth
     * see https://huggingface.co/TencentARC/T2I-Adapter
     */
    | "T2I-Adapter (color)"
    /** ControlNet T2I-Adapter for depth
     * 309.5MB - https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_depth_sd14v1.pth
     * see https://huggingface.co/TencentARC/T2I-Adapter
     */
    | "T2I-Adapter (depth)"
    /** ControlNet T2I-Adapter for keypose
     * 309.5MB - https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_keypose_sd14v1.pth
     * see https://huggingface.co/TencentARC/T2I-Adapter
     */
    | "T2I-Adapter (keypose)"
    /** ControlNet T2I-Adapter for openpose
     * 309.5MB - https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_openpose_sd14v1.pth
     * see https://huggingface.co/TencentARC/T2I-Adapter
     */
    | "T2I-Adapter (openpose)"
    /** ControlNet T2I-Adapter for seg
     * 309.5MB - https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_seg_sd14v1.pth
     * see https://huggingface.co/TencentARC/T2I-Adapter
     */
    | "T2I-Adapter (seg)"
    /** ControlNet T2I-Adapter for sketch
     * 308.0MB - https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_sketch_sd14v1.pth
     * see https://huggingface.co/TencentARC/T2I-Adapter
     */
    | "T2I-Adapter (sketch)"
    /** ControlNet T2I-Adapter XL for canny
     * 316.1MB - https://huggingface.co/TencentARC/t2i-adapter-canny-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-canny-sdxl-1.0
     */
    | "T2I-Adapter XL (canny)"
    /** ControlNet T2I-Adapter XL for canny
     * 158.1MB - https://huggingface.co/TencentARC/t2i-adapter-canny-sdxl-1.0/resolve/main/diffusion_pytorch_model.fp16.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-canny-sdxl-1.0
     */
    | "T2I-Adapter XL (canny) FP16"
    /** ControlNet T2I-Adapter XL for depth-midas
     * 316.1MB - https://huggingface.co/TencentARC/t2i-adapter-depth-midas-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-depth-midas-sdxl-1.0
     */
    | "T2I-Adapter XL (depth-midas)"
    /** ControlNet T2I-Adapter XL for depth-midas
     * 158.1MB - https://huggingface.co/TencentARC/t2i-adapter-depth-midas-sdxl-1.0/resolve/main/diffusion_pytorch_model.fp16.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-depth-midas-sdxl-1.0
     */
    | "T2I-Adapter XL (depth-midas) FP16"
    /** ControlNet T2I-Adapter XL for depth-zoe
     * 316.1MB - https://huggingface.co/TencentARC/t2i-adapter-depth-zoe-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-depth-zoe-sdxl-1.0
     */
    | "T2I-Adapter XL (depth-zoe)"
    /** ControlNet T2I-Adapter XL for depth-zoe
     * 158.1MB - https://huggingface.co/TencentARC/t2i-adapter-depth-zoe-sdxl-1.0/resolve/main/diffusion_pytorch_model.fp16.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-depth-zoe-sdxl-1.0
     */
    | "T2I-Adapter XL (depth-zoe) FP16"
    /** ControlNet T2I-Adapter XL for lineart
     * 316.1MB - https://huggingface.co/TencentARC/t2i-adapter-lineart-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-lineart-sdxl-1.0
     */
    | "T2I-Adapter XL (lineart)"
    /** ControlNet T2I-Adapter XL for lineart
     * 158.1MB - https://huggingface.co/TencentARC/t2i-adapter-lineart-sdxl-1.0/resolve/main/diffusion_pytorch_model.fp16.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-lineart-sdxl-1.0
     */
    | "T2I-Adapter XL (lineart) FP16"
    /** ControlNet T2I-Adapter XL for openpose
     * 316.1MB - https://huggingface.co/TencentARC/t2i-adapter-openpose-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-openpose-sdxl-1.0
     */
    | "T2I-Adapter XL (openpose)"
    /** ControlNet T2I-Adapter XL for sketch
     * 316.1MB - https://huggingface.co/TencentARC/t2i-adapter-sketch-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-sketch-sdxl-1.0
     */
    | "T2I-Adapter XL (sketch)"
    /** ControlNet T2I-Adapter XL for sketch
     * 158.1MB - https://huggingface.co/TencentARC/t2i-adapter-sketch-sdxl-1.0/resolve/main/diffusion_pytorch_model.fp16.safetensors
     * see https://huggingface.co/TencentARC/t2i-adapter-sketch-sdxl-1.0
     */
    | "T2I-Adapter XL (sketch) FP16"
    /** ControlNet T2I-Adapter style model. Need to download CLIPVision model.
     * 154.4MB - https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_style_sd14v1.pth
     * see https://huggingface.co/TencentARC/T2I-Adapter
     */
    | "T2I-Style model"
    /** (FLUX.1 Verison) To view the preview in high quality while running samples in ComfyUI, you will need this model.
     * 4.71MB - https://github.com/madebyollin/taesd/raw/main/taef1_decoder.pth
     * see https://github.com/madebyollin/taesd
     */
    | "TAEF1 Decoder"
    /** (FLUX.1 Verison) To view the preview in high quality while running samples in ComfyUI, you will need this model.
     * 4.71MB - https://github.com/madebyollin/taesd/raw/main/taef1_encoder.pth
     * see https://github.com/madebyollin/taesd
     */
    | "TAEF1 Encoder"
    /** To view the preview in high quality while running samples in ComfyUI, you will need this model.
     * 4.91MB - https://github.com/madebyollin/taesd/raw/main/taesd_decoder.pth
     * see https://github.com/madebyollin/taesd
     */
    | "TAESD Decoder"
    /** To view the preview in high quality while running samples in ComfyUI, you will need this model.
     * 4.91MB - https://github.com/madebyollin/taesd/raw/main/taesd_encoder.pth
     * see https://github.com/madebyollin/taesd
     */
    | "TAESD Encoder"
    /** (SD3 Verison) To view the preview in high quality while running samples in ComfyUI, you will need this model.
     * 4.94MB - https://github.com/madebyollin/taesd/raw/main/taesd3_decoder.pth
     * see https://github.com/madebyollin/taesd
     */
    | "TAESD3 Decoder"
    /** (SD3 Verison) To view the preview in high quality while running samples in ComfyUI, you will need this model.
     * 4.94MB - https://github.com/madebyollin/taesd/raw/main/taesd3_encoder.pth
     * see https://github.com/madebyollin/taesd
     */
    | "TAESD3 Encoder"
    /** (SDXL Verison) To view the preview in high quality while running samples in ComfyUI, you will need this model.
     * 4.91MB - https://github.com/madebyollin/taesd/raw/main/taesdxl_decoder.pth
     * see https://github.com/madebyollin/taesd
     */
    | "TAESDXL Decoder"
    /** (SDXL Verison) To view the preview in high quality while running samples in ComfyUI, you will need this model.
     * 4.91MB - https://github.com/madebyollin/taesd/raw/main/taesdxl_encoder.pth
     * see https://github.com/madebyollin/taesd
     */
    | "TAESDXL Encoder"
    /** tag2text Recognize Anything Model
     * 4.48GB - https://huggingface.co/xinyu1205/recognize_anything_model/resolve/main/tag2text_swin_14m.pth
     * see https://huggingface.co/xinyu1205/recognize_anything_model
     */
    | "tag2text"
    /** <3 stuff
     * undefined - https://huggingface.co/briaai/RMBG-1.4/resolve/main/model.pth?download=true
     * see https://huggingface.co/briaai/RMBG-1.4
     */
    | "TEMP_briaai_RMBG-1.4"
    /** CustomNet Inpaint pretrained model for ComfyUI_CustomNet
     * 5.71GB - https://huggingface.co/TencentARC/CustomNet/resolve/main/customnet_inpaint_v1.pt
     * see https://huggingface.co/TencentARC/CustomNet/tree/main
     */
    | "TencentARC/CustomNet Inpaint V1"
    /** CustomNet pretrained model for ComfyUI_CustomNet
     * 5.71GB - https://huggingface.co/TencentARC/CustomNet/resolve/main/customnet_v1.pt
     * see https://huggingface.co/TencentARC/CustomNet/tree/main
     */
    | "TencentARC/CustomNet V1"
    /** To use the ComfyUI-MotionCtrl extension, downloading this model is required.
     * 4.02GB - https://huggingface.co/TencentARC/MotionCtrl/resolve/main/motionctrl.pth
     * see https://huggingface.co/TencentARC/MotionCtrl
     */
    | "TencentARC/motionctrl.pth"
    /** LORA: Theovercomer8's Contrast Fix (SD1.5)
     * 113MB - https://civitai.com/api/download/models/10638
     * see https://civitai.com/models/8765/theovercomer8s-contrast-fix-sd15sd21-768
     */
    | "Theovercomer8's Contrast Fix (SD1.5)"
    /** LORA: Theovercomer8's Contrast Fix (SD2.1)
     * 163MB - https://civitai.com/api/download/models/10350
     * see https://civitai.com/models/8765/theovercomer8s-contrast-fix-sd15sd21-768
     */
    | "Theovercomer8's Contrast Fix (SD2.1)"
    /** Controlnet SDXL Tile model realistic version.
     * 2.50GB - https://huggingface.co/TTPlanet/TTPLanet_SDXL_Controlnet_Tile_Realistic/resolve/main/TTPLANET_Controlnet_Tile_realistic_v2_fp16.safetensors
     * see https://huggingface.co/TTPlanet/TTPLanet_SDXL_Controlnet_Tile_Realistic
     */
    | "TTPlanet/TTPLanet_SDXL_Controlnet_Tile_Realistic v2 (fp16)"
    /** Controlnet SDXL Tile model realistic version.
     * 774.4MB - https://huggingface.co/TTPlanet/TTPLanet_SDXL_Controlnet_Tile_Realistic/resolve/main/TTPLANET_Controlnet_Tile_realistic_v2_rank256.safetensors
     * see https://huggingface.co/TTPlanet/TTPLanet_SDXL_Controlnet_Tile_Realistic
     */
    | "TTPlanet/TTPLanet_SDXL_Controlnet_Tile_Realistic v2 (rank256)"
    /** Stable Diffusion 1.5 base model
     * 4.27GB - https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.ckpt
     * see https://huggingface.co/runwayml/stable-diffusion-v1-5
     */
    | "v1-5-pruned-emaonly.ckpt"
    /** Stable Diffusion 2 base model (512)
     * 5.21GB - https://huggingface.co/stabilityai/stable-diffusion-2-1-base/resolve/main/v2-1_512-ema-pruned.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-2-1-base
     */
    | "v2-1_512-ema-pruned.safetensors"
    /** Stable Diffusion 2 base model (768)
     * 5.21GB - https://huggingface.co/stabilityai/stable-diffusion-2-1/resolve/main/v2-1_768-ema-pruned.safetensors
     * see https://huggingface.co/stabilityai/stable-diffusion-2-1
     */
    | "v2-1_768-ema-pruned.safetensors"
    /** vae-ft-mse-840000-ema-pruned
     * 334.6MB - https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors
     * see https://huggingface.co/stabilityai/sd-vae-ft-mse-original
     */
    | "vae-ft-mse-840000-ema-pruned"
    /** RGT_S x2 upscale model for ComfyUI-RGT
     * 135.4MB - https://huggingface.co/ViperYX/RGT/resolve/main/RGT_S/RGT_S_x2.pth
     * see https://huggingface.co/ViperYX/RGT/tree/main
     */
    | "ViperYX/RGT_S_x2.pth"
    /** RGT_S x3 upscale model for ComfyUI-RGT
     * 136.1MB - https://huggingface.co/ViperYX/RGT/resolve/main/RGT_S/RGT_S_x3.pth
     * see https://huggingface.co/ViperYX/RGT/tree/main
     */
    | "ViperYX/RGT_S_x3.pth"
    /** RGT_S x4 upscale model for ComfyUI-RGT
     * 136.0MB - https://huggingface.co/ViperYX/RGT/resolve/main/RGT_S/RGT_S_x4.pth
     * see https://huggingface.co/ViperYX/RGT/tree/main
     */
    | "ViperYX/RGT_S_x4.pth"
    /** RGT x2 upscale model for ComfyUI-RGT
     * 179.8MB - https://huggingface.co/ViperYX/RGT/resolve/main/RGT/RGT_x2.pth
     * see https://huggingface.co/ViperYX/RGT/tree/main
     */
    | "ViperYX/RGT_x2.pth"
    /** RGT x3 upscale model for ComfyUI-RGT
     * 180.5MB - https://huggingface.co/ViperYX/RGT/resolve/main/RGT/RGT_x3.pth
     * see https://huggingface.co/ViperYX/RGT/tree/main
     */
    | "ViperYX/RGT_x3.pth"
    /** RGT_S x4 upscale model for ComfyUI-RGT
     * 180.4MB - https://huggingface.co/ViperYX/RGT/resolve/main/RGT/RGT_x4.pth
     * see https://huggingface.co/ViperYX/RGT/tree/main
     */
    | "ViperYX/RGT_x4.pth"
    /** Segmenty Anything SAM model (ViT-B)
     * 375.0MB - https://dl.fbaipublicfiles.com/segment_anything/sam_vit_b_01ec64.pth
     * see https://github.com/facebookresearch/segment-anything#model-checkpoints
     */
    | "ViT-B SAM model"
    /** Segmenty Anything SAM model (ViT-H)
     * 2.56GB - https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth
     * see https://github.com/facebookresearch/segment-anything#model-checkpoints
     */
    | "ViT-H SAM model"
    /** Segmenty Anything SAM model (ViT-L)
     * 1.25GB - https://dl.fbaipublicfiles.com/segment_anything/sam_vit_l_0b3195.pth
     * see https://github.com/facebookresearch/segment-anything#model-checkpoints
     */
    | "ViT-L SAM model"
    /** Greatly improved TEXT + Detail (as CLIP-L for Flux.1)
     * 931MB - https://huggingface.co/zer0int/CLIP-GmP-ViT-L-14/resolve/main/ViT-L-14-TEXT-detail-improved-hiT-GmP-HF.safetensors
     * see https://huggingface.co/zer0int
     */
    | "ViT-L-14-TEXT-detail-improved-hiT-GmP-HF.safetensors [Long CLIP L]"
    /** Greatly improved TEXT + Detail (as CLIP-L for Flux.1)
     * 323MB - https://huggingface.co/zer0int/CLIP-GmP-ViT-L-14/resolve/main/ViT-L-14-TEXT-detail-improved-hiT-GmP-TE-only-HF.safetensors
     * see https://huggingface.co/zer0int
     */
    | "ViT-L-14-TEXT-detail-improved-hiT-GmP-HF.safetensors [Long CLIP L]"
    /** Buffalo_l w600k_r50.onnx model for IpAdapterPlus
     * 174.4MB - https://huggingface.co/public-data/insightface/resolve/main/models/buffalo_l/w600k_r50.onnx
     * see https://github.com/cubiq/ComfyUI_IPAdapter_plus?tab=readme-ov-file#faceid
     */
    | "w600k_r50.onnx"
    /** Waifu Diffusion 1.5 Beta3
     * 2.58GB - https://huggingface.co/waifu-diffusion/wd-1-5-beta3/resolve/main/wd-illusion-fp16.safetensors
     * see https://huggingface.co/waifu-diffusion/wd-1-5-beta3
     */
    | "Waifu Diffusion 1.5 Beta3 (fp16)"
    /** Mix model (SD2.1 unCLIP + Waifu Diffusion 1.5)
     * 3.98GB - https://huggingface.co/comfyanonymous/wd-1.5-beta2_unCLIP/resolve/main/wd-1-5-beta2-aesthetic-unclip-h-fp16.safetensors
     * see https://huggingface.co/comfyanonymous/wd-1.5-beta2_unCLIP
     */
    | "Waifu Diffusion 1.5 unCLIP model"
    /** Controlnet SDXL Depth model.
     * 2.50GB - https://huggingface.co/xinsir/controlnet-depth-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/xinsir/controlnet-depth-sdxl-1.0
     */
    | "xinsir/ControlNet Depth SDXL, support zoe, midias"
    /** Controlnet SDXL Tile model.
     * 2.50GB - https://huggingface.co/xinsir/controlnet-tile-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/xinsir/controlnet-tile-sdxl-1.0
     */
    | "xinsir/ControlNet Tile SDXL"
    /** Controlnet SDXL Canny model.
     * 2.50GB - https://huggingface.co/xinsir/controlnet-canny-sdxl-1.0/resolve/main/diffusion_pytorch_model_V2.safetensors
     * see https://huggingface.co/xinsir/controlnet-canny-sdxl-1.0
     */
    | "xinsir/Controlnet-Canny-Sdxl-1.0 (V2)"
    /** Controlnet SDXL Openpose model.
     * 2.50GB - https://huggingface.co/xinsir/controlnet-openpose-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/xinsir/controlnet-openpose-sdxl-1.0
     */
    | "xinsir/Controlnet-Openpose-Sdxl-1.0"
    /** Controlnet SDXL Openpose model. (Ver. twins)
     * 2.50GB - https://huggingface.co/xinsir/controlnet-openpose-sdxl-1.0/resolve/main/diffusion_pytorch_model_twins.safetensors
     * see https://huggingface.co/xinsir/controlnet-openpose-sdxl-1.0
     */
    | "xinsir/Controlnet-Openpose-Sdxl-1.0 (Ver. twins)"
    /** Controlnet SDXL Scribble model.
     * 2.50GB - https://huggingface.co/xinsir/controlnet-scribble-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/xinsir/controlnet-scribble-sdxl-1.0
     */
    | "xinsir/Controlnet-Scribble-Sdxl-1.0"
    /** Controlnet SDXL Scribble model. (Ver. anime)
     * 2.50GB - https://huggingface.co/xinsir/anime-painter/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/xinsir/anime-painter
     */
    | "xinsir/Controlnet-Scribble-Sdxl-1.0-Anime"
    /** All-in-one ControlNet for image generations and editing!
     * 2.50GB - https://huggingface.co/xinsir/controlnet-union-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors
     * see https://huggingface.co/xinsir/controlnet-union-sdxl-1.0
     */
    | "xinsir/ControlNet++: All-in-one ControlNet"
    /** All-in-one ControlNet for image generations and editing! (ProMax model)
     * 2.50GB - https://huggingface.co/xinsir/controlnet-union-sdxl-1.0/resolve/main/diffusion_pytorch_model_promax.safetensors
     * see https://huggingface.co/xinsir/controlnet-union-sdxl-1.0
     */
    | "xinsir/ControlNet++: All-in-one ControlNet (ProMax model)"
    /** A checkpoint with trained LoRAs for FLUX.1-dev model by Black Forest Labs
     * 44.8MB - https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/scenery_lora.safetensors
     * see https://huggingface.co/XLabs-AI/flux-lora-collection
     */
    | "XLabs-AI/art_lora.safetensors"
    /** ControlNet checkpoints for FLUX.1-dev model by Black Forest Labs.
     * 1.49GB - https://huggingface.co/XLabs-AI/flux-controlnet-collections/resolve/main/flux-canny-controlnet-v3.safetensors
     * see https://huggingface.co/XLabs-AI/flux-controlnet-collections
     */
    | "XLabs-AI/flux-canny-controlnet-v3.safetensors"
    /** ControlNet checkpoints for FLUX.1-dev model by Black Forest Labs.
     * 1.49GB - https://huggingface.co/XLabs-AI/flux-controlnet-collections/resolve/main/flux-depth-controlnet-v3.safetensors
     * see https://huggingface.co/XLabs-AI/flux-controlnet-collections
     */
    | "XLabs-AI/flux-depth-controlnet-v3.safetensors"
    /** ControlNet checkpoints for FLUX.1-dev model by Black Forest Labs.
     * 1.49GB - https://huggingface.co/XLabs-AI/flux-controlnet-collections/resolve/main/flux-hed-controlnet-v3.safetensors
     * see https://huggingface.co/XLabs-AI/flux-controlnet-collections
     */
    | "XLabs-AI/flux-hed-controlnet-v3.safetensors"
    /** A checkpoint with trained LoRAs for FLUX.1-dev model by Black Forest Labs
     * 982MB - https://huggingface.co/XLabs-AI/flux-ip-adapter/resolve/main/ip_adapter.safetensors
     * see https://huggingface.co/XLabs-AI/flux-ip-adapter
     */
    | "XLabs-AI/flux-ip-adapter"
    /** A checkpoint with trained LoRAs for FLUX.1-dev model by Black Forest Labs
     * 44.8MB - https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/mjv6_lora.safetensors
     * see https://huggingface.co/XLabs-AI/flux-lora-collection
     */
    | "XLabs-AI/mjv6_lora.safetensors"
    /** A checkpoint with trained LoRAs for FLUX.1-dev model by Black Forest Labs
     * 44.8MB - https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/realism_lora.safetensors
     * see https://huggingface.co/XLabs-AI/flux-lora-collection
     */
    | "XLabs-AI/realism_lora.safetensors"
    /** Face Detection Models. Download the model required for using the 'Facerestore CF (Code Former)' custom node.
     * 187.0MB - https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/yolov5l-face.pth
     * see https://github.com/xinntao/facexlib
     */
    | "yolov5l-face.pth"
    /** Face Detection Models. Download the model required for using the 'Facerestore CF (Code Former)' custom node.
     * 7.15MB - https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/yolov5n-face.pth
     * see https://github.com/xinntao/facexlib
     */
    | "yolov5n-face.pth"
    /** model that been trained on 10M+ 3D objects from Objaverse-XL, used for generated rotated CamView
     * 15.5GB - https://huggingface.co/kealiu/zero123-xl/resolve/main/zero123-xl.ckpt
     * see https://objaverse.allenai.org/docs/zero123-xl/
     */
    | "Zero123 3D object Model"
    /** Stable Zero123 is a model for view-conditioned image generation based on [a/Zero123](https://github.com/cvlab-columbia/zero123).
     * 8.58GB - https://huggingface.co/stabilityai/stable-zero123/resolve/main/stable_zero123.ckpt
     * see https://huggingface.co/stabilityai/stable-zero123
     */
    | "Zero123 3D object Model"
    /** Zero123 original checkpoints in 105000 steps.
     * 15.5GB - https://huggingface.co/cvlab/zero123-weights/resolve/main/105000.ckpt
     * see https://huggingface.co/cvlab/zero123-weights
     */
    | "Zero123 3D object Model"
    /** Zero123 original checkpoints in 165000 steps.
     * 15.5GB - https://huggingface.co/cvlab/zero123-weights/resolve/main/165000.ckpt
     * see https://huggingface.co/cvlab/zero123-weights
     */
    | "Zero123 3D object Model"


