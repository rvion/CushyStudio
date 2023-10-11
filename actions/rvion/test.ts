action('lol', {
    author: 'rvion',
    priority: 1,
    help: 'quick remove bg with one or many nodes',
    ui: (form) => ({
        vae: form.enum({ enumName: 'Enum_VAELoader_vae_name', default: 'vae-ft-mse-840000-ema-pruned.safetensors' }),
        count: form.int({ label: 'how many loras do you want to add', default: 10 }),
        image: form.imageOpt({}),
    }),

    run: async (flow, p) => {
        const graph = flow.nodes
        if (p.image == null) throw new Error('no image provided')
        const img = await flow.loadImageAnswer(p.image)
        let at: _IMAGE = img
        const vae = graph.VAELoader({ vae_name: p.vae })

        for (let i = 0; i < p.count; i++) {
            at = graph.VAEDecode({
                vae,
                samples: graph.VAEEncode({ pixels: at, vae }),
            })
        }
        graph.PreviewImage({ images: at })
        await flow.PROMPT()
    },
})
