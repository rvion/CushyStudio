action('cards', {
    author: '',
    description: 'play with cards',
    ui: (form) => ({
        theme1: form.string({ default: 'purple spring' }),
        theme2: form.string({ default: 'yellow summer' }),
        theme3: form.string({ default: 'orange autumn' }),
        theme4: form.string({ default: 'boobs winter' }),
        // what kind of border do we want
        border: form.string({ default: 'boobs winter' }),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes
        const colors = ['spades', 'hearts', 'clubs', 'diamonds'] as const
        const values = ['1', '2', '3', /* '4', '5', '6', '7', '8', '9', '10', 'Joker', */ 'Queen', 'King']

        const themeFor = { spades: p.theme1, hearts: p.theme2, clubs: p.theme3, diamonds: p.theme4 }

        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v122.safetensors' })
        const latent = graph.EmptyLatentImage({ width: 512, height: 726 })
        for (const color of colors) {
            for (const value of values) {
                const theme = themeFor[color]
                graph.PreviewImage({
                    images: graph.VAEDecode({
                        vae: ckpt,
                        samples: graph.KSampler({
                            latent_image: latent,
                            model: ckpt,
                            positive: graph.CLIPTextEncode({
                                clip: ckpt,
                                text: `palying card showing ${value} of ${color} in ${theme}`,
                            }),
                            negative: graph.CLIPTextEncode({ clip: ckpt, text: '' }),
                            sampler_name: 'euler',
                            scheduler: 'karras',
                        }),
                    }),
                })
            }
        }
        await flow.PROMPT()
    },
})
