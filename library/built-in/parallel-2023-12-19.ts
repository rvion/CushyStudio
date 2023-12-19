import type { ImageStore } from 'src/back/ImageStore'

app({
    metadata: {
        name: 'orchestrator',
    },
    ui: (form) => ({}),
    run: async (run, ui) => {
        run.executeApp<typeof foo>('test-2023-12-19', {})
        run.executeApp<typeof foo>('test-2023-12-19', {})
    },
})

const foo = app({
    metadata: {
        name: 'test-2023-12-19',
    },
    ui: (form) => ({
        frameStart: form.int({ default: 1 }),
        frameEnd: form.int({ default: 10 }),
        reprocess: form.boolean({ default: false }),
    }),
    run: async (run, ui) => {
        for (let frame = ui.frameStart; frame <= ui.frameEnd; frame++) {
            const frameKey = `frame-${frame}`
            const store: ImageStore = run.store.getImageStore(frameKey)

            // abort if frame is already done
            if (store.hasImage && !ui.reprocess) {
                continue
                // return run.output_text('already have an image')
            }

            // or do the frame
            const builder = run.nodes
            const model = builder.CheckpointLoaderSimple({ ckpt_name: 'lyriel_v15.safetensors' })
            builder
                .PreviewImage({
                    images: builder.VAEDecode({
                        vae: model,
                        samples: builder.KSampler({
                            seed: run.randomSeed(),
                            latent_image: builder.EmptyLatentImage({}),
                            model: model,
                            sampler_name: 'ddim',
                            scheduler: 'ddim_uniform',
                            positive: builder.CLIPTextEncode({ clip: model, text: `frame ${frame}` }),
                            negative: builder.CLIPTextEncode({ clip: model, text: 'nsfw, nude' }),
                        }),
                    }),
                })
                .storeAs(frameKey)
        }
        await run.PROMPT()
    },
})
