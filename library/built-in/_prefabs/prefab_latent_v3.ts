import type { FormBuilder } from 'src/controls/FormBuilder'
import type { OutputFor } from './_prefabs'

export const ui_latent_v3 = () => {
    const form: FormBuilder = getCurrentForm()
    const batchSize = form.shared('batchSize', form.int({ step: 1, default: 1, min: 1, max: 8 }))

    return form.choice({
        appearance: 'tab',
        default: 'emptyLatent',
        label: 'Latent Input',
        items: {
            emptyLatent: form.group({
                collapsible: false,
                label: false,
                items: { batchSize, size: form.size({ label: false }) },
            }),
            image: form.group({
                collapsible: false,
                label: false,
                items: { batchSize, image: form.image() },
            }),
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
        const _img = run.loadImage(opts.image.image.imageID)
        const image = await _img.loadInWorkflow()
        latent = graph.VAEEncode({ pixels: image, vae: p.vae })
        width = _img.width
        height = _img.height

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

    // default case
    else {
        throw new Error('no latent')
    }

    // return everything
    return { latent, width, height }
}
