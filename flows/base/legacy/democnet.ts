action('democnet', {
    run: async ($) => {
        const ckpt = $.nodes.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
        const vae = $.nodes.VAELoader({ vae_name: 'orangemix.vae.pt' })

        // this is not needed if you work with a local ComfyUI: just use WASImageLoad instead
        const refPoseImgUpload = await $.uploadAnyFile($.resolveAbsolute('/Users/loco/Desktop/pose_present.png')) // <- change this path 🔴
        const refPoseImg = $.nodes.LoadImage({ image: refPoseImgUpload.name as any })

        const sample = $.nodes.KSampler({
            seed: $.randomSeed(),
            steps: 10,
            cfg: 8,
            sampler_name: 'dpmpp_sde',
            scheduler: 'normal',
            denoise: 1,
            model: ckpt,
            positive: $.nodes.ControlNetApply({
                strength: 1,
                conditioning: $.nodes.CLIPTextEncode({ text: 'masterpiece, 1girl, solo girl', clip: ckpt }),
                control_net: $.nodes.ControlNetLoader({ control_net_name: 'control_openpose-fp16.safetensors' }),
                image: refPoseImg,
            }),
            negative: $.nodes.CLIPTextEncode({ text: 'ugly, naked', clip: ckpt }),
            latent_image: $.nodes.EmptyLatentImage({ width: 1280, height: 704, batch_size: 1 }),
        })

        // save the image
        $.nodes.SaveImage({
            filename_prefix: 'ComfyUI',
            images: $.nodes.VAEDecode({ samples: sample.LATENT, vae: vae.VAE }),
        })

        // start the prompt
        await $.PROMPT()
    },
})
