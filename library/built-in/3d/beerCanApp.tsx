import { CustomView3dCan } from '../_views/View_3d_TinCan'

app({
    metadata: {
        name: 'Beer Can App',
        description: 'diplay a 3d TinCan with provided image as Label texture',
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
