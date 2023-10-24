/**
 * 📝 This file showcase how you can modularize your form definitions
 * so you can re-use parts
 *
 * ✅ please, don't use `import` import this file, except for `import types`
 *
 */

import type { FormBuilder } from 'src/controls/InfoRequest'

export class UI_Helper {
    /**
     * 👇 here, I make sure `form` builder is always available
     * though `this.form` in the rest of the methods
     */
    constructor(private form: FormBuilder) {}

    vae = () =>
        this.form.enumOpt({
            label: 'VAE',
            enumName: 'Enum_VAELoader_vae_name',
        })

    modelName = () =>
        this.form.enum({
            label: 'Checkpoint',
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
        })

    /**
     * pick a resolution until this rvion guy build a proper widget for it
     * (which he has, but I'm not aware of yet because he didn't really make it visible)
     */
    resolutionPicker = () =>
        this.form.selectOne({
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
    shapePicker = () => {
        return this.form.selectOne({
            label: 'Shape',
            choices: [{ type: 'round' }, { type: 'square' }],
        })
    }

    /** allow to easilly pick any shape given as parameter */
    shapePicker2 = <const T extends string>(values: T[]) => {
        return this.form.selectOne({
            label: 'Shape',
            choices: values.map((t) => ({ type: t })),
        })
    }
}
