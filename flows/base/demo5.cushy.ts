action('demo5', {
    run: async ($) => {
        console.log('test console.log')
        const ckpt = $.nodes.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
        const latent = $.nodes.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
        const positive = $.nodes.CLIPTextEncode({ text: 'masterpiece, (chair:1.3)', clip: ckpt })
        const negative = $.nodes.CLIPTextEncode({ text: '', clip: ckpt })
        const sampler = $.nodes.KSampler({
            seed: $.randomSeed(),
            steps: 20,
            cfg: 10,
            sampler_name: 'euler',
            scheduler: 'normal',
            denoise: 0.8,
            model: ckpt,
            positive,
            negative,
            latent_image: latent,
        })
        const vae = $.nodes.VAEDecode({ samples: sampler, vae: ckpt })

        $.nodes.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
        await $.PROMPT()
    },
})
