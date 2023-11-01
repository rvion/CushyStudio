// 📝 Ideally, modular UI kits only import types with `import type {...}`
// and do not import anything else
import type { FormBuilder } from 'src/controls/FormBuilder'

// 📝 this is a self-contained UI kit you can use in any card you want.
export const subform_startImage = (form: FormBuilder) =>
    form.group({
        items: () => ({
            startImage: form.imageOpt({ group: 'latent' }),
            width: form.int({ default: 512, group: 'latent', step: 128, min: 128, max: 4096 }),
            height: form.int({ default: 512, group: 'latent', step: 128, min: 128, max: 4096 }),
            batchSize: form.int({ default: 1, group: 'latent', min: 1, max: 20 }),
        }),
    })

// 📝 this file start with an `_` so it does now show up directly in CushySutdio
// this behaviour will be changed once the manifest is ready, but you can use this
// trick for now.
