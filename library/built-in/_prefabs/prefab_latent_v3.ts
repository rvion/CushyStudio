import type { FormBuilder } from '../../../src/controls/FormBuilder'

import { run_LatentShapeGenerator, ui_LatentShapeGenerator, type UI_LatentShapeGenerator } from '../shapes/prefab_shapes'

export type UI_LatentV3 = X.XChoice<{
    emptyLatent: X.XGroup<{
        batchSize: X.Shared<X.XNumber>
        size: X.XSize
    }>
    image: X.XGroup<{
        batchSize: X.Shared<X.XNumber>
        image: X.XImage
        resize: X.XOptional<
            X.XGroup<{
                mode: X.XEnum<Enum_CR_Upscale_Image_mode>
                supersample: X.XEnum<Enum_ImageDrawRectangleRounded_top_left_corner>
                resampling: X.XEnum<Enum_SEGSUpscaler_resampling_method>
                rescale_factor: X.XNumber
                resize_width: X.XNumber
                resize_height: X.XNumber
            }>
        >
    }>
    random: UI_LatentShapeGenerator
}>

export function ui_latent_v3(): UI_LatentV3 {
    const form: FormBuilder = getCurrentForm()
    const batchSize = form.shared('batchSize', form.int({ step: 1, default: 1, min: 1, max: 8 }))

    return form.choice({
        icon: 'mdiStarThreePoints',
        appearance: 'tab',
        default: 'emptyLatent',
        label: 'Latent Input',
        background: { hue: 270, chroma: 0.04 },
        items: {
            emptyLatent: form.group({
                // collapsed: false,
                // border: false,
                items: {
                    batchSize: batchSize,
                    size: form.size({ border: false }),
                },
            }),
            image: form.group({
                collapsed: false,
                border: false,
                items: {
                    batchSize,
                    image: form.image({ label: false, justifyLabel: false }),
                    resize: form.auto.Image_Resize().optional(),
                },
            }),
            random: ui_LatentShapeGenerator(batchSize),
        },
    })
}

export const run_latent_v3 = async (p: {
    //
    opts: ReturnType<typeof ui_latent_v3>['$Value']
    vae: _VAE
}): Promise<{
    latent: _LATENT
    width: number
    height: number
}> => {
    // init stuff
    const run = getCurrentRun()
    const graph = run.nodes
    const opts = p.opts

    // misc calculatiosn
    let width: number
    let height: number
    let latent: _LATENT

    // case 1. start form image
    if (opts.image) {
        const _img = run.loadImage(opts.image.image.id)
        let image: _IMAGE = await _img.loadInWorkflow()
        if (opts.image.resize) {
            image = graph.Image_Resize({ image, ...opts.image.resize })
            if (opts.image.resize.mode === 'rescale') {
                width = _img.width * opts.image.resize.rescale_factor
                height = _img.height * opts.image.resize.rescale_factor
            } else {
                width = opts.image.resize.resize_width
                height = opts.image.resize.resize_height
            }
        } else {
            width = _img.width
            height = _img.height
        }

        latent = graph.VAEEncode({ pixels: image, vae: p.vae })

        if (opts.image.batchSize > 1) {
            latent = graph.RepeatLatentBatch({
                samples: latent,
                amount: opts.image.batchSize,
            })
        }
    }

    // case 2. start form empty latent
    else if (opts.emptyLatent) {
        width = opts.emptyLatent.size.width
        height = opts.emptyLatent.size.height
        latent = graph.EmptyLatentImage({
            batch_size: opts.emptyLatent.batchSize ?? 1,
            height: height,
            width: width,
        })
    }

    // case 3. start from random
    else if (opts.random) {
        const result = await run_LatentShapeGenerator(opts.random, p.vae)
        latent = result.latent
        width = result.width
        height = result.height
    }

    // default ca
    else {
        throw new Error('no latent')
    }

    // return everything
    return { latent, width, height }
}
