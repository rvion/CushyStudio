WORKFLOW('demo3-abc', async (graph, flow) => {
    // generate an empty table
    const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = graph.CLIPTextEncode({ text: 'masterpiece super table anime', clip: ckpt })
    const negative = graph.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
    const sampler = graph.KSampler({
        seed: 2123,
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
    const image = graph.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    let r1 = await flow.PROMPT()

    // 🔴 ERROR V
    const image_path = r1.images[0].data.filename
    graph.WASImageLoad({ image_path })

    // use that table to put objects on top of it
    const _ipt = r1.images[0].convertToImageInput()
    // @ts-ignore
    const nextBase = graph.LoadImage({ image: _ipt })
    const _vaeEncode = graph.VAEEncode({ pixels: nextBase, vae: ckpt.VAE })
    sampler.set({ latent_image: _vaeEncode })

    for (const item of ['cat', 'dog', 'frog', 'woman']) {
        positive.inputs.text = `masterpiece, (${item}:1.3), on table`
        r1 = await flow.PROMPT()
    }
})
