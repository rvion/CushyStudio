action('Murphylanga-x-SDXL_face_grap_and_detail', {
    author: 'murphy',
    run: async (flow, deps) => {
        const graph = flow.nodes

        const upscaleModel = graph.UpscaleModelLoader({ model_name: 'RealESRGAN_x2.pth' })
        const load = graph.LoadImage({
            image: 'ComfyUI_01264_.png',
        })
        const imageUpscaleWithModel = graph.ImageUpscaleWithModel({
            upscale_model: upscaleModel.UPSCALE_MODEL,
            image: load.IMAGE,
        })
        const cLIPSeg_Masking = graph.CLIPSeg_Masking({ text: 'face', image: imageUpscaleWithModel.IMAGE })
        const image_Threshold = graph.Image_Threshold({ threshold: 0.2, image: cLIPSeg_Masking.IMAGE })
        const mask_Crop_Dominant_Region = graph.Mask_Crop_Dominant_Region({ padding: 24, masks: cLIPSeg_Masking.MASK })
        const image_To_Mask = graph.Image_To_Mask({ method: 'alpha', image: image_Threshold.IMAGE })
        const mask_Crop_Region = graph.Mask_Crop_Region({ padding: 15, region_type: 'minority', mask: image_To_Mask.MASK })
        const maskTo = graph.MaskToImage({ mask: mask_Crop_Region.MASK })
        const preview = graph.PreviewImage({ images: maskTo.IMAGE })
        const image_Crop_Location = graph.Image_Crop_Location({
            image: imageUpscaleWithModel.IMAGE,
            top: mask_Crop_Region.INT,
            left: mask_Crop_Region.INT_1,
            right: mask_Crop_Region.INT_2,
            bottom: mask_Crop_Region.INT_3,
        })
        const preview_1 = graph.PreviewImage({ images: image_Crop_Location.IMAGE })
        const ttN_pipeLoaderSDXL = graph.ttN_pipeLoaderSDXL({
            ckpt_name: 'albedobaseXL_v02.safetensors',
            vae_name: 'Baked VAE',
            lora1_name: 'None',
            lora1_model_strength: 1,
            lora1_clip_strength: 1,
            lora2_name: 'None',
            lora2_model_strength: 1,
            lora2_clip_strength: 1,
            refiner_ckpt_name: 'sd_xl_refiner_1.0.safetensors',
            refiner_vae_name: 'Baked VAE',
            refiner_lora1_name: 'None',
            refiner_lora1_model_strength: 1,
            refiner_lora1_clip_strength: 1,
            refiner_lora2_name: 'None',
            refiner_lora2_model_strength: 1,
            refiner_lora2_clip_strength: 1,
            clip_skip: -2,
            positive: 'very nice detailed face',
            positive_token_normalization: 'none',
            positive_weight_interpretation: 'comfy',
            negative: 'blurry',
            negative_token_normalization: 'none',
            negative_weight_interpretation: 'comfy',
            empty_latent_width: 1024,
            empty_latent_height: 1024,
            batch_size: 1,
            seed: 1234567890,
        })
        const ttN_pipeKSamplerSDXL = graph.ttN_pipeKSamplerSDXL({
            upscale_method: 'None',
            factor: 2,
            crop: 'disabled',
            sampler_state: 'Sample',
            base_steps: 20,
            refiner_steps: 20,
            cfg: 8,
            sampler_name: 'euler',
            scheduler: 'normal',
            image_output: 'Hide',
            save_prefix: 'ComfyUI',
            seed: 1234567890,
            sdxl_pipe: ttN_pipeLoaderSDXL.PIPE_LINE_SDXL,
        })
        const vAEEncode = graph.VAEEncode({ pixels: image_Crop_Location.IMAGE, vae: ttN_pipeKSamplerSDXL.VAE })
        const kSampler_1 = graph.KSampler({
            seed: 1234567890,
            steps: 22,
            cfg: 6.24,
            sampler_name: 'dpmpp_2m',
            scheduler: 'karras',
            denoise: 0.5,
            model: ttN_pipeKSamplerSDXL.MODEL,
            positive: ttN_pipeKSamplerSDXL.CONDITIONING,
            negative: ttN_pipeKSamplerSDXL.CONDITIONING_1,
            latent_image: vAEEncode.LATENT,
        })
        const vAEDecode_1 = graph.VAEDecode({ samples: kSampler_1.LATENT, vae: ttN_pipeKSamplerSDXL.VAE })
        const preview_2 = graph.PreviewImage({ images: vAEDecode_1.IMAGE })
        const image_Paste_Crop_by_Location = graph.Image_Paste_Crop_by_Location({
            crop_blending: 0,
            crop_sharpening: 0,
            image: imageUpscaleWithModel.IMAGE,
            crop_image: vAEDecode_1.IMAGE,
            top: mask_Crop_Region.INT,
            left: mask_Crop_Region.INT_1,
            right: mask_Crop_Region.INT_2,
            bottom: mask_Crop_Region.INT_3,
        })
        const preview_3 = graph.PreviewImage({ images: image_Paste_Crop_by_Location.IMAGE })
        const ttN_imageOutput = graph.ttN_imageOutput({
            image_output: 'Hide/Save',
            output_path: 'C:\\Spezial\\_outputs\\ComfyUI\\murphylanga',
            save_prefix: 'murphylanga -  %date:yyyy-MM-dd% - Standard',
            number_padding: 5,
            file_type: 'PNG',
            overwrite_existing: 'False',
            embed_workflow: 'True',
            image: image_Paste_Crop_by_Location.IMAGE,
        })
        const globalSeed_$3$3Inspire = graph.GlobalSeed_$3$3Inspire({
            value: 1234567890,
            mode: true,
            action: 'fixed',
            last_seed: undefined,
        })
        await flow.PROMPT()
    },
})
