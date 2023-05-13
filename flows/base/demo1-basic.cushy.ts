action({
    name: 'demo12-basic3',
    run: async (X) => {
        const ckpt = X.nodes.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
        const latent = X.nodes.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
        const positive = X.nodes.CLIPTextEncode({ text: 'masterpiece, (chair:1.3)', clip: ckpt })
        const negative = X.nodes.CLIPTextEncode({ text: '', clip: ckpt })
        const sampler = X.nodes.KSampler({
            seed: X.randomSeed(),
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
        const vae = X.nodes.VAEDecode({ samples: sampler, vae: ckpt })

        X.nodes.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
        await X.PROMPT()
    },
})
