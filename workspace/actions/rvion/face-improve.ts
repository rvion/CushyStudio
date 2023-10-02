action('test', {
    author: '',
    help: '',
    // prettier-ignore
    run:async (flow, deps) => {
        const graph = flow.nodes
        const upscaleModel = graph.UpscaleModelLoader({model_name: "4x-UltraSharp.pth", })
        const load = graph.LoadImage({image: "ComfyUI_01394_ (1).png", })
        const imageUpscaleWithModel = graph.ImageUpscaleWithModel({upscale_model: upscaleModel.UPSCALE_MODEL, image: load.IMAGE, })
        const cLIPSegMasking = graph.CLIPSeg_Masking({text: "face", image: imageUpscaleWithModel.IMAGE, })
        const imageThreshold = graph.Image_Threshold({threshold: 0.2, image: cLIPSegMasking.IMAGE, })
        const maskCropDominantRegion = graph.Mask_Crop_Dominant_Region({padding: 24, masks: cLIPSegMasking.MASK, })
        const imageToMask = graph.Image_To_Mask({ image: imageThreshold, method:'alpha' })
        const maskCropRegion = graph.Mask_Crop_Region({padding: 15, region_type: "minority", mask: imageToMask.MASK, })
        const maskTo = graph.MaskToImage({mask: maskCropRegion.MASK, })
        const preview = graph.PreviewImage({images: maskTo.IMAGE, })
        const imageCropLocation = graph.Image_Crop_Location({top: maskCropRegion.INT, left: maskCropRegion.INT_1, right: maskCropRegion.INT_2, bottom: maskCropRegion.INT_3, image: imageUpscaleWithModel.IMAGE, })
        const preview_1 = graph.PreviewImage({images: imageCropLocation.IMAGE, })
        const ttNPipeLoaderSDXL = graph.ttN_pipeLoaderSDXL({ckpt_name: "albedobaseXL_v02.safetensors", vae_name: "Baked VAE", lora1_name: "None", lora1_model_strength: 1, lora1_clip_strength: 1, lora2_name: "None", lora2_model_strength: 1, lora2_clip_strength: 1, refiner_ckpt_name: "sd_xl_refiner_1.0.safetensors", refiner_vae_name: "Baked VAE", refiner_lora1_name: "None", refiner_lora1_model_strength: 1, refiner_lora1_clip_strength: 1, refiner_lora2_name: "None", refiner_lora2_model_strength: 1, refiner_lora2_clip_strength: 1, clip_skip: -2, positive: "very nice detailed face", positive_token_normalization: "none", positive_weight_interpretation: "comfy", negative: "blurry", negative_token_normalization: "none", negative_weight_interpretation: "comfy", empty_latent_width: 1024, empty_latent_height: 1024, batch_size: 1, seed: 1234567890, })
        const ttNPipeKSamplerSDXL = graph.ttN_pipeKSamplerSDXL({upscale_method: "None", factor: 2, crop: "disabled", sampler_state: "Sample", base_steps: 20, refiner_steps: 20, cfg: 8, sampler_name: "euler", scheduler: "normal", image_output: "Hide", save_prefix: "ComfyUI", seed: 1234567890, sdxl_pipe: ttNPipeLoaderSDXL.PIPE_LINE_SDXL, })
        const vAEEncode = graph.VAEEncode({pixels: imageCropLocation.IMAGE, vae: ttNPipeKSamplerSDXL.VAE, })
        const kSampler = graph.KSampler({seed: 1234567890, steps: 22, cfg: 6.24, sampler_name: "dpmpp_2m", scheduler: "karras", denoise: 0.5, model: ttNPipeKSamplerSDXL.MODEL, positive: ttNPipeKSamplerSDXL.CONDITIONING, negative: ttNPipeKSamplerSDXL.CONDITIONING_1, latent_image: vAEEncode.LATENT, })
        const vAEDecode = graph.VAEDecode({samples: kSampler.LATENT, vae: ttNPipeKSamplerSDXL.VAE, })
        const preview_2 = graph.PreviewImage({images: vAEDecode.IMAGE, })
        const imagePasteCropByLocation = graph.Image_Paste_Crop_by_Location({top: maskCropRegion.INT, left: maskCropRegion.INT_1, right: maskCropRegion.INT_2, bottom: maskCropRegion.INT_3, crop_blending: 0.25, crop_sharpening: 0, image: imageUpscaleWithModel.IMAGE, crop_image: vAEDecode.IMAGE, })
        const preview_3 = graph.PreviewImage({images: imagePasteCropByLocation.IMAGE, })
        const ttNImageOutput = graph.ttN_imageOutput({image_output: "Hide/Save", output_path: "C:\\Spezial\\_outputs\\ComfyUI\\murphylanga", save_prefix: "murphylanga -  %date:yyyy-MM-dd% - Standard", number_padding: 5, file_type: "PNG", overwrite_existing: "False", embed_workflow: "True", image: imagePasteCropByLocation.IMAGE, })
        const globalSeedInspire = graph.GlobalSeed_$3$3Inspire({value: 1234567890, mode: true as any, action: "fixed", })
        await flow.PROMPT()
    },
})
