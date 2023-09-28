action('mask-face', {
    author: 'rvion',
    help: 'extract a mak for the face', // <- action help text
    // requirement: (kk) => ({
    //     image: kk.IMAGE({}),
    // }),
    ui: (form) => ({
        image: form.selectImage('image to mask'),
    }),
    run: async (flow, deps) => {
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: flow.AUTO,
            prompt: 'face',
            negative_prompt: 'arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        flow.nodes.SaveImage({ images: clothesMask.IMAGE })
        flow.nodes.SaveImage({ images: clothesMask.IMAGE_1 })
        await flow.PROMPT()
    },
})
