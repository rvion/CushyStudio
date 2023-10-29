import type { ImageAndMask, Runtime } from 'src/back/Runtime'

card({
    name: 'teste2',
    author: 'rvion',
    description: 'showcase the API builder',
    ui: (form) => ({
        color: form.color({ default: 'red' }),
        image: form.image({}),
    }),
    run: async (flow, p) => {
        flow.print('YOLO')
        const res = flow.nodes.LoadImage({ image: '1003b096b5bb04e9e4d317f21a6761e23299eae4e74742c3fb16afba2c21bfaa.png' })

        flow.nodes.PreviewImage({
            images: flow.nodes.JoinImageWithAlpha({
                image: res,
                alpha: res,
            }),
        })
        flow.nodes.PreviewImage({
            images: flow.nodes.MaskToImage({
                mask: res,
            }),
        })
        await flow.PROMPT()
    },
})
