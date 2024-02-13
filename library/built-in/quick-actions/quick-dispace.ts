import { exhaust } from 'src/utils/misc/ComfyUtils'

app({
    metadata: {
        name: 'displace',
        description: 'generate a 3d displacement map from an image',
        help: `This app is made to be run from click on an image and sending it to drafts of this app.`,
    },
    canStartFromImage: true,
    ui: (form) => ({
        normal: form.selectOne({
            requirements: [{ type: 'customNodesByNameInCushy', nodeName: 'MarigoldDepthEstimation' }],
            default: { id: 'MiDaS' },
            choices: [{ id: 'MiDaS' }, { id: 'BAE' }],
        }),
        depth: form.selectOne({
            default: { id: 'Zoe' },
            choices: [{ id: 'MiDaS' }, { id: 'Zoe' }, { id: 'LeReS' }],
        }),
    }),
    run: async (run, ui, startImg) => {
        if (startImg == null) throw new Error('no image provided')

        const graph = run.workflow.builder

        // load image
        const img = await startImg.loadInWorkflow()

        // add nodes to generate depth map
        const depth = (() => {
            if (ui.depth.id === 'MiDaS') return graph.MiDaS$7DepthMapPreprocessor({ image: img })
            if (ui.depth.id === 'Zoe') return graph.Zoe$7DepthMapPreprocessor({ image: img })
            if (ui.depth.id === 'LeReS') return graph.LeReS$7DepthMapPreprocessor({ image: img })
            return exhaust(ui.depth)
        })()
        run.add_saveImage(depth, 'depth')

        // add nodes to generate normal map
        const normal = (() => {
            if (ui.normal.id === 'MiDaS') return graph.MiDaS$7NormalMapPreprocessor({ image: img })
            if (ui.normal.id === 'BAE') return graph.BAE$7NormalMapPreprocessor({ image: img })
            return exhaust(ui.normal)
        })()
        run.add_saveImage(normal, 'normal')

        // execute workflow
        await run.PROMPT()

        // generate displacement map
        run.output_3dImage({ image: startImg, depth: 'depth', normal: 'normal' })
    },
})
