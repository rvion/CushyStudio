import type { Field_number } from '../../../src/csuite/fields/number/FieldNumber'
import type { Field_size_config } from '../../../src/csuite/fields/size/FieldSize'

import {
   run_LatentShapeGenerator,
   ui_LatentShapeGenerator,
   type UI_LatentShapeGenerator,
} from '../shapes/prefab_shapes'

export type UI_LatentV3 = Z.Choice<{
   emptyLatent: Z.Group<{
      batchSize: Z.Shared<Field_number>
      size: Z.Size
   }>
   image: Z.Group<{
      batchSize: Z.Shared<Field_number>
      image: Z.Image
      resize: Z.Maybe<
         Z.Group<{
            mode: Z.EnumOf<'resize' | 'rescale'>
            supersample: Z.EnumOf<'false' | 'true'>
            resampling: Z.EnumOf<'bicubic' | 'bilinear' | 'lanczos' | 'nearest'>
            rescale_factor: Z.Number
            resize_width: Z.Number
            resize_height: Z.Number
         }>
      >
   }>
   random: UI_LatentShapeGenerator
}>

export const latentSizeChanel = new cushy.Channel<{ w: number; h: number }>()

export function ui_latent_v3(p: { size?: Field_size_config } = {}): UI_LatentV3 {
   const form: Z.Builder = getBuilder()
   const batchSize = form.linkedFromSharedUID(
      '2025-03-22-batchSize',
      form.int({ label: 'batchSize', step: 1, default: 1, min: 1, max: 8 }),
   )
   return form.choice(
      {
         emptyLatent: form.fields({
            batchSize,
            size: form.size(p.size).publishToChannel(latentSizeChanel, (s) => ({
               w: s.width_or_zero,
               h: s.height_or_zero,
            })),
         }),
         // cas 2
         image: form.fields(
            {
               batchSize,
               image: form.image(),
               resize: form.auto['was.Image Resize']().optional(),
               // resize2: form.auto['was.Image Resize']().optional(),
            },
            // { collapsed: false, border: false },
         ),
         random: ui_LatentShapeGenerator(batchSize),
      },
      {
         uiui: {
            OnRight: (f) => {
               const size = f.field.zValue.emptyLatent?.size || f.field.zValue.random?.size
               if (size == null) return null
               return (
                  <div tw='flex whitespace-nowrap text-xs lh-input opacity-70'>
                     {size.width}x{size.height}
                  </div>
               )
            },
         },
         icon: IKONS.mdiStarThreePoints,
         appearance: 'tab',
         default: 'emptyLatent',
         label: 'Latent Input',
      },
   )
}

export const run_latent_v3 = async (p: {
   //
   opts: ReturnType<typeof ui_latent_v3>['ҨValue']
   vae: Comfy.Signal['VAE']
}): Promise<{
   latent: Comfy.Signal['LATENT']
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
   let latent: Comfy.Signal['LATENT']

   // case 1. start form image
   if (opts.image) {
      const _img = run.loadImage(opts.image.image.id)
      let image: Comfy.Signal['IMAGE'] = await _img.loadInWorkflow()
      if (opts.image.resize) {
         image = graph['was.Image Resize']({ image, ...opts.image.resize })
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

// mountROOT: form.linked((self) => self.consume(chan)!), //
// mountROOT2: form.linked(chan.getOrThrow), //
// mountA: form.linked((self) => self.consume(chan)!.fields.a),
// test: form.selectOne({
//     choices: (self) => {
//         // case 2: LOG (B+3) 🟢
//         const x = self.consume(chan)
//         const b = x?.fields.b.value ?? 0
//         return []
//     },
// }),
