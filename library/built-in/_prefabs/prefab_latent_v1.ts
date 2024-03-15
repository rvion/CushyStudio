import type { OutputFor } from './_prefabs'
import type { FormBuilder } from 'src/controls/FormBuilder'

export const ui_latent_v1 = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Start from',
        items: () => ({
            image: form.imageOpt({}),
            batchSize: form.int({ default: 1, min: 1, max: 8 }),
            size: form.size({}),
        }),
    })
}

export const run_latent_v1 = async (p: { opts: OutputFor<typeof ui_latent_v1>; vae: _VAE }) => {
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
    else {
        width = /* opts.flip ? opts.size.height : */ opts.size.width
        height = /* opts.flip ? opts.size.width : */ opts.size.height
        latent = graph.EmptyLatentImage({
            batch_size: opts.batchSize ?? 1,
            height: height,
            width: width,
        })
    }

    // return everything
    return { latent, width, height }
}
