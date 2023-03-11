// import { Comfy } from '../core/Comfy'
// import { ComfyManager } from '../core/ComfyManager'
// import { ComfyProject } from '../core/ComfyProject'

import { ComfyServerInfos } from '../core/ComfyServerInfos'

const backend = new ComfyServerInfos()
const client = await backend.connect()
// const M = new ComfyManager()
// export const C = new ComfyProject(M)
// export const G = C.script

// export const ckpt = C.CheckpointLoader({ config_name: 'v1-inference_clip_skip_2.yaml', ckpt_name: 'v1-5-pruned-emaonly.ckpt' }) // prettier-ignore
// export const latent_image = C.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
// export const positive = C.CLIPTextEncode({ text: 'masterpiece cat', clip: ckpt })
// export const negative = C.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
// export const sampler = C.KSampler({ seed: 8566257, steps: 20, cfg: 8, sampler_name: 'euler', scheduler: 'normal', denoise: 1, model: ckpt, positive, negative, latent_image, }) // prettier-ignore
// export const vae = C.VAEDecode({ samples: sampler, vae: ckpt })
// export const image = C.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
