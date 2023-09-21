action('🌠 start from image', {
    help: 'start from image', // <- action help text
    // vv action require an image and an input text with tag 'clothes'
    // requirement: (kk) => ({
    //     image: kk.IMAGE({}),
    //     clothes: kk.STRING({ tag: 'clothes' }),
    // }),
    ui: (form) => ({
        image: form.selectImage('test'),
    }),
    run: (flow, reqs) => {
        // const image: _IMAGE = reqs.image
        const image = flow.loadImageAnswer(reqs.image)
        // const clothesMask = flow.nodes.WASImageLoad({
        //     // image: image.,
        //     // prompt: reqs.match,
        //     // negative_prompt: 'face, arms, hands, legs, feet, background',
        //     // normalize: 'no',
        //     // precision: 0.3,
        //     image_path: reqs.image,
        // })
        // flow.nodes.PreviewImage({ images: clothesMask.IMAGE })
    },
})
