action('B. auto-mask-face', {
    help: 'extract a mak for the face', // <- action help text
    // requirement: (kk) => ({
    //     image: kk.IMAGE({}),
    // }),
    run: async (flow, deps) => {
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: deps.image,
            prompt: 'face',
            negative_prompt: 'face, arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        flow.nodes.SaveImage({ images: clothesMask.IMAGE })
        flow.nodes.SaveImage({ images: clothesMask.IMAGE_1 })
        await flow.PROMPT()
    },
})
