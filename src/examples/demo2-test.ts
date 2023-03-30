export default WORKFLOW(async (x) => {
    // generate an empty table
    const fun = (x: string) => `masterpiece, womain looking at painting of a ${x}, museum`

    const ckpt = x.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = x.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = x.CLIPTextEncode({ text: fun('white rectangle'), clip: ckpt })
    const negative = x.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
    const sampler = x.KSampler({ seed: x.randomSeed(), steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal', denoise: 0.8, model: ckpt, positive, negative, latent_image: latent, })
    const vae = x.VAEDecode({ samples: sampler, vae: ckpt })
    const image = x.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    let r1 = await x.get()

    // x.print(x.convertToImageInput(r1.images[0]))
    // use that table to put objects on top of it
    x.print(`./output/${r1.images[0].data.filename}`)
    const nextBase = x.ImageLoad({ image_path: `./output/${r1.images[0].data.filename}` })
    const _vaeEncode = x.VAEEncode({ pixels: nextBase, vae: ckpt.VAE })
    sampler.set({ latent_image: _vaeEncode })

    for (const item of ['cat', 'dog', 'frog', 'woman']) {
        x.print('>' + item)
        positive.inputs.text = fun(`(${item}:1.3)`)
        r1 = await x.get()
    }
})
