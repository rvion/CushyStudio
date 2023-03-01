import * as rt from './builder.ts'
const node5 = new rt.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
const node4 = new rt.CheckpointLoader({ config_name: 'v1-inference.yaml', ckpt_name: 'v1-5-pruned-emaonly.ckpt' })
const node6 = new rt.CLIPTextEncode({ clip: 0 as any, text: 'masterpiece best quality girl' })
const node7 = new rt.CLIPTextEncode({ clip: 0 as any, text: 'bad hands' })
const node3 = new rt.KSampler({
    model: 0 as any,
    positive: 0 as any,
    negative: 0 as any,
    latent_image: 0 as any,
    seed: 8566257,
    steps: true,
    cfg: 20,
    sampler_name: 8,
    scheduler: 'sample_euler',
    denoise: 'normal',
})
const node8 = new rt.VAEDecode({ samples: 0 as any, vae: 0 as any })
const node9 = new rt.SaveImage({ images: 0 as any, filename_prefix: 'ComfyUI' })
