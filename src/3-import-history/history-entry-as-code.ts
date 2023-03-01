import { Comfy } from '../2-lib/builder.ts'
export const c = new Comfy()
export const CheckpointLoader_4 = c.CheckpointLoader({
    config_name: 'v1-inference.yaml',
    ckpt_name: 'v1-5-pruned-emaonly.ckpt',
})
export const EmptyLatentImage_5 = c.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
export const CLIPTextEncode_6 = c.CLIPTextEncode({
    text: 'masterpiece best quality girl',
    clip: CheckpointLoader_4.CLIP,
})
export const CLIPTextEncode_7 = c.CLIPTextEncode({ text: 'bad hands', clip: CheckpointLoader_4.CLIP })
export const KSampler_3 = c.KSampler({
    seed: 8566257,
    steps: 20,
    cfg: 8,
    sampler_name: 'sample_euler',
    scheduler: 'normal',
    denoise: 1,
    model: CheckpointLoader_4.MODEL,
    positive: CLIPTextEncode_6.CONDITIONING,
    negative: CLIPTextEncode_7.CONDITIONING,
    latent_image: EmptyLatentImage_5.LATENT,
})
export const VAEDecode_8 = c.VAEDecode({ samples: KSampler_3.LATENT, vae: CheckpointLoader_4.VAE })
export const SaveImage_9 = c.SaveImage({ filename_prefix: 'ComfyUI', images: VAEDecode_8.IMAGE })
