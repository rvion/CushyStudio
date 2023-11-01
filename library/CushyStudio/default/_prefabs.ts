/**
 * This file contains all the prefabs that are used in the default card.
 *
 * naming convention:
 *
 * - `ui` functions are prefixed with `ui`
 * - `run` functions are prefixed with `run`
 *
 * make sure you only impot types from this file
 * 🟢 import type {...} from '...'
 * ❌ import {...} from '...'`
 * */
import type { Runtime } from 'src/back/Runtime'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { ReqResult } from 'src/controls/IWidget'
import type { Slot } from 'src/core/Slot'
import type { WidgetPromptOutput } from 'src/prompter/WidgetPromptUI'

// this should be a default
export type OutputFor<UIFn extends (form: FormBuilder) => any> = ReqResult<ReturnType<UIFn>>

// -----------------------------------------------------------
export const uiSampler = (form: FormBuilder) => {
    return form.group({
        items: () => ({
            modelName: form.enum({
                enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
                default: 'revAnimated_v122.safetensors',
                group: 'Model',
            }),
            vae: form.enumOpt({ enumName: 'Enum_VAELoader_vae_name', group: 'Model' }),
            denoise: form.float({ step: 0.01, min: 0, max: 1, default: 1, label: 'Denoise', group: 'KSampler' }),
            steps: form.int({ default: 20, label: 'Steps', min: 0, group: 'KSampler' }),
            cfg: form.float({ label: 'CFG', default: 8.0, group: 'KSampler' }),
            sampler: form.enum({ label: 'Sampler', enumName: 'Enum_KSampler_sampler_name', default: 'euler', group: 'KSampler' }),
            scheduler: form.enum({
                label: 'Scheduler',
                enumName: 'Enum_KSampler_scheduler',
                default: 'karras',
                group: 'KSampler',
            }),
        }),
    })
}

export const runSampler = (p: {
    //
    flow: Runtime
    ckpt: HasSingle_VAE & HasSingle_CLIP
    clipAndModel: HasSingle_CLIP & HasSingle_MODEL
    latent: HasSingle_LATENT
    positive: string
    negative: string
    model: OutputFor<typeof uiSampler>
    preview?: boolean
}): VAEDecode => {
    const graph = p.flow.nodes
    const image = graph.VAEDecode({
        vae: p.ckpt,
        samples: graph.KSampler({
            model: p.clipAndModel,
            seed: p.flow.randomSeed(),
            latent_image: p.latent,
            cfg: p.model.cfg,
            steps: p.model.steps,
            sampler_name: p.model.sampler,
            scheduler: p.model.scheduler,
            denoise: p.model.denoise,
            positive: graph.CLIPTextEncode({
                clip: p.ckpt,
                text: p.positive,
            }),
            negative: graph.CLIPTextEncode({
                clip: p.ckpt,
                text: p.negative,
            }),
        }),
    })
    if (p.preview) graph.PreviewImage({ images: image })
    return image
}
// ---------------------------------------------------------
export const uiThemes = (form: FormBuilder) =>
    form.list({
        element: () =>
            form.group({
                layout: 'H',
                items: () => ({
                    text: form.str({ label: 'Main', textarea: true }), //textarea: true
                    theme: form.list({
                        element: () =>
                            form.group({
                                layout: 'V',
                                items: () => ({
                                    text: form.str({ label: 'Theme', textarea: true }), //textarea: true
                                }),
                            }),
                    }),
                }),
            }),
    })

//-----------------------------------------------------------
// UI PART
export const uiLatent = (form: FormBuilder) => {
    return form.group({
        items: () => ({
            image: form.imageOpt({ group: 'latent' }),
            flip: form.bool({ default: false, group: 'latent' }),
            width: form.int({ default: 512, group: 'latent', step: 128, min: 128, max: 4096 }),
            height: form.int({ default: 768, group: 'latent', step: 128, min: 128, max: 4096 }),
            batchSize: form.int({ default: 1, group: 'latent', min: 1, max: 20 }),
        }),
    })
}

