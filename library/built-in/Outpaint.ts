import { run_model, ui_model } from './_prefabs/prefab_model'

app({
    metadata: {
        name: 'outpaint',
        description: 'outpaint',
    },
    ui: (form) => ({
        model: ui_model(),
    }),
    requirements: [
        //
        // { type: 'modelInManager' },
        { type: 'customNodesByTitle', title: 'ComfyUI Inpaint Nodes' },
    ],
    run: async (run, ui, ctx) => {
        const foo = run_model(ui.model)
    },
})
