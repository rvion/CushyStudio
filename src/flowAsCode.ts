import * as rt from './builder.ts'
const node5 = new rt.EmptyLatentImage({ width: 0 as any, height: 0 as any, batch_size: 0 as any })
const node4 = new rt.CheckpointLoader({ config_name: 0 as any, ckpt_name: 0 as any })
const node6 = new rt.CLIPTextEncode({ text: 0 as any, clip: 0 as any })
const node7 = new rt.CLIPTextEncode({ text: 0 as any, clip: 0 as any })
const node3 = new rt.KSampler({
    model: 0 as any,
    seed: 0 as any,
    steps: 0 as any,
    cfg: 0 as any,
    sampler_name: 0 as any,
    scheduler: 0 as any,
    positive: 0 as any,
    negative: 0 as any,
    latent_image: 0 as any,
    denoise: 0 as any,
})
const node8 = new rt.VAEDecode({ samples: 0 as any, vae: 0 as any })
const node9 = new rt.SaveImage({ images: 0 as any, filename_prefix: 0 as any })
