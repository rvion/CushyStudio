WORKFLOW('democnet', async ({ graph, flow }) => {
    const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const vae = graph.VAELoader({ vae_name: 'orangemix.vae.pt' })

    // this is not needed if you work with a local ComfyUI: just use WASImageLoad instead
    const refPoseImgUpload = await flow.uploadAnyFile(flow.resolveAbsolute('/Users/loco/Desktop/pose_present.png')) // <- change this path 🔴
    const refPoseImg = graph.LoadImage({ image: refPoseImgUpload.name as any })

    const sample = graph.KSampler({
        seed: flow.randomSeed(),
        steps: 10,
        cfg: 8,
        sampler_name: 'dpmpp_sde',
        scheduler: 'normal',
        denoise: 1,
        model: ckpt,
        positive: graph.ControlNetApply({
            strength: 1,
            conditioning: graph.CLIPTextEncode({ text: 'masterpiece, 1girl, solo girl', clip: ckpt }),
            control_net: graph.ControlNetLoader({ control_net_name: 'control_openpose-fp16.safetensors' }),
            image: refPoseImg,
        }),
        negative: graph.CLIPTextEncode({ text: 'ugly, naked', clip: ckpt }),
        latent_image: graph.EmptyLatentImage({ width: 1280, height: 704, batch_size: 1 }),
    })

    // save the image
    graph.SaveImage({
        filename_prefix: 'ComfyUI',
        images: graph.VAEDecode({ samples: sample.LATENT, vae: vae.VAE }),
    })

    // start the prompt
    await flow.PROMPT()
})
