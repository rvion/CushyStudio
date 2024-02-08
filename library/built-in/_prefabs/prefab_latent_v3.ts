import type { FormBuilder } from 'src/controls/FormBuilder'
import type { OutputFor } from './_prefabs'

export const ui_latent_v3 = () => {
    const form: FormBuilder = getCurrentForm()
    return form.choice({
        appearance: 'tab',
        label: 'Latent Input',
        default: 'emptyLatent',
        items: {
            emptyLatent: () =>
                form.group({
                    items: () => ({
                        batchSize: form.int({ step: 1, default: 1, min: 1, max: 8 }),
                        size: form.size({}),
                    }),
                }),
            image: () => form.image({}),
        },
    })
}

export const run_latent_v3 = async (p: { opts: OutputFor<typeof ui_latent_v3>; vae: _VAE }) => {
    // init stuff
    const run = getCurrentRun()
    const graph = run.nodes
    const opts = p.opts

    // misc calculatiosn
    let width: number
    let height: number
    let latent: HasSingle_LATENT

    // case 1. start form image
    if (opts.image) {
        const _img = run.loadImage(opts.image.imageID)
        const image = await _img.loadInWorkflow()
        latent = graph.VAEEncode({ pixels: image, vae: p.vae })
        width = _img.width
        height = _img.height
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

    // default case
    else {
        throw new Error('no latent')
    }

    // return everything
    return { latent, width, height }
}
