export default WORKFLOW(async (n) => {
    
    
    const ckpt = n.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = n.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = n.CLIPTextEncode({ text: 'masterpiece, (chair:1.3)', clip: ckpt })
    const negative = n.CLIPTextEncode({ text: '', clip: ckpt })
    const sampler = n.KSampler({ seed: n.randomSeed(), steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal', denoise: 0.8, model: ckpt, positive, negative, latent_image: latent })
    const vae = n.VAEDecode({ samples: sampler, vae: ckpt })

    n.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    await n.get()
})
