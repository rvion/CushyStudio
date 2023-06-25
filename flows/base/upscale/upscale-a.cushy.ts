action('💗 upscale', {
    priority: 2,
    help: 'upscale image',
    ui: (form) => ({
        image: form.selectImage('image to upsacle', []),
        amount: form.enum({ enumName: 'Enum_UpscaleModelLoader_model_name' }),
        // negative: form.strOpt({ textarea: true }),
        // batchSize: form.int({ default: 1 }),
        // seed: form.intOpt({}),
    }),
    // https://comfyanonymous.github.io/ComfyUI_examples/upscale_models/
    run: async (flow, deps) => {
        // flow.print(`batchSize: deps.batchSize`)
        flow.nodes.SaveImage({
            images: (t) =>
                t.ImageUpscaleWithModel({
                    image: flow.AUTO,
                    upscale_model: (t) =>
                        t.UpscaleModelLoader({
                            model_name: 'RealESRGAN_x4.pth',
                        }),
                }),
        })
        await flow.PROMPT()
    },
})
