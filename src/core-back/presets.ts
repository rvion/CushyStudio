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
        loras?: {
            name: LATER<'Enum_LoraLoader_lora_name'>
            /** defaults to 1 */
            strength_clip?: number
            /** defaults to 1 */
            strength_model?: number
        }[]
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
        sampler_name?: LATER<'Enum_KSampler_sampler_name'>
        /** defaults to 'karras' */
        scheduler?: LATER<'Enum_KSampler_scheduler'>
        /** defaults to 1 */
        denoise?: number
    }) => {
        const ckpt = this.graph.CheckpointLoaderSimple({ ckpt_name: p.ckptName })
        const latent = this.graph.EmptyLatentImage({
            width: p.width ?? 768,
            height: p.height ?? 512,
            batch_size: p.batchSize ?? 1,
        })

        let clipAndModel: LATER<'HasSingle_CLIP'> & LATER<'HasSingle_MODEL'> = ckpt

        for (const lora of p.loras ?? []) {
            clipAndModel = this.graph.LoraLoader({
                model: clipAndModel,
                clip: clipAndModel,
                lora_name: lora.name,
                strength_clip: lora.strength_clip ?? 1.0,
                strength_model: lora.strength_model ?? 1.0,
            })
        }
        // const vae = this.graph.VAELoader({ vae_name: "vae-ft-mse-840000-ema-pruned.safetensors" })
        const positive = this.graph.CLIPTextEncode({ text: p.positive, clip: clipAndModel })
        const negative = this.graph.CLIPTextEncode({ text: p.negative, clip: clipAndModel })
        const sampler = this.graph.KSampler({
            seed: this.flow.randomSeed(),
            steps: p.steps ?? 30,
            cfg: p.cfg ?? 10,
            sampler_name: p.sampler_name ?? 'euler_ancestral',
            scheduler: p.scheduler ?? 'karras',
            denoise: p.denoise ?? 1,
            model: clipAndModel,
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
