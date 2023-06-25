action('B. auto-mask-face', {
    help: 'extract a mak for the face', // <- action help text
    // requirement: (kk) => ({
    //     image: kk.IMAGE({}),
    // }),
    run: (flow, deps) => {
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: deps.image,
            prompt: 'face',
            negative_prompt: 'face, arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        flow.nodes.PreviewImage({ images: clothesMask.IMAGE })
    },
})
