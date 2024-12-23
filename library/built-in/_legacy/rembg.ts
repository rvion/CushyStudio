import type { ImageAndMask } from '../../../src/CUSHY'

import { run_rembg_v1, ui_rembg_v1 } from '../_prefabs/prefab_rembg'

app({
   metadata: {
      author: 'rvion',
      name: 'Remove Background',
      description: 'remove background from an image',
   },
   canStartFromImage: true,
   ui: (b) =>
      b.fields({
         a: b.int(),
         startImage: b.image({ label: 'Start image' }),
         models: ui_rembg_v1(),
      }),

   run: async (sdk, form, { image: img }) => {
      const image = await ((): Promise<ImageAndMask> => {
         // case where we start from an image or from unified canvas
         if (img) return img.loadInWorkflow()

         // case where we start from the form
         if (form.startImage == null) throw new Error('no image provided')
         return sdk.loadImageAnswer(form.startImage)
      })()
      console.log(`[🤠] 🔴`, image)

      run_rembg_v1(form.models, image)
      await sdk.PROMPT()
   },
})
