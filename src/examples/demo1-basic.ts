WORKFLOW('demo1-basic', async (graph, flow) => {
    const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = graph.CLIPTextEncode({ text: 'masterpiece, (chair:1.3)', clip: ckpt })
    const negative = graph.CLIPTextEncode({ text: '', clip: ckpt })
    const sampler = graph.KSampler({
        seed: flow.randomSeed(),
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
    const vae = graph.VAEDecode({ samples: sampler, vae: ckpt })

    graph.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    await flow.PROMPT()
    // super
})
