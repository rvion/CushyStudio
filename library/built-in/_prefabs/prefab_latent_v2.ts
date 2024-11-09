import type { ComfyNodeOutput } from '../../../src/core/Slot'
import type { Runtime } from '../../../src/runtime/Runtime'
import type { OutputFor } from './_prefabs'

export type UI_latent_v2 = X.XGroup<{
   image: X.XOptional<X.XImage>
   size: X.XSize
   batchSize: X.XNumber
}>

export const ui_latent_v2 = (form: X.Builder): UI_latent_v2 => {
   return form.group({
      label: 'Start from',
      items: {
         image: form.image({}).optional(),
         size: form.size({}),
         batchSize: form.int({ default: 1, min: 1, max: 8 }),
      },
   })
}

export const run_latent_v2 = async (p: {
   run: Runtime
   opts: OutputFor<typeof ui_latent_v2>
   vae: Comfy.Signal['VAE']
}): Promise<{
   latent: Comfy.HasSingle['LATENT']
   width: number | ComfyNodeOutput<'INT', number>
   height: number | ComfyNodeOutput<'INT', number>
}> => {
   // init stuff
   const graph = p.run.nodes
   const opts = p.opts

   // misc calculatiosn
   let width: number | ComfyNodeOutput<'INT'> = 1 // 🔴
   let height: number | ComfyNodeOutput<'INT'> = 1 // 🔴
   let latent: Comfy.HasSingle['LATENT']

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
      const image = await graph['was.Image Resize']({
         image: imageRaw,
         resampling: 'lanczos',
         resize_width: width,
         resize_height: height,
         mode: 'resize',
         supersample: 'false',
      })
      const size = graph['was.Image Size to Number']({ image })
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
