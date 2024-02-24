import { run_Dispacement1, run_Dispacement2, ui_3dDisplacement } from '../_prefabs/prefab_3dDisplacement'

app({
    metadata: {
        name: 'displace',
        description: 'generate a 3d displacement map from an image',
        help: `This app is made to be run from click on an image and sending it to drafts of this app.`,
    },
    canStartFromImage: true,
    ui: () => ({
        displacementConfig: ui_3dDisplacement(),
    }),
    run: async (run, ui, startImg) => {
        if (startImg == null) throw new Error('no image provided')
        const img = await startImg.loadInWorkflow()
        run_Dispacement1(ui.displacementConfig, img)
        await run.PROMPT()
        run_Dispacement2(startImg)
    },
})
