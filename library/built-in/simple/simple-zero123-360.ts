app({
    // metadata for publishing
    metadata: {
        //
        name: 'Zero123-rotate-around',
        description: 'generate a video of a 3d object rotating around itself',
        help: [
            //
            `Image must:`,
            `- have **transparent** background`,
            `- be **centered** (no parts escaping the frame)'`,
        ].join('\n'),
    },

    // interface
    ui: (b) =>
        b.fields({
            about: b.markdown('https://comfyanonymous.github.io/ComfyUI_examples/3d/'),
            // start image
            image: b.image({}),
            // elevation
            elevation: b.float({ default: 10 }),
            // angle / azimuth
            steps: b.int({ min: 1, max: 100, default: 20 }),
            from: b.float({ min: -180, max: 180, default: -180 }),
            to: b.float({ min: -180, max: 180, default: 180 }),
            step: b.float({ min: 0.1, max: 180, default: 10 }),
            upscale: b.bool({ default: false }),
        }),

    // execution logic
    run: async (run, ui) => {
        // 1. ensure we have the model present
        const mainHost = run.Hosts.main
        await mainHost.downloadFileIfMissing(
            'https://huggingface.co/stabilityai/stable-zero123/resolve/main/stable_zero123.ckpt',
            `${mainHost.absolutPathToDownloadModelsTo}/stable_zero123.ckpt`,
        )

        // 2.
        const graph = run.nodes

        const ckpt = graph.ImageOnlyCheckpointLoader({
            // @ts-ignore
            ckpt_name: 'stable_zero123.ckpt',
        })
        const startImage2 = await run.loadImageAnswer(ui.image)
        const upscale_model = graph.Upscale_Model_Loader({ model_name: 'RealESRGAN_x2.pth' })
        for (const angle of run.range(ui.from, ui.to, ui.step)) {
            const sz123 = graph.StableZero123$_Conditioning({
                width: 256,
                height: 256,
                batch_size: 1,
                elevation: ui.elevation,
                azimuth: angle,
                clip_vision: ckpt.outputs.CLIP_VISION,
                init_image: startImage2,
                vae: ckpt,
            })
            let latent: _LATENT = graph.KSampler({
                seed: run.randomSeed(),
                steps: ui.steps,
                cfg: 4,
                sampler_name: 'euler',
                scheduler: 'sgm_uniform',
                denoise: 1,
                model: ckpt,
                positive: sz123.outputs.positive,
                negative: sz123.outputs.negative,
                latent_image: sz123,
            })

            // SECOND PASS (a.k.a. highres fix) ---------------------------------------------------------

            let image: _IMAGE = graph.VAEDecode({ samples: latent, vae: ckpt })
            if (ui.upscale) {
                image = graph.ImageUpscaleWithModel({ upscale_model, image })
            }

            // run.add_previewImageWithAlpha(latent)
            graph.SaveImage({
                images: image,
                filename_prefix: `3d/3dComfyUI_${angle + 360}`,
            })
        }

        await run.PROMPT()

        // generate video
        const imagesSorted = run.generatedImages
            .filter((i) => i.filename.startsWith('3dComfyUI_'))
            .sort((a, b) => a.filename.localeCompare(b.filename))
        await run.Videos.output_video_ffmpegGeneratedImagesTogether(imagesSorted)
    },
})
