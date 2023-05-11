WORKFLOW('demo2-test', async ({ graph, flow }) => {
    // generate an empty table
    const fun = (x: string) => `masterpiece, ${x} painting on a wall`

    const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = graph.CLIPTextEncode({ text: fun('white rectangle'), clip: ckpt })
    const negative = graph.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
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
    const image = graph.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    let r1 = await flow.PROMPT()

    const nextBase = graph.WASImageLoad({ image_path: `./output/${r1.images[0].data.filename}` })
    const _vaeEncode = graph.VAEEncode({ pixels: nextBase, vae: ckpt.VAE })
    sampler.set({ latent_image: _vaeEncode })

    for (const item of ['cat', 'dog', 'frog', 'woman']) {
        // n.print('>' + item)
        positive.inputs.text = fun(`(${item}:1.3)`)
        r1 = await flow.PROMPT()
    }
})
