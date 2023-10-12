action('mask-face', {
    author: 'rvion',
    help: 'extract a mak for the face', // <- action help text
    // requirement: (kk) => ({
    //     image: kk.IMAGE({}),
    // }),
    ui: (form) => ({
        image: form.imageOpt({ label: 'image to mask' }),
    }),
    run: async (flow, deps) => {
        const graph = flow.nodes
        const clothesMask = graph.Mask_By_Text({
            image: flow.AUTO,
            prompt: 'face',
            negative_prompt: 'arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        graph.SaveImage({ images: clothesMask.outputs.IMAGE })
        graph.SaveImage({ images: clothesMask.outputs.IMAGE_1 })
        await flow.PROMPT()
    },
})
