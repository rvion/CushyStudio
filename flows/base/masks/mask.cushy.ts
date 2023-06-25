action('🎭 mask', {
    help: 'extract a mak for the given clip prompt', // <- action help text
    priority: 1,
    ui: (form) => ({
        match: form.str({ default: 'dress' }),
        image: form.selectImage('test', []),
        norm: form.bool({ label: 'normalize', default: true }),
        threeshold: form.int({ default: 2 }),
    }),
    run: async (flow, reqs) => {
        const image = flow.loadImageAnswer(reqs.image)
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: image,
            prompt: reqs.match,
            negative_prompt: 'face, arms, hands, legs, feet, background',
            normalize: reqs.norm ? 'yes' : 'no',
            precision: reqs.threeshold / 10,
        })
        // flow.nodes.PreviewImage({ images: clothesMask.IMAGE })
        flow.nodes.PreviewImage({ images: image })
        flow.nodes.PreviewImage({ images: clothesMask.IMAGE })
        flow.nodes.PreviewImage({ images: clothesMask.IMAGE_1 })
        await flow.PROMPT()
    },
})
