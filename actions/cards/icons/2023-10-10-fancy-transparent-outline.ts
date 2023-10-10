import { prettifyIconAt } from './TEST'

action('2023-10-10-fancy-transparent-outline.json', {
    author: 'experiments',
    ui: (ui) => ({}),

    run: async (flow, p) => {
        const graph = flow.nodes

        const img1 = prettifyIconAt(flow, { path: 'poker-heart.png', scaleRatio: 1.1 })
        const img2 = prettifyIconAt(flow, { path: 'poker-diamond.png', scaleRatio: 1.2 })
        const img3 = prettifyIconAt(flow, { path: 'poker-spade.png', scaleRatio: 1.3 })
        const img4 = prettifyIconAt(flow, { path: 'poker-club.png', scaleRatio: 1.4 })

        graph.PreviewImage({ images: img1 })
        graph.PreviewImage({ images: img2 })
        graph.PreviewImage({ images: img3 })
        graph.PreviewImage({ images: img4 })
        await flow.PROMPT()
    },
})