// RUN PART
export const runLatent = async (p: {
    //
    flow: Runtime
    opts: OutputFor<typeof uiLatent>
    vae: _VAE
}) => {
    // init stuff
    const graph = p.flow.nodes
    const opts = p.opts

    // misc calculatiosn
    let width: number | Slot<'INT'>
    let height: number | Slot<'INT'>
    let latent: HasSingle_LATENT

    // case 1. start form image
    if (opts.image) {
        const image = await p.flow.loadImageAnswer(opts.image)
        latent = graph.VAEEncode({ pixels: image, vae: p.vae })
        const size = graph.Image_Size_to_Number({ image: image })
        width = size.outputs.width_int
        height = size.outputs.height_int
    }
    // case 2. start form empty latent
    else {
        width = opts.flip ? opts.height : opts.width
        height = opts.flip ? opts.width : opts.height
        latent = graph.EmptyLatentImage({
            batch_size: opts.batchSize ?? 1,
            height: height,
            width: width,
        })
    }

    // return everything
    return { latent, width, height }
}

// --------------------------------------------------------
export const braceExpansion = (str: string): string[] => {
    const matches = str.match(/{([^{}]+)}/)
    if (!matches) {
        return [str]
    }
    const parts = matches[1].split(',')
    const result: Set<string> = new Set()
    for (const part of parts) {
        const expanded = braceExpansion(str.replace(matches[0], part))
        expanded.forEach((item) => result.add(item))
    }
    return Array.from(result)
}

// --------------------------------------------------------
export const runPrompt = (
    flow: Runtime,
    promptResult: WidgetPromptOutput,
    startingClipAndModel: HasSingle_CLIP & HasSingle_MODEL,
): {
    text: string
    clipAndModel: HasSingle_CLIP & HasSingle_MODEL
} => {
    let text = ''
    const positivePrompt = promptResult
    let clipAndModel = startingClipAndModel
    if (positivePrompt) {
        for (const tok of positivePrompt.tokens) {
            if (tok.type === 'booru') text += ` ${tok.tag.text}`
            else if (tok.type === 'text') text += ` ${tok.text}`
            else if (tok.type === 'embedding') text += ` embedding:${tok.embeddingName}`
            else if (tok.type === 'wildcard') {
                const options = (flow.wildcards as any)[tok.payload]
                if (Array.isArray(options)) text += ` ${flow.pick(options)}`
            } else if (tok.type === 'lora') {
                clipAndModel = flow.nodes.LoraLoader({
                    model: clipAndModel,
                    clip: clipAndModel,
                    lora_name: tok.loraDef.name,
                    strength_clip: tok.loraDef.strength_clip,
                    strength_model: tok.loraDef.strength_model,
                })
            }
        }
    }
    return {
        text,
        clipAndModel,
    }
}

export const uiVaeName = (form: FormBuilder) =>
    form.enumOpt({
        label: 'VAE',
        enumName: 'Enum_VAELoader_vae_name',
    })

export const uiModelName = (form: FormBuilder) =>
    form.enum({
        label: 'Checkpoint',
        enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
    })

export const uiResolutionPicker = (form: FormBuilder) =>
    form.selectOne({
        label: 'Resolution',
        choices: [
            { type: '1024x1024' },
            { type: '896x1152' },
            { type: '832x1216' },
            { type: '768x1344' },
            { type: '640x1536' },
            { type: '1152x862' },
            { type: '1216x832' },
            { type: '1344x768' },
            { type: '1536x640' },
        ],
        tooltip: 'Width x Height',
    })

/** allow to easilly pick a shape */
export const uiShapePickerBasic = (form: FormBuilder) => {
    return form.selectOne({
        label: 'Shape',
        choices: [{ type: 'round' }, { type: 'square' }],
    })
}

/** allow to easilly pick any shape given as parameter */
export const uiShapePickerExt = <const T extends string>(form: FormBuilder, values: T[]) => {
    return form.selectOne({
        label: 'Shape',
        choices: values.map((t) => ({ type: t })),
    })
}
