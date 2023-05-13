/**
 * this module must not import anything from src/core-back
 * the LATER type is used to reference types that may or may not be available on users machines, depending
 * on the node suite they have setup
 */

import { Workflow } from 'src/back/FlowRun'
import type { LATER } from 'LATER'
// import type { WorkflowBuilder } from 'src/core/WorkflowFn'

export type SimplifiedLoraDef = {
    name: LATER<'Enum_LoraLoader_lora_name'>
    /** defaults to 1 */
    strength_clip?: number
    /** defaults to 1 */
    strength_model?: number
}

/** high level library */
export class Presets {
    constructor(public flow: Workflow) {}

    prompt = (pos: string, neg: string) => {
        // const { graph, flow, AUTO } = this.ctx
        const graph = this.flow.nodes
        const flow = this.flow

        return graph.KSampler({
            seed: flow.randomSeed(),
            latent_image: graph.EmptyLatentImage({}),
            model: flow.AUTO,
            positive: graph.CLIPTextEncode({ clip: flow.AUTO, text: 'hello' }),
            negative: graph.CLIPTextEncode({ clip: flow.AUTO, text: 'world' }),
            sampler_name: 'ddim',
            scheduler: 'karras',
        })
    }

    loadModel = (p: {
        ckptName: LATER<'Enum_CheckpointLoader_ckpt_name'>
        stop_at_clip_layer?: number
        vae?: LATER<'Enum_VAELoader_vae_name'>
        loras?: SimplifiedLoraDef[]
        /**
         * makes the model faster at the cost of quality.
         * I was told it can speed up generation by up to 1.5x
         * default to false
         * suggested values: (thanks @kdc_th)
         * - 0.3 if you have a good gpu. it barely affects the quality while still giving you a speed increase
         * - 0.5-0.6 is still serviceable
         */
        tomeRatio?: number | false
    }): {
        ckpt: LATER<'CheckpointLoaderSimple'>
        clip: LATER<'CLIP'>
        model: LATER<'MODEL'>
        vae: LATER<'VAE'>
    } => {
        const graph = this.flow.nodes
        const flow = this.flow

        // model and loras
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.ckptName })
        let clipAndModel: LATER<'HasSingle_CLIP'> & LATER<'HasSingle_MODEL'> = ckpt
        for (const lora of p.loras ?? []) {
            clipAndModel = graph.LoraLoader({
                model: clipAndModel,
                clip: clipAndModel,
                lora_name: lora.name,
                strength_clip: lora.strength_clip ?? 1.0,
                strength_model: lora.strength_model ?? 1.0,
            })
        }
        let clip = clipAndModel._CLIP
        let model = clipAndModel._MODEL
        if (p.stop_at_clip_layer) {
            clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: p.stop_at_clip_layer }).CLIP
        }

        // vae
        let vae: LATER<'VAE'> = ckpt._VAE
        if (p.vae) vae = graph.VAELoader({ vae_name: p.vae }).VAE

        // patch
        if (p.tomeRatio != null && p.tomeRatio !== false) {
            const tome = graph.TomePatchModel({ model, ratio: p.tomeRatio })
            model = tome.MODEL
        }
        return { ckpt, clip, model, vae }
    }

    basicImageGeneration = async (p: {
        //
        ckptName: LATER<'Enum_CheckpointLoader_ckpt_name'>
        loras?: SimplifiedLoraDef[]
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
        const graph = this.flow.nodes
        const flow = this.flow
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.ckptName })

        let clipAndModel: LATER<'HasSingle_CLIP'> & LATER<'HasSingle_MODEL'> = ckpt

        for (const lora of p.loras ?? []) {
            clipAndModel = graph.LoraLoader({
                model: clipAndModel,
                clip: clipAndModel,
                lora_name: lora.name,
                strength_clip: lora.strength_clip ?? 1.0,
                strength_model: lora.strength_model ?? 1.0,
            })
        }

        // const vae = graph.VAELoader({ vae_name: "vae-ft-mse-840000-ema-pruned.safetensors" })
        const latent = graph.EmptyLatentImage({
            width: p.width ?? 768,
            height: p.height ?? 512,
            batch_size: p.batchSize ?? 1,
        })
        const positive = graph.CLIPTextEncode({ text: p.positive, clip: clipAndModel })
        const negative = graph.CLIPTextEncode({ text: p.negative, clip: clipAndModel })
        const sampler = graph.KSampler({
            seed: flow.randomSeed(),
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
        const image = graph.VAEDecode({ samples: sampler, vae: ckpt })
        graph.SaveImage({ filename_prefix: 'ComfyUI', images: image })
        await flow.PROMPT()
        return { ckpt, latent, positive, negative, sampler, image }
    }
}
