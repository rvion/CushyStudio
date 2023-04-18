WORKFLOW('demo4-cnet', async ({ graph, flow }) => {
    // generate an empty table
    const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })

    // setup initial image
    const positive = graph.CLIPTextEncode({ text: 'masterpiece, 1girl, walking, alone, white_background', clip: ckpt })
    const control_net = graph.ControlNetLoader({ control_net_name: 'control_openpose-fp16.safetensors' })
    const upload = await flow.uploadWorkspaceFile(flow.resolveRelative(`images/test-0.png`))
    // @ts-ignore
    const img = graph.LoadImage({ image: upload.name })
    const control_net_apply = graph.ControlNetApply({ conditioning: positive, control_net, image: img, strength: 1 })
    const negative = graph.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
    const sampler = graph.KSampler({
        seed: 200,
        steps: 20,
        cfg: 10,
        sampler_name: 'euler',
        scheduler: 'normal',
        denoise: 0.8,
        model: ckpt,
        positive: control_net_apply,
        negative,
        latent_image: latent,
    })
    const vae = graph.VAEDecode({ samples: sampler, vae: ckpt })
    const image = graph.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    let r1 = await flow.PROMPT()

    for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        // use previous output as base
        const nextBase = graph.WASImageLoad({ image_path: r1.images[0].data.filename })
        const _vaeEncode = graph.VAEEncode({ pixels: nextBase, vae: ckpt.VAE })
        sampler.set({ latent_image: _vaeEncode })

        // use connect frame as input
        const nextGuideUpload = await flow.uploadWorkspaceFile(flow.resolveRelative(`/images/test-${i}.png`))
        // @ts-ignore
        const nextGuide = graph.LoadImage({ image: nextGuideUpload.name })
        control_net_apply.set({ image: nextGuide })
        r1 = await flow.PROMPT()
    }
    // for (const item of ['cat',/*'dog','frog','woman'*/]) {
    //     // @ts-ignore
    //     positive.inputs.text =  `masterpiece, (${item}:1.3), on table`
    //     r1 = await C.get()
    // }
})
