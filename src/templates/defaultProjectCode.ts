import { nanoid } from 'nanoid'

export const defaultScript: string = `WORKFLOW('${nanoid()}',async (x) => {
    // generate an empty table
    const ckpt = x.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
    const latent = x.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
    const positive = x.CLIPTextEncode({ text: 'masterpiece, chair', clip: ckpt })
    const negative = x.CLIPTextEncode({ text: '', clip: ckpt })
    const sampler = x.KSampler({ seed: 2123, steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal', denoise: 0.8, model: ckpt, positive, negative, latent_image: latent })
    const vae = x.VAEDecode({ samples: sampler, vae: ckpt })

    x.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
    await x.get()
})`
