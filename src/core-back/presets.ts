import type { LATER } from 'LATER'
import type { Graph } from '../core-shared/Graph'
import type { IFlowExecution } from 'src/sdk/IFlowExecution'

/** high level library */
export class Presets {
    constructor(
        //
        public graph: Graph & LATER<'ComfySetup'>,
        public flow: IFlowExecution,
    ) {}

    basicImageGeneration = async (p: {
        //
        ckptName: LATER<'Enum_CheckpointLoader_ckpt_name'>
        positive: string
        negative: string
    }) => {
        const ckpt = this.graph.CheckpointLoaderSimple({ ckpt_name: p.ckptName })
        const latent = this.graph.EmptyLatentImage({ width: 768, height: 512, batch_size: 1 })
        // const vae = this.graph.VAELoader({ vae_name: "vae-ft-mse-840000-ema-pruned.safetensors" })
        const positive = this.graph.CLIPTextEncode({ text: p.positive, clip: ckpt })
        const negative = this.graph.CLIPTextEncode({ text: p.negative, clip: ckpt })
        const sampler = this.graph.KSampler({ seed: this.flow.randomSeed(), steps: 30, cfg: 10, sampler_name: "euler", scheduler: "normal", denoise: 1, model: ckpt, positive, negative, latent_image: latent, }) // prettier-ignore
        const image = this.graph.VAEDecode({ samples: sampler, vae: ckpt })
        this.graph.SaveImage({ filename_prefix: 'ComfyUI', images: image })
        await this.flow.PROMPT()
        return { ckpt, latent, positive, negative, sampler, image }
    }
}
