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
        /** width, defaults to 768 */
        width?: number
        /** heiht, defaults to 512 */
        height?: number
        /** defaults to 1 */
        batchSize?: number
        /** defaults to 30 */
        steps?: number
        /** defaults to 10 */
        cfg?: number
        /** defaults to 'euler_ancestral' */
        sampler_name?: string
        /** defaults to 'karras' */
        scheduler?: string
        /** defaults to 1 */
        denoise?: string
    }) => {
        const ckpt = this.graph.CheckpointLoaderSimple({ ckpt_name: p.ckptName })
        const latent = this.graph.EmptyLatentImage({
            width: p.width ?? 768,
            height: p.height ?? 512,
            batch_size: p.batchSize ?? 1,
        })
        // const vae = this.graph.VAELoader({ vae_name: "vae-ft-mse-840000-ema-pruned.safetensors" })
        const positive = this.graph.CLIPTextEncode({ text: p.positive, clip: ckpt })
        const negative = this.graph.CLIPTextEncode({ text: p.negative, clip: ckpt })
        const sampler = this.graph.KSampler({
            seed: this.flow.randomSeed(),
            steps: p.steps ?? 30,
            cfg: p.cfg ?? 10,
            sampler_name: p.sampler_name ?? 'euler_ancestral',
            scheduler: p.scheduler ?? 'karras',
            denoise: p.denoise ?? 1,
            model: ckpt,
            positive,
            negative,
            latent_image: latent,
        })
        const image = this.graph.VAEDecode({ samples: sampler, vae: ckpt })
        this.graph.SaveImage({ filename_prefix: 'ComfyUI', images: image })
        await this.flow.PROMPT()
        return { ckpt, latent, positive, negative, sampler, image }
    }
}
