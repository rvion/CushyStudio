import { run_refiners_fromImage, ui_refiners } from '../_prefabs/prefab_detailer'

// import { evalModelSD15andSDXL, prefabModelSD15andSDXL } from '../SD15/_model_SD15_SDXL'

app({
   metadata: {
      name: 'improve face',
      description: 'improve face',
      help: `This app is made to be run from click on an image and sending it to drafts of this app.`,
   },
   canStartFromImage: true,
   ui: (b) =>
      b.fields({
         // model: prefabModelSD15andSDXL(),
         refiners: ui_refiners(),
      }),
   //                  👇👇👇👇👇
   run: async (run, ui, { image }) => {
      if (image == null) throw new Error('no image provided')
      let img: _IMAGE = await image.loadInWorkflow()
      // evalModelSD15andSDXL(ui.model)
      img = run_refiners_fromImage(ui.refiners, img)
      run.add_previewImage(img)
      await run.PROMPT()
   },
})
