export default WORKFLOW(async (C) => {
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
})
