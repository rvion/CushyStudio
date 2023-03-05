import { Comfy } from '../core/dsl'

export const C = new Comfy()

export const ckpt = C.CheckpointLoader(
    { config_name: 'v1-inference_clip_skip_2.yaml', ckpt_name: 'v1-5-pruned-emaonly.ckpt' },
    '4',
)
export const latent = C.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 }, '5')
export const positive = C.CLIPTextEncode({ text: 'masterpiece cat', clip: ckpt.CLIP }, '6')
export const negative = C.CLIPTextEncode({ text: 'bad hands', clip: ckpt.CLIP }, '7')
export const sampler = C.KSampler(
    {
        seed: 8566257,
        steps: 20,
        cfg: 8,
        sampler_name: 'euler',
        scheduler: 'normal',
        denoise: 1,
        model: ckpt.MODEL,
        positive: positive.CONDITIONING,
        negative: negative.CONDITIONING,
        latent_image: latent.LATENT,
    },
    '3',
)
export const vae = C.VAEDecode({ samples: sampler.LATENT, vae: ckpt.VAE }, '8')
export const image = C.SaveImage({ filename_prefix: 'ComfyUI', images: vae.IMAGE }, '9')
