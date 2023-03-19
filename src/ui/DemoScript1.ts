export const DemoScript1: string = `export {}

const ckpt = C.CheckpointLoader({ config_name: 'v1-inference_clip_skip_2.yaml', ckpt_name: 'v1-5-pruned-emaonly.ckpt' })
const latent = C.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })

const TOPIC = await C.askString('what is your subject about? (e.g. "cat")', 'cat')

const positive = C.CLIPTextEncode({ text: 'masterpiece '+ TOPIC, clip: ckpt })
const negative = C.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
const sampler = C.KSampler({ seed: ${
    Math.round(Math.random() * 1000) /*8566257*/
}, steps: 20, cfg: 8, sampler_name: 'euler', scheduler: 'normal', denoise: 1, model: ckpt, positive, negative, latent_image: latent })
const vae = C.VAEDecode({ samples: sampler, vae: ckpt })
const image = C.SaveImage({ filename_prefix: 'ComfyUI', images: vae })

do {
    await C.get()
    latent.inputs.batch_size++
    // sampler.inputs.seed ++
} while (
    await C.askBoolean('Continue and increase batch size?')
)
`
