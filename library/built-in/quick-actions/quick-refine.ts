import { run_refiners_fromImage, ui_refiners } from '../_prefabs/prefab_detailer'
import { run_model, ui_model } from '../_prefabs/prefab_model'

app({
    metadata: {
        name: 'improve face',
        description: 'improve face',
        help: `This app is made to be run from click on an image and sending it to drafts of this app.`,
    },
    canStartFromImage: true,
    ui: (form) => ({
        model: ui_model(),
        refiners: ui_refiners(),
    }),
    //                  👇👇👇👇👇
    run: async (run, ui, startImg) => {
        if (startImg == null) throw new Error('no image provided')
        let img: _IMAGE = await startImg.loadInWorkflow()
        run_model(ui.model)
        img = run_refiners_fromImage(ui.refiners, img)
        run.add_previewImage(img)
        await run.PROMPT()
    },
})
