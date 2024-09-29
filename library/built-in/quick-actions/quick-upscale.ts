import { run_upscaleWithModel, ui_upscaleWithModel } from '../_prefabs/prefab_upscaleWithModel'
import { run_upscaleWithModel_v2, ui_upscaleWithModel_v2 } from '../_prefabs/prefab_upscaleWithModels'
import { run_customSave, ui_customSave } from '../_prefabs/saveSmall'

app({
    metadata: {
        name: 'upscale single',
        description: 'add a gradient background to the input image',
    },
    ui: (b) =>
        b.fields({
            image: b.image({}),
            upscale: ui_upscaleWithModel(),
        }),
    canStartFromImage: true,
    run: async (run, ui, ctximg) => {
        const imageA = await ui.image.loadInWorkflow()
        run_upscaleWithModel(ui.upscale, { image: imageA })
        await run.PROMPT()
    },
})

app({
    metadata: {
        name: 'upscale multiple',
        description: 'add a gradient background to the input image',
    },
    ui: (b) =>
        b.fields({
            image: b.image({}),
            upscale: ui_upscaleWithModel_v2(),
            save: ui_customSave(),
        }),
    canStartFromImage: true,
    run: async (run, ui, ctximg) => {
        const imageA = await ui.image.loadInWorkflow()
        run_upscaleWithModel_v2(ui.upscale, { image: imageA })
        const saveFormat = run_customSave(ui.save)
        await run.PROMPT({ saveFormat: saveFormat })
    },
})
