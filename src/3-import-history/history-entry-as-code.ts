import * as rt from '../2-lib/builder.ts'
const CheckpointLoader_4 = new rt.CheckpointLoader({
    config_name: 'v1-inference.yaml',
    ckpt_name: 'v1-5-pruned-emaonly.ckpt',
})
const EmptyLatentImage_5 = new rt.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
const CLIPTextEncode_6 = new rt.CLIPTextEncode({ text: 'masterpiece best quality girl', clip: CheckpointLoader_4.CLIP })
const CLIPTextEncode_7 = new rt.CLIPTextEncode({ text: 'bad hands', clip: CheckpointLoader_4.CLIP })
const KSampler_3 = new rt.KSampler({
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
const VAEDecode_8 = new rt.VAEDecode({ samples: KSampler_3.LATENT, vae: CheckpointLoader_4.VAE })
const SaveImage_9 = new rt.SaveImage({ filename_prefix: 'ComfyUI', images: VAEDecode_8.IMAGE })
