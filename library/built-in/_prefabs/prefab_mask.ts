import type { FormBuilder } from 'src/controls/FormBuilder'

export const ui_mask = () => {
    const form: FormBuilder = getCurrentForm()
    return form.choice({
        appearance: 'tab',
        label: 'Mask',
        default: 'noMask',
        items: {
            noMask: () => form.group({}),
            mask: () =>
                form.group({
                    items: () => ({
                        image: form.image({}),
                        mode: form.enum.Enum_LoadImageMask_channel({}),
                        invert: form.bool({}),
                        // interrogate: form.bool({}),
                    }),
                }),
        },
    })
}

export const run_mask = async (p: {}) => {
    // // init stuff
    // const run = getCurrentRun()
    // const graph = run.nodes
    // const opts = p.opts
    // // misc calculatiosn
    // let width: number
    // let height: number
    // let latent: HasSingle_LATENT
    // // case 1. start form image
    // if (opts.image) {
    //     const _img = run.loadImage(opts.image.imageID)
    //     const image = await _img.loadInWorkflow()
    //     latent = graph.VAEEncode({ pixels: image, vae: p.vae })
    //     width = _img.width
    //     height = _img.height
    // }
    // // case 2. start form empty latent
    // else if (opts.emptyLatent) {
    //     width = opts.emptyLatent.size.width
    //     height = opts.emptyLatent.size.height
    //     latent = graph.EmptyLatentImage({
    //         batch_size: opts.emptyLatent.batchSize ?? 1,
    //         height: height,
    //         width: width,
    //     })
    // }
    // // default case
    // else {
    //     throw new Error('no latent')
    // }
    // // return everything
    // return { latent, width, height }
}
