action('Murphylanga-x-SDXL_face_grap_and_detail.png', {
    author: 'murphy',
    ui: (ui) => ({
        UpscaleModelLoader_model_name: ui.enum({
            default: 'RealESRGAN_x2plus.pth',
            enumName: 'Enum_UpscaleModelLoader_model_name',
        }) /* Enum_UpscaleModelLoader_model_name */,
        LoadImage_image: ui.image({
            default:
                '00269-xmoerf - dreamshaperXL10_alpha2Xl10 - None - 1girl simple background oil painting sunlight strong light (1).jpg',
        }) /* Enum_LoadImage_image */,
        'CLIPSeg Masking_text': ui.string({ default: 'face' }) /* STRING */,
        'Image Threshold_threshold': ui.number({ default: 0.2 }) /* FLOAT */,
        'Mask Crop Dominant Region_padding': ui.number({ default: 24 }) /* INT */,
        'Image To Mask_method': ui.enum({
            default: 'alpha',
            enumName: 'Enum_Image_To_Mask_method',
        }) /* Enum_Image_To_Mask_method */,
        'Mask Crop Region_padding': ui.number({ default: 15 }) /* INT */,
        'Mask Crop Region_region_type': ui.enum({
            default: 'minority',
            enumName: 'Enum_Mask_Crop_Region_region_type',
        }) /* Enum_Mask_Crop_Region_region_type */,
        'ttN pipeLoaderSDXL_ckpt_name': ui.enum({
            default: 'XL\\crystalClearXL_ccxl.safetensors',
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
        }) /* Enum_CheckpointLoaderSimple_ckpt_name */,
        'ttN pipeLoaderSDXL_vae_name': ui.enum({
            default: 'Baked VAE',
            enumName: 'Enum_ttN_pipeLoader_vae_name',
        }) /* Enum_ttN_pipeLoader_vae_name */,
        'ttN pipeLoaderSDXL_lora1_name': ui.enum({
            default: 'None',
            enumName: 'Enum_ttN_pipeLoader_lora1_name',
        }) /* Enum_ttN_pipeLoader_lora1_name */,
        'ttN pipeLoaderSDXL_lora1_model_strength': ui.number({ default: 1 }) /* FLOAT */,
        'ttN pipeLoaderSDXL_lora1_clip_strength': ui.number({ default: 1 }) /* FLOAT */,
        'ttN pipeLoaderSDXL_lora2_name': ui.enum({
            default: 'None',
            enumName: 'Enum_ttN_pipeLoader_lora1_name',
        }) /* Enum_ttN_pipeLoader_lora1_name */,
        'ttN pipeLoaderSDXL_lora2_model_strength': ui.number({ default: 1 }) /* FLOAT */,
        'ttN pipeLoaderSDXL_lora2_clip_strength': ui.number({ default: 1 }) /* FLOAT */,
        'ttN pipeLoaderSDXL_refiner_ckpt_name': ui.enum({
            default: 'XL\\canvasxl_Bfloat16V002.safetensors',
            enumName: 'Enum_ttN_pipeLoaderSDXL_refiner_ckpt_name',
        }) /* Enum_ttN_pipeLoaderSDXL_refiner_ckpt_name */,
        'ttN pipeLoaderSDXL_refiner_vae_name': ui.enum({
            default: 'Baked VAE',
            enumName: 'Enum_ttN_pipeLoader_vae_name',
        }) /* Enum_ttN_pipeLoader_vae_name */,
        'ttN pipeLoaderSDXL_refiner_lora1_name': ui.enum({
            default: 'None',
            enumName: 'Enum_ttN_pipeLoader_lora1_name',
        }) /* Enum_ttN_pipeLoader_lora1_name */,
        'ttN pipeLoaderSDXL_refiner_lora1_model_strength': ui.number({ default: 1 }) /* FLOAT */,
        'ttN pipeLoaderSDXL_refiner_lora1_clip_strength': ui.number({ default: 1 }) /* FLOAT */,
        'ttN pipeLoaderSDXL_refiner_lora2_name': ui.enum({
            default: 'None',
            enumName: 'Enum_ttN_pipeLoader_lora1_name',
        }) /* Enum_ttN_pipeLoader_lora1_name */,
        'ttN pipeLoaderSDXL_refiner_lora2_model_strength': ui.number({ default: 1 }) /* FLOAT */,
        'ttN pipeLoaderSDXL_refiner_lora2_clip_strength': ui.number({ default: 1 }) /* FLOAT */,
        'ttN pipeLoaderSDXL_clip_skip': ui.number({ default: -2 }) /* INT */,
        'ttN pipeLoaderSDXL_positive': ui.string({ default: 'very nice detailed face' }) /* STRING */,
        'ttN pipeLoaderSDXL_positive_token_normalization': ui.enum({
            default: 'none',
            enumName: 'Enum_ttN_pipeLoader_positive_token_normalization',
        }) /* Enum_ttN_pipeLoader_positive_token_normalization */,
        'ttN pipeLoaderSDXL_positive_weight_interpretation': ui.enum({
            default: 'comfy',
            enumName: 'Enum_ttN_pipeLoader_positive_weight_interpretation',
        }) /* Enum_ttN_pipeLoader_positive_weight_interpretation */,
        'ttN pipeLoaderSDXL_negative': ui.string({ default: 'blurry' }) /* STRING */,
        'ttN pipeLoaderSDXL_negative_token_normalization': ui.enum({
            default: 'none',
            enumName: 'Enum_ttN_pipeLoader_positive_token_normalization',
        }) /* Enum_ttN_pipeLoader_positive_token_normalization */,
        'ttN pipeLoaderSDXL_negative_weight_interpretation': ui.enum({
            default: 'comfy',
            enumName: 'Enum_ttN_pipeLoader_positive_weight_interpretation',
        }) /* Enum_ttN_pipeLoader_positive_weight_interpretation */,
        'ttN pipeLoaderSDXL_empty_latent_width': ui.number({ default: 1024 }) /* INT */,
        'ttN pipeLoaderSDXL_empty_latent_height': ui.number({ default: 1024 }) /* INT */,
        'ttN pipeLoaderSDXL_batch_size': ui.number({ default: 1 }) /* INT */,
        'ttN pipeLoaderSDXL_seed': ui.number({ default: 1234567890 }) /* INT */,
        'ttN pipeKSamplerSDXL_upscale_method': ui.enum({
            default: 'None',
            enumName: 'Enum_ttN_pipeKSampler_upscale_method',
        }) /* Enum_ttN_pipeKSampler_upscale_method */,
        'ttN pipeKSamplerSDXL_factor': ui.number({ default: 2 }) /* FLOAT */,
        'ttN pipeKSamplerSDXL_crop': ui.enum({
            default: 'disabled',
            enumName: 'Enum_LatentUpscale_crop',
        }) /* Enum_LatentUpscale_crop */,
        'ttN pipeKSamplerSDXL_sampler_state': ui.enum({
            default: 'Sample',
            enumName: 'Enum_ttN_pipeKSampler_sampler_state',
        }) /* Enum_ttN_pipeKSampler_sampler_state */,
        'ttN pipeKSamplerSDXL_base_steps': ui.number({ default: 20 }) /* INT */,
        'ttN pipeKSamplerSDXL_refiner_steps': ui.number({ default: 20 }) /* INT */,
        'ttN pipeKSamplerSDXL_cfg': ui.number({ default: 8 }) /* FLOAT */,
        'ttN pipeKSamplerSDXL_sampler_name': ui.enum({
            default: 'euler',
            enumName: 'Enum_KSampler_sampler_name',
        }) /* Enum_KSampler_sampler_name */,
        'ttN pipeKSamplerSDXL_scheduler': ui.enum({
            default: 'normal',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        'ttN pipeKSamplerSDXL_image_output': ui.enum({
            default: 'Hide',
            enumName: 'Enum_ttN_pipeKSampler_image_output',
        }) /* Enum_ttN_pipeKSampler_image_output */,
        'ttN pipeKSamplerSDXL_save_prefix': ui.string({ default: 'ComfyUI' }) /* STRING */,
        'ttN pipeKSamplerSDXL_seed': ui.numberOpt({ default: 1234567890 }) /* INT */,
        KSampler_seed: ui.number({ default: 1234567890 }) /* INT */,
        KSampler_steps: ui.number({ default: 22 }) /* INT */,
        KSampler_cfg: ui.number({ default: 6.24 }) /* FLOAT */,
        KSampler_sampler_name: ui.enum({
            default: 'dpmpp_2m',
            enumName: 'Enum_KSampler_sampler_name',
        }) /* Enum_KSampler_sampler_name */,
        KSampler_scheduler: ui.enum({ default: 'karras', enumName: 'Enum_KSampler_scheduler' }) /* Enum_KSampler_scheduler */,
        KSampler_denoise: ui.number({ default: 0.5 }) /* FLOAT */,
        'Image Paste Crop by Location_crop_blending': ui.number({ default: 0.25 }) /* FLOAT */,
        'Image Paste Crop by Location_crop_sharpening': ui.number({ default: 0 }) /* INT */,
        'ttN imageOutput_image_output': ui.enum({
            default: 'Hide/Save',
            enumName: 'Enum_ttN_pipeKSampler_image_output',
        }) /* Enum_ttN_pipeKSampler_image_output */,
        'ttN imageOutput_output_path': ui.string({ default: 'C:\\Spezial\\_outputs\\ComfyUI\\murphylanga' }) /* STRING */,
        'ttN imageOutput_save_prefix': ui.string({ default: 'murphylanga -  %date:yyyy-MM-dd% - Standard' }) /* STRING */,
        'ttN imageOutput_number_padding': ui.enum({
            default: 5,
            enumName: 'Enum_ttN_imageOutput_number_padding',
        }) /* Enum_ttN_imageOutput_number_padding */,
        'ttN imageOutput_file_type': ui.enum({
            default: 'PNG',
            enumName: 'Enum_ttN_imageOutput_file_type',
        }) /* Enum_ttN_imageOutput_file_type */,
        'ttN imageOutput_overwrite_existing': ui.enum({
            default: 'False',
            enumName: 'Enum_ttN_xyPlot_output_individuals',
        }) /* Enum_ttN_xyPlot_output_individuals */,
        'ttN imageOutput_embed_workflow': ui.enum({
            default: 'True',
            enumName: 'Enum_ttN_xyPlot_output_individuals',
        }) /* Enum_ttN_xyPlot_output_individuals */,
        'GlobalSeed //Inspire_value': ui.number({ default: 1234567890 }) /* INT */,
        'GlobalSeed //Inspire_mode': ui.boolean({ default: true }) /* BOOLEAN */,
        'GlobalSeed //Inspire_action': ui.enum({
            default: 'fixed',
            enumName: 'Enum_GlobalSeed_$3$3Inspire_action',
        }) /* Enum_GlobalSeed_$3$3Inspire_action */,
        'GlobalSeed //Inspire_last_seed': ui.string({ default: undefined }) /* STRING */,
    }),

    run: async (flow, p) => {
        const graph = flow.nodes
        const upscaleModel = graph.UpscaleModelLoader({ model_name: p.UpscaleModelLoader_model_name })
        const load = graph.LoadImage({ image: await flow.loadImageAnswerAsEnum(p.LoadImage_image) })
        const imageUpscaleWithModel = graph.ImageUpscaleWithModel({
            upscale_model: upscaleModel.UPSCALE_MODEL,
            image: load.IMAGE,
        })
        const cLIPSeg_Masking = graph.CLIPSeg_Masking({ text: p['CLIPSeg Masking_text'], image: imageUpscaleWithModel.IMAGE })
        const image_Threshold = graph.Image_Threshold({
            threshold: p['Image Threshold_threshold'],
            image: cLIPSeg_Masking.MASK_IMAGE,
        })
        const mask_Crop_Dominant_Region = graph.Mask_Crop_Dominant_Region({
            padding: p['Mask Crop Dominant Region_padding'],
            masks: cLIPSeg_Masking.MASK,
        })
        const image_To_Mask = graph.Image_To_Mask({ method: p['Image To Mask_method'], image: image_Threshold.IMAGE })
        const mask_Crop_Region = graph.Mask_Crop_Region({
            padding: p['Mask Crop Region_padding'],
            region_type: p['Mask Crop Region_region_type'],
            mask: image_To_Mask.MASK,
        })
        const maskTo = graph.MaskToImage({ mask: mask_Crop_Region.cropped_mask })
        const preview = graph.PreviewImage({ images: maskTo.IMAGE })
        const image_Crop_Location = graph.Image_Crop_Location({
            image: imageUpscaleWithModel.IMAGE,
            top: mask_Crop_Region.top_int,
            left: mask_Crop_Region.left_int,
            right: mask_Crop_Region.right_int,
            bottom: mask_Crop_Region.bottom_int,
        })
        const preview_1 = graph.PreviewImage({ images: image_Crop_Location.IMAGE })
        const ttN_pipeLoaderSDXL = graph.ttN_pipeLoaderSDXL({
            ckpt_name: p['ttN pipeLoaderSDXL_ckpt_name'],
            vae_name: p['ttN pipeLoaderSDXL_vae_name'],
            lora1_name: p['ttN pipeLoaderSDXL_lora1_name'],
            lora1_model_strength: p['ttN pipeLoaderSDXL_lora1_model_strength'],
            lora1_clip_strength: p['ttN pipeLoaderSDXL_lora1_clip_strength'],
            lora2_name: p['ttN pipeLoaderSDXL_lora2_name'],
            lora2_model_strength: p['ttN pipeLoaderSDXL_lora2_model_strength'],
            lora2_clip_strength: p['ttN pipeLoaderSDXL_lora2_clip_strength'],
            refiner_ckpt_name: p['ttN pipeLoaderSDXL_refiner_ckpt_name'],
            refiner_vae_name: p['ttN pipeLoaderSDXL_refiner_vae_name'],
            refiner_lora1_name: p['ttN pipeLoaderSDXL_refiner_lora1_name'],
            refiner_lora1_model_strength: p['ttN pipeLoaderSDXL_refiner_lora1_model_strength'],
            refiner_lora1_clip_strength: p['ttN pipeLoaderSDXL_refiner_lora1_clip_strength'],
            refiner_lora2_name: p['ttN pipeLoaderSDXL_refiner_lora2_name'],
            refiner_lora2_model_strength: p['ttN pipeLoaderSDXL_refiner_lora2_model_strength'],
            refiner_lora2_clip_strength: p['ttN pipeLoaderSDXL_refiner_lora2_clip_strength'],
            clip_skip: p['ttN pipeLoaderSDXL_clip_skip'],
            positive: p['ttN pipeLoaderSDXL_positive'],
            positive_token_normalization: p['ttN pipeLoaderSDXL_positive_token_normalization'],
            positive_weight_interpretation: p['ttN pipeLoaderSDXL_positive_weight_interpretation'],
            negative: p['ttN pipeLoaderSDXL_negative'],
            negative_token_normalization: p['ttN pipeLoaderSDXL_negative_token_normalization'],
            negative_weight_interpretation: p['ttN pipeLoaderSDXL_negative_weight_interpretation'],
            empty_latent_width: p['ttN pipeLoaderSDXL_empty_latent_width'],
            empty_latent_height: p['ttN pipeLoaderSDXL_empty_latent_height'],
            batch_size: p['ttN pipeLoaderSDXL_batch_size'],
            seed: p['ttN pipeLoaderSDXL_seed'],
        })
        const ttN_pipeKSamplerSDXL = graph.ttN_pipeKSamplerSDXL({
            upscale_method: p['ttN pipeKSamplerSDXL_upscale_method'],
            factor: p['ttN pipeKSamplerSDXL_factor'],
            crop: p['ttN pipeKSamplerSDXL_crop'],
            sampler_state: p['ttN pipeKSamplerSDXL_sampler_state'],
            base_steps: p['ttN pipeKSamplerSDXL_base_steps'],
            refiner_steps: p['ttN pipeKSamplerSDXL_refiner_steps'],
            cfg: p['ttN pipeKSamplerSDXL_cfg'],
            sampler_name: p['ttN pipeKSamplerSDXL_sampler_name'],
            scheduler: p['ttN pipeKSamplerSDXL_scheduler'],
            image_output: p['ttN pipeKSamplerSDXL_image_output'],
            save_prefix: p['ttN pipeKSamplerSDXL_save_prefix'],
            seed: p['ttN pipeKSamplerSDXL_seed'],
            sdxl_pipe: ttN_pipeLoaderSDXL.sdxl_pipe,
        })
        const vAEEncode = graph.VAEEncode({ pixels: image_Crop_Location.IMAGE, vae: ttN_pipeKSamplerSDXL.vae })
        const kSampler = graph.KSampler({
            seed: p.KSampler_seed,
            steps: p.KSampler_steps,
            cfg: p.KSampler_cfg,
            sampler_name: p.KSampler_sampler_name,
            scheduler: p.KSampler_scheduler,
            denoise: p.KSampler_denoise,
            model: ttN_pipeKSamplerSDXL.model,
            positive: ttN_pipeKSamplerSDXL.positive,
            negative: ttN_pipeKSamplerSDXL.negative,
            latent_image: vAEEncode.LATENT,
        })
        const vAEDecode = graph.VAEDecode({ samples: kSampler.LATENT, vae: ttN_pipeKSamplerSDXL.vae })
        const preview_2 = graph.PreviewImage({ images: vAEDecode.IMAGE })
        const image_Paste_Crop_by_Location = graph.Image_Paste_Crop_by_Location({
            crop_blending: p['Image Paste Crop by Location_crop_blending'],
            crop_sharpening: p['Image Paste Crop by Location_crop_sharpening'],
            image: imageUpscaleWithModel.IMAGE,
            crop_image: vAEDecode.IMAGE,
            top: mask_Crop_Region.top_int,
            left: mask_Crop_Region.left_int,
            right: mask_Crop_Region.right_int,
            bottom: mask_Crop_Region.bottom_int,
        })
        const preview_3 = graph.PreviewImage({ images: image_Paste_Crop_by_Location.IMAGE })
        const ttN_imageOutput = graph.ttN_imageOutput({
            image_output: p['ttN imageOutput_image_output'],
            output_path: p['ttN imageOutput_output_path'],
            save_prefix: p['ttN imageOutput_save_prefix'],
            number_padding: p['ttN imageOutput_number_padding'],
            file_type: p['ttN imageOutput_file_type'],
            overwrite_existing: p['ttN imageOutput_overwrite_existing'],
            embed_workflow: p['ttN imageOutput_embed_workflow'],
            image: image_Paste_Crop_by_Location.IMAGE,
        })
        const globalSeed_$3$3Inspire = graph.GlobalSeed_$3$3Inspire({
            value: p['GlobalSeed //Inspire_value'],
            mode: p['GlobalSeed //Inspire_mode'],
            action: p['GlobalSeed //Inspire_action'],
            last_seed: p['GlobalSeed //Inspire_last_seed'],
        })
        await flow.PROMPT()
    },
})
