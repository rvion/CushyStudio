import { Template } from './Template'

export const demoLibrary: Template[] = [
    // lazy load
    new Template(
        'demo1-basic',
        `export default WORKFLOW(async (comfy) => {
    const ckpt = comfy.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = comfy.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = comfy.CLIPTextEncode({ text: 'masterpiece, (chair:1.3)', clip: ckpt })
    const negative = comfy.CLIPTextEncode({ text: '', clip: ckpt })
    const sampler = comfy.KSampler({ seed: comfy.randomSeed(), steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal', denoise: 0.8, model: ckpt, positive, negative, latent_image: latent })
    const vae = comfy.VAEDecode({ samples: sampler, vae: ckpt })

    comfy.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    await comfy.get()
})
`,
    ),
    new Template(
        'demo2-test',
        `export default WORKFLOW(async (n) => {
    // generate an empty table
    const fun = (x: string) => \`masterpiece, womain looking at painting of a \${x}, museum\`

    const ckpt = n.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = n.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = n.CLIPTextEncode({ text: fun('white rectangle'), clip: ckpt })
    const negative = n.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
    const sampler = n.KSampler({ seed: n.randomSeed(), steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal', denoise: 0.8, model: ckpt, positive, negative, latent_image: latent, })
    const vae = n.VAEDecode({ samples: sampler, vae: ckpt })
    const image = n.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    let r1 = await n.get()

    const nextBase = n.WASImageLoad({ image_path: \`./output/\${r1.images[0].data.filename}\` })
    const _vaeEncode = n.VAEEncode({ pixels: nextBase, vae: ckpt.VAE })
    sampler.set({ latent_image: _vaeEncode })

    for (const item of ['cat', 'dog', 'frog', 'woman']) {
        // n.print('>' + item)
        positive.inputs.text = fun(\`(\${item}:1.3)\`)
        r1 = await n.get()
    }
})

`,
    ),

    new Template(
        'demo3-cnet-pose',
        `export default WORKFLOW(async (C) => {
    const ckpt = C.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const vae = C.VAELoader({ vae_name: 'orangemix.vae.pt' })

    // this is not needed if you work with a local ComfyUI: just use WASImageLoad instead
    const refPoseImgUpload = await C.uploadImgFromDisk('/Users/loco/Desktop/pose_present.png') // <- change this path 🔴
    const refPoseImg = C.LoadImage({ image: refPoseImgUpload.name as any })

    const sample = C.KSampler({
        seed: C.randomSeed(),
        steps: 10,
        cfg: 8,
        sampler_name: 'dpmpp_sde',
        scheduler: 'normal',
        denoise: 1,
        model: ckpt,
        positive: C.ControlNetApply({
            strength: 1,
            conditioning: C.CLIPTextEncode({ text: 'masterpiece, 1girl, solo girl', clip: ckpt }),
            control_net: C.ControlNetLoader({ control_net_name: 'control_openpose-fp16.safetensors' }),
            image: refPoseImg,
        }),
        negative: C.CLIPTextEncode({ text: 'ugly, naked', clip: ckpt }),
        latent_image: C.EmptyLatentImage({ width: 1280, height: 704, batch_size: 1 }),
    })

    // save the image
    C.SaveImage({
        filename_prefix: 'ComfyUI',
        images: C.VAEDecode({ samples: sample.LATENT, vae: vae.VAE }),
    })

    // start the prompt
    await C.get()
})`,
    ),
]
