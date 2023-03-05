import { Comfy } from '../core/dsl'

export const demo = new Comfy()
export const CheckpointLoader_4 = demo.CheckpointLoader(
    { config_name: 'v1-inference.yaml', ckpt_name: 'v1-5-pruned-emaonly.ckpt' },
    '4',
)
export const EmptyLatentImage_5 = demo.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 }, '5')
export const CLIPTextEncode_6 = demo.CLIPTextEncode(
    { text: 'masterpiece cat', clip: CheckpointLoader_4.CLIP },
    '6',
)
export const CLIPTextEncode_7 = demo.CLIPTextEncode({ text: 'bad hands', clip: CheckpointLoader_4.CLIP }, '7')
export const sampler = demo.KSampler(
    {
        seed: 8566257,
        steps: 20,
        cfg: 8,
        sampler_name: 'euler',
        scheduler: 'normal',
        denoise: 1,
        model: CheckpointLoader_4.MODEL,
        positive: CLIPTextEncode_6.CONDITIONING,
        negative: CLIPTextEncode_7.CONDITIONING,
        latent_image: EmptyLatentImage_5.LATENT,
    },
    '3',
)
export const VAEDecode_8 = demo.VAEDecode({ samples: sampler.LATENT, vae: CheckpointLoader_4.VAE }, '8')
export const image = demo.SaveImage({ filename_prefix: 'ComfyUI', images: VAEDecode_8.IMAGE }, '9')
