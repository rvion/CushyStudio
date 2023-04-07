WORKFLOW('demo5', async (x) => {
    console.log('test console.log')
    const ckpt = x.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = x.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = x.CLIPTextEncode({ text: 'masterpiece, (chair:1.3)', clip: ckpt })
    const negative = x.CLIPTextEncode({ text: '', clip: ckpt })
    const sampler = x.KSampler({
        seed: x.randomSeed(),
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
    const vae = x.VAEDecode({ samples: sampler, vae: ckpt })

    x.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    await x.get()
})
