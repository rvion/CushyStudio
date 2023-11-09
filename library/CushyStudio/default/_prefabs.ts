/**
 * This file contains all the prefabs that are used in the default card.
 *
 * naming convention:
 *
 * - `ui`  functions are prefixed with `ui_`
 * - `run` functions are prefixed with `run_`
 *
 * make sure you only impot types from this file
 * 🟢 import type {...} from '...'
 * ❌ import {...} from '...'`
 * */
import type { Runtime } from 'src/back/Runtime'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { ReqResult } from 'src/controls/IWidget'
import type { Slot } from 'src/core/Slot'
import type { WidgetPromptOutput } from 'src/widgets/prompter/WidgetPromptUI'

// this should be a default
export type OutputFor<UIFn extends (form: FormBuilder) => any> = ReqResult<ReturnType<UIFn>>

// const form = getGlobalFormBuilder()
// const flow = getGlobalRuntime()

// HIGH_RES_FIX -----------------------------------------------------------

export const ui_highresfix = (form: FormBuilder) =>
    form.groupOpt({
        items: () => ({
            scaleFactor: form.int({ default: 1 }),
            steps: form.int({ default: 15 }),
            denoise: form.float({ min: 0, default: 0.5, max: 1, step: 0.01 }),
            saveIntermediaryImage: form.bool({ default: true }),
        }),
    })

// ---------------------------------------------------------
export const ui_themes = (form: FormBuilder) =>
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
export const ui_latent = (form: FormBuilder) => {
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
export const run_latent = async (p: {
    //
    flow: Runtime
    opts: OutputFor<typeof ui_latent>
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
export const util_expandBrances = (str: string): string[] => {
    const matches = str.match(/{([^{}]+)}/)
    if (!matches) {
        return [str]
    }
    const parts = matches[1].split(',')
    const result: Set<string> = new Set()
    for (const part of parts) {
        const expanded = util_expandBrances(str.replace(matches[0], part))
        expanded.forEach((item) => result.add(item))
    }
    return Array.from(result)
}

// --------------------------------------------------------
export const run_prompt = (
    flow: Runtime,
    p: {
        richPrompt: WidgetPromptOutput
        clip: _CLIP
        ckpt: _MODEL
    },
): {
    text: string
    clip: _CLIP
    ckpt: _MODEL
    conditionning: _CONDITIONING
} => {
    let text = ''
    const richPrompt = p.richPrompt
    let clip = p.clip
    let ckpt = p.ckpt
    if (richPrompt) {
        for (const tok of richPrompt.tokens) {
            if (tok.type === 'booru') text += ` ${tok.tag.text}`
            else if (tok.type === 'text') text += ` ${tok.text}`
            else if (tok.type === 'embedding') text += ` embedding:${tok.embeddingName}`
            else if (tok.type === 'wildcard') {
                const options = (flow.wildcards as any)[tok.payload]
                if (Array.isArray(options)) text += ` ${flow.pick(options)}`
            } else if (tok.type === 'lora') {
                const next = flow.nodes.LoraLoader({
                    model: ckpt,
                    clip: clip,
                    lora_name: tok.loraDef.name,
                    strength_clip: tok.loraDef.strength_clip,
                    strength_model: tok.loraDef.strength_model,
                })
                clip = next._CLIP
                ckpt = next._MODEL
            }
        }
    }
    const conditionning = flow.nodes.CLIPTextEncode({ clip, text })
    return { text, conditionning, clip, ckpt }
}

export const ui_vaeName = (form: FormBuilder) =>
    form.enumOpt({
        label: 'VAE',
        enumName: 'Enum_VAELoader_vae_name',
    })

export const ui_modelName = (form: FormBuilder) =>
    form.enum({
        label: 'Checkpoint',
        enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
    })

export const ui_resolutionPicker = (form: FormBuilder) =>
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
export const ui_shapePickerBasic = (form: FormBuilder) => {
    return form.selectOne({
        label: 'Shape',
        choices: [{ type: 'round' }, { type: 'square' }],
    })
}

/** allow to easilly pick any shape given as parameter */
export const ui_shapePickerExt = <const T extends string>(form: FormBuilder, values: T[]) => {
    return form.selectOne({
        label: 'Shape',
        choices: values.map((t) => ({ type: t })),
    })
}
