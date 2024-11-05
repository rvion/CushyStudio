import { b } from '../../../src/controls/Builder'
import { run_refiners_fromImage, ui_refiners } from '../_prefabs/prefab_detailer'

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
         via: b.choice({
            maskeradePrompt: b.fields({
               ckpt: b.enum.Enum_CheckpointLoader$8pysssss_ckpt_name(),
               prompt: b.prompt(),
               precision: b.float({ default: 0.5, min: 0, max: 1 }),
               maskByText: b.autoField.Mask_By_Text(),
            }),
         }),
         // model: prefabModelSD15andSDXL(),
      }),
   //                  👇👇👇👇👇
   run: async (sdk, ui, { image }) => {
      const x = sdk.nodes
      if (image == null) throw new Error('no image provided')
      const img: Comfy.Input.IMAGE = await image.loadInWorkflow()

      const A = ui.via.maskeradePrompt
      if (A) {
         x.CheckpointLoaderSimple({ ckpt_name: A.ckpt })
         const maks = x.Mask_By_Text({ image: img, ...A.maskByText })
         x.PreviewImage({ images: maks.outputs.raw_mask })
         x.PreviewImage({ images: maks.outputs.thresholded_mask })
      }

      // const B = ui.via.maskeradePrompt
      // if (B) {
      //    x.CheckpointLoaderSimple({ ckpt_name: A.ckpt })
      //    const maks = x.Mask_By_Text({ image: img, ...A.maskByText })
      //    x.PreviewImage({ images: maks.outputs.raw_mask })
      //    x.PreviewImage({ images: maks.outputs.thresholded_mask })
      // }

      await sdk.PROMPT()
   },
})
