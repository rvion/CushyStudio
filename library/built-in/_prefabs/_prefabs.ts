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
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { GetWidgetResult } from 'src/controls/IWidget'

// this should be a default
export type OutputFor<UIFn extends (form: FormBuilder) => any> = GetWidgetResult<ReturnType<UIFn>>

// const form = getGlobalFormBuilder()
// const flow = getGlobalRuntime()

// HIGH_RES_FIX -----------------------------------------------------------

export const ui_highresfix = (p: { activeByDefault?: true } = {}) => {
    const form = getCurrentForm()
    return form.groupOpt({
        startActive: p.activeByDefault,
        label: 'Upscale Pass (High Res Fix)',
        items: () => ({
            // NNLatentUpscale: form.bool({
            //     default: false,
            //     label: 'NN Latent Upscale?',
            // }),
            upscaleMethod: form.selectOne({
                appearance: 'tab',
                choices: [{ id: 'regular' }, { id: 'Neural 1.5' }, { id: 'Neural XL' }],
                requirements: [{ type: 'customNodesByURI', uri: 'https://github.com/Ttl/ComfyUi_NNLatentUpscale' }],
                tooltip:
                    'regular upscale add more noise, depend your objective. for a second pass to refine stuff, I think adding noise is better',
            }),

            scaleFactor: form.float({ default: 1.5, min: 0.5, max: 8, step: 1 }),
            steps: form.int({ default: 15, min: 0, softMax: 100, step: 10 }),
            denoise: form.float({ min: 0, default: 0.6, max: 1, step: 0.1 }),
            saveIntermediaryImage: form.bool({ default: true }),
            useMainSampler: form.bool({ default: true }),
        }),
    })
}

// ---------------------------------------------------------
export const ui_themes = (form: FormBuilder) =>
    form.list({
        element: () =>
            form.group({
                layout: 'H',
                items: () => ({
                    text: form.string({ label: 'Main', textarea: true }), //textarea: true
                    theme: form.list({
                        element: () =>
                            form.group({
                                layout: 'V',
                                items: () => ({
                                    text: form.string({ label: 'Theme', textarea: true }), //textarea: true
                                }),
                            }),
                    }),
                }),
            }),
    })

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

export const ui_vaeName = (form: FormBuilder) => form.enumOpt.Enum_VAELoader_vae_name({ label: 'VAE' })
export const ui_modelName = (form: FormBuilder) => form.enum.Enum_CheckpointLoaderSimple_ckpt_name({ label: 'Checkpoint' })
export const ui_resolutionPicker = (form: FormBuilder) =>
    form.selectOne({
        label: 'Resolution',
        choices: [
            { id: '1024x1024' },
            { id: '896x1152' },
            { id: '832x1216' },
            { id: '768x1344' },
            { id: '640x1536' },
            { id: '1152x862' },
            { id: '1216x832' },
            { id: '1344x768' },
            { id: '1536x640' },
        ],
        tooltip: 'Width x Height',
    })

/** allow to easilly pick a shape */
export const ui_shapePickerBasic = (form: FormBuilder) => {
    return form.selectOne({
        label: 'Shape',
        choices: [{ id: 'round' }, { id: 'square' }],
    })
}

/** allow to easilly pick any shape given as parameter */
export const ui_shapePickerExt = <const T extends string>(form: FormBuilder, values: T[]) => {
    return form.selectOne({
        label: 'Shape',
        choices: values.map((t) => ({ id: t })),
    })
}
