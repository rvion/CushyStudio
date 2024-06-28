import type { Builder } from '../../../src/controls/Builder'
import type { ComfyNodeOutput } from '../../../src/core/Slot'
import type { Runtime } from '../../../src/runtime/Runtime'
import type { OutputFor } from './_prefabs'

export const ui_latent_v2 = (form: X.Builder) => {
    return form.group({
        label: 'Start from',
        items: {
            image: form.image({}).optional(),
            size: form.size({}),
            // width: form.int({ default: 512,  step: 128, min: 128, max: 4096 }),
            // height: form.int({ default: 768,  step: 128, min: 128, max: 4096 }),
            batchSize: form.int({ default: 1, min: 1, max: 8 }),
        },
    })
}

export const run_latent_v2 = async (p: {
    //
    run: Runtime
    opts: OutputFor<typeof ui_latent_v2>
    vae: _VAE
}) => {
    // init stuff
    const graph = p.run.nodes
    const opts = p.opts

    // misc calculatiosn
    let width: number | ComfyNodeOutput<'INT'> = 1 // 🔴
    let height: number | ComfyNodeOutput<'INT'> = 1 // 🔴
    let latent: HasSingle_LATENT

    // 🔴
    // case 1. start form image
    if (opts.image) {
        const imageRaw = await p.run.loadImageAnswer(opts.image)
        // May need to use a different node for resizing
        // const image = await graph.ImageTransformResizeClip({
        //     images: imageRaw,
        //     method: `lanczos`,
        //     max_width: width,
        //     max_height: height,
        // })
        const image = await graph.Image_Resize({
            image: imageRaw,
            resampling: 'lanczos',
            resize_width: width,
            resize_height: height,
            mode: 'resize',
            supersample: 'false',
        })
        const size = graph.Image_Size_to_Number({ image })
        width = size.outputs.width_int
        height = size.outputs.height_int

        latent = graph.VAEEncode({ pixels: image, vae: p.vae })
        graph.SaveImage({ images: graph.VAEDecode({ samples: latent, vae: p.vae }) })
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
