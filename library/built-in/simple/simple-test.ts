app({
    metadata: {
        name: 'Simple Demo App',
        description: 'A simple demo App',
    },
    ui: (form) => ({
        model: form.enum.Enum_CheckpointLoaderSimple_ckpt_name({}),
        positive: form.string({ default: 'masterpiece, tree' }),
        seed: form.seed({}),
    }),
    run: async (run, ui) => {
        const workflow = run.workflow
        const graph = workflow.builder

        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: ui.model })
        const latent = graph.EmptyLatentImage({})
        const image = graph.VAEDecode({
            samples: graph.KSampler({
                seed: ui.seed,
                latent_image: latent,
                model: ckpt,
                sampler_name: 'ddim',
                scheduler: 'karras',
                positive: graph.CLIPTextEncode({ clip: ckpt, text: ui.positive }),
                negative: graph.CLIPTextEncode({ clip: ckpt, text: '' }),
            }),
            vae: ckpt,
        })

        graph.PreviewImage({ images: image })
        await workflow.sendPromptAndWaitUntilDone()
    },
})
