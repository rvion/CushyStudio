import { ui_latent } from './_prefabs/prefab_latent'

app({
    // metadata for publishing
    metadata: {
        name: 'Zero123',
        description: 'Zero123',
    },

    // GUI
    ui: (ui) => ({
        about: ui.markdown('https://comfyanonymous.github.io/ComfyUI_examples/3d/'),

        // start image
        image: ui.image({ default: 'comfy', defaultComfy: { type: 'ComfyImage', imageName: 'example.png' } }),

        // elevation
        elevation: ui.float({ default: 10 }),

        // angle / azimuth
        from: ui.float({ min: -180, max: 180, default: -180 }),
        to: ui.float({ min: -180, max: 180, default: 180 }),
        step: ui.float({ min: 0.1, max: 180, default: 10 }),
    }),

    // EXECUTION logic
    run: async (run, ui) => {
        // 1. ensure we have the model present
        run.mainHost.downloadFileIfMissing(
            'https://huggingface.co/stabilityai/stable-zero123/resolve/main/stable_zero123.ckpt',
            `${run.mainHost.data.absolutePathToComfyUI}//models/checkpoints/stable_zero123.ckpt`,
        )

        const graph = run.nodes
        const ckpt = graph.ImageOnlyCheckpointLoader({ ckpt_name: 'stable_zero123.ckpt' })

        const startImage = await run.loadImageAnswer(ui.image)
        // const startImage = image
        for (const angle of run.range(ui.from, ui.to, ui.step)) {
            const sz123 = graph.StableZero123$_Conditioning({
                width: 256,
                height: 256,
                batch_size: 1,
                elevation: 10,
                azimuth: angle,
                clip_vision: ckpt.outputs.CLIP_VISION,
                init_image: startImage,
                vae: ckpt,
            })
            const latent = graph.KSampler({
                seed: run.randomSeed(),
                steps: 40,
                cfg: 8,
                sampler_name: 'euler',
                scheduler: 'sgm_uniform',
                denoise: 1,
                model: ckpt,
                positive: sz123.outputs.positive,
                negative: sz123.outputs.negative,
                latent_image: sz123,
            })
            graph.SaveImage({
                images: graph.VAEDecode({ samples: latent, vae: ckpt }),
                filename_prefix: '3d/ComfyUI',
            })
        }

        await run.PROMPT()
        await run.output_video_ffmpegGeneratedImagesTogether()
    },
})
