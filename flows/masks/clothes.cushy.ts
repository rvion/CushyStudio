export const x = action('mask-clothes', {
    //                   ^^ action name
    help: 'extract a mak for the given clothes', // <- action help text
    // vv action require an image and an input text with tag 'clothes'
    requirement: (kk) => ({
        image: kk.IMAGE({}),
        clothes: kk.STRING({ tag: 'clothes' }),
    }),
    run: (flow, reqs) => {
        const image = reqs.image
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: image,
            prompt: reqs.clothes,
            negative_prompt: 'face, arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        flow.nodes.PreviewImage({ images: clothesMask.IMAGE })
    },
})
