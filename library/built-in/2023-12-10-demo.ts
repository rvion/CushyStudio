app({
    ui: (form) => ({
        text: form.str({}),
        seed: form.seed({}),
        saveIntermeridaryImg: form.bool({}),
    }),
    run: (flow, ui) => {
        const graph = flow.nodes
        const ckpt = graph.CheckpointLoaderSimple({
            ckpt_name: 'revAnimated_v122.safetensors',
        })

        let latent: _LATENT = graph.EmptyLatentImage({})

        const NEG = graph.CLIPTextEncode({ clip: ckpt, text: 'naked, loli, nsfw, boobs' })
        const POS = graph.CLIPTextEncode({ clip: ckpt, text: ui.text })
        latent = graph.KSampler({
            model: ckpt,
            sampler_name: 'ddim',
            scheduler: 'ddim_uniform',
            positive: POS,
            negative: NEG,
            latent_image: latent,
            seed: ui.seed,
        })

        // add 4 passes of ksampler
        for (const i of [1, 2, 3, 4]) {
            latent = graph.KSampler({
                model: ckpt,
                sampler_name: 'ddim',
                scheduler: 'ddim_uniform',
                positive: POS,
                negative: NEG,
                latent_image: latent,
                seed: ui.seed,
            })
            if (ui.saveIntermeridaryImg) {
                graph.PreviewImage({
                    images: graph.VAEDecode({
                        vae: ckpt,
                        samples: latent,
                    }),
                })
            }
        }

        graph.PreviewImage({
            images: graph.VAEDecode({
                vae: ckpt,
                samples: latent,
            }),
        })

        flow.PROMPT({})
    },
})
