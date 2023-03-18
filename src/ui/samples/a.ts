export const a__: string = `export {}
const ckpt = C.CheckpointLoader({ config_name: 'v1-inference_clip_skip_2.yaml', ckpt_name: 'v1-5-pruned-emaonly.ckpt' })
const latent_image = C.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
const positive = C.CLIPTextEncode({ text: 'masterpiece cat', clip: ckpt })
const negative = C.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
const sampler = C.KSampler({ seed: 8566257, steps: 20, cfg: 8, sampler_name: 'euler', scheduler: 'normal', denoise: 1, model: ckpt, positive, negative, latent_image, }) // prettier-ignore
const vae = C.VAEDecode({ samples: sampler, vae: ckpt })
const image = C.SaveImage({ filename_prefix: 'ComfyUI', images: vae })

let batchSize = 1
do {
    // sampler.inputs.cfg = 10
    latent_image.inputs.batch_size = batchSize++
    await C.get()
} while ( await C.askBoolean('Continue?') )

`
