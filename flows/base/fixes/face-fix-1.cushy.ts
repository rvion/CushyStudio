action('😘 fix faces 1', {
    priority: 2,
    help: 'upscale image',
    ui: (form) => ({
        image: form.selectImage('image to upsacle', []),
        model: form.enum({
            enumName: 'Enum_ImpactMMDetDetectorProvider_model_name',
            default: 'bbox/mmdet_anime-face_yolov3.pth',
        }),
        guide: form.enum({ enumName: 'Enum_ImpactDetailerForEach_guide_size_for' as const, default: 'bbox' }),
        // negative: form.strOpt({ textarea: true }),
        // batchSize: form.int({ default: 1 }),
        // seed: form.intOpt({}),
    }),
    // https://comfyanonymous.github.io/ComfyUI_examples/upscale_models/
    run: async (flow, deps) => {
        // flow.print(`batchSize: deps.batchSize`)
        const x = flow.nodes.ImpactFaceDetailer({
            bbox_detector: (f) => f.ImpactMMDetDetectorProvider({ model_name: deps.model }),
            force_inpaint: 'disabled',
            guide_size_for: 'bbox',
            image: flow.loadImageAnswer(deps.image),
            model: flow.AUTO,
            negative: flow.AUTO,
            positive: flow.AUTO,
            noise_mask: 'enabled',
            sam_detection_hint: 'center-1',
            sam_mask_hint_use_negative: 'False',
            sampler_name: 'ddim',
            scheduler: 'karras',
            vae: flow.AUTO,
        })
        flow.nodes.Save_as_webp({ mode: 'lossless', images: x.IMAGE })
        flow.nodes.Save_as_webp({ mode: 'lossless', images: x.IMAGE_1 })
        flow.nodes.SaveImage({ images: x.IMAGE })
        flow.nodes.SaveImage({ images: x.IMAGE_1 })
        await flow.PROMPT()
    },
})

action('😘 fix faces (clip seg)', {
    priority: 2,
    help: 'upscale image',
    ui: (form) => ({
        image: form.selectImage('image to upsacle', []),
        guide: form.enum({ enumName: 'Enum_ImpactDetailerForEach_guide_size_for' as const, default: 'bbox' }),
    }),
    // https://comfyanonymous.github.io/ComfyUI_examples/upscale_models/
    run: async (flow, deps) => {
        // flow.print(`batchSize: deps.batchSize`)
        const x = flow.nodes.ImpactFaceDetailer({
            // bbox_detector: (f) => f.ImpactCLIPSegDetectorProvider({ text: 'face' }),
            bbox_detector: (f) => f.ImpactCLIPSegDetectorProvider({ text: 'face' }),
            force_inpaint: 'enabled',
            guide_size_for: 'crop_region',
            image: flow.loadImageAnswer(deps.image),
            model: flow.AUTO,
            negative: flow.AUTO,
            positive: flow.AUTO,
            noise_mask: 'enabled',
            sam_detection_hint: 'center-1',
            sam_mask_hint_use_negative: 'False',
            sampler_name: 'ddim',
            scheduler: 'karras',
            vae: flow.AUTO,
        })
        flow.nodes.Save_as_webp({ mode: 'lossless', images: x.IMAGE })
        flow.nodes.Save_as_webp({ mode: 'lossless', images: x.IMAGE_1 })
        flow.nodes.SaveImage({ images: x.IMAGE })
        flow.nodes.SaveImage({ images: x.IMAGE_1 })
        await flow.PROMPT()
    },
})
