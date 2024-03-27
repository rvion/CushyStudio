import { CustomView3dCan } from './_can3/Can3'

app({
    metadata: {
        name: 'Beer Can App',
        description: 'Beer Can App',
    },
    ui: (ui) => ({
        image: ui.image({ label: 'Image' }),
    }),
    run: async (run, ui) => {
        run.output_custom({
            view: CustomView3dCan,
            params: { imageID: ui.image.id },
        })
    },
})
