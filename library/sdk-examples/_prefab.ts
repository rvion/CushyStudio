// 📝 this file start with an `_` so it does now show up directly in CushySutdio
// this behaviour will be changed once the manifest is ready, but you can use this
// trick for now.

// 📝 Ideally, modular UI kits only import types with `import type {...}`
// and do not import anything else

// Example 1 -------------------------------------------------------------------------------------
// 📝 this is a self-contained UI kit you can use in any card you want.
export const ui_startImage = (form: X.Builder) =>
    form.group({
        items: {
            startImage: form.image({}).optional(),
            width: form.int({ default: 512, step: 128, min: 128, max: 4096 }),
            height: form.int({ default: 512, step: 128, min: 128, max: 4096 }),
            batchSize: form.int({ default: 1, min: 1, max: 20 }),
        },
    })

// Example 2 -------------------------------------------------------------------------------------
// 📝 those  function does not return a group, just a single dictionary of fields
// this is useful if you want to merge those fields with other fields

// 🔶 BE CAREFUL ABOUT THIS NOTATION:
// EXAMPLE 1. () => ({ a: 1 })
// EXAMPLE 2. () => ({ a: 1 })
export const subform_someFields1 = (form: X.Builder) => ({
    startImage: form.image({}).optional(),
    width: form.int({ default: 512, step: 128, min: 128, max: 4096 }),
    height: form.int({ default: 512, step: 128, min: 128, max: 4096 }),
    batchSize: form.int({ default: 1, min: 1, max: 20 }),
})

export const subform_someFields2 = (form: X.Builder) => ({
    X: form.int({ default: 512, step: 128, min: 128, max: 4096 }),
    Y: form.int({ default: 512, step: 128, min: 128, max: 4096 }),
})
