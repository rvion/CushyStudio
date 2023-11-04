card({
    // name: 'playground-seed-widget',
    ui: (form) => ({
        seed1: form.seed({ defaultMode: 'randomize' }),
        seed2: form.seed({ defaultMode: 'fixed' }),
        seed3: form.seed({ defaultMode: 'fixed', default: 12 }),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes

        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v122.safetensors' })
        const latent_image = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
        const negative = graph.CLIPTextEncode({ clip: ckpt, text: 'bad' })
        const positive = graph.CLIPTextEncode({ clip: ckpt, text: 'a house' })

        const generate = (seed: number) => {
            graph.PreviewImage({
                images: graph.VAEDecode({
                    vae: ckpt,
                    samples: graph.KSampler({
                        latent_image,
                        model: ckpt,
                        negative,
                        positive,
                        sampler_name: 'ddim',
                        scheduler: 'karras',
                        cfg: 8,
                        denoise: 1,
                        seed,
                        steps: 10,
                    }),
                }),
            })
        }

        generate(form.seed1)
        generate(form.seed2)
        generate(form.seed3)
    },
})
