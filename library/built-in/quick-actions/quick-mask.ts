// import { evalModelSD15andSDXL, prefabModelSD15andSDXL } from '../SD15/_model_SD15_SDXL'

app({
   metadata: {
      name: 'quick-mask',
      description: 'Quick Mask some area based on a prompt',
      help: `useful in UC`,
   },
   canStartFromImage: true,
   ui: (b) =>
      b.fields({
         image: b.image().optional(),
         via: b.choice({
            impact: b.fields({
               detector1: b.autoField['Impact-Pack.CLIPSegDetectorProvider'](),
               detector2: b.autoField['Impact-Pack.BboxDetectorCombined_v2'](),
            }),
            maskeradePrompt: b.fields({
               ckpt: b.enum['CheckpointLoader.ckpt_name'](),
               prompt: b.prompt(),
               precision: b.float({ default: 0.5, min: 0, max: 1 }),
               // @ts-ignore
               maskByText: b.autoField.Mask_By_Text(),
            }),
         }),
         // model: prefabModelSD15andSDXL(),
      }),
   // layout: (ui) => {
   //    ui.for(ui.field.Via,{Header: ui.catalog.})
   //    ui.catalog.group
   // },
   run: async (sdk, ui, ctx) => {
      const x = sdk.nodes

      // #region 1. get image
      const image: Maybe<Comfy.Signal['IMAGE']> = ctx.image
         ? await ctx.image.loadInWorkflow()
         : ui.image != null
           ? await ui.image.loadInWorkflow()
           : null
      if (image == null) throw new Error('no image provided in context')

      const Impact = ui.via.impact
      const Maskerade = ui.via.maskeradePrompt

      // #region mask using selected tool
      // 1. Impact
      if (Impact) {
         const bbox_detector = x['Impact-Pack.CLIPSegDetectorProvider'](Impact.detector1)
         const mask = x['Impact-Pack.BboxDetectorCombined_v2']({ image, bbox_detector, ...Impact.detector2 })
         x.PreviewImage({ images: x.MaskToImage({ mask: mask }) })
      }
      // 2. Maskerade
      else if (Maskerade) {
         x.CheckpointLoaderSimple({ ckpt_name: Maskerade.ckpt })
         // @ts-ignore
         const maks = x.Mask_By_Text({ image: image, ...Maskerade.maskByText })
         x.PreviewImage({ images: maks.outputs.raw_mask })
         x.PreviewImage({ images: maks.outputs.thresholded_mask })
      }

      await sdk.PROMPT()
   },
})
