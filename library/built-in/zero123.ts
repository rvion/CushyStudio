import { run_sampler } from './_prefabs/prefab_sampler'

app({
    // metadata for publishing
    metadata: { name: 'Zero123', description: 'Zero123' },

    // interface
    ui: (form) => ({
        about: form.markdown('https://comfyanonymous.github.io/ComfyUI_examples/3d/'),
        // start image
        image: form.image({ default: 'comfy', defaultComfy: { type: 'ComfyImage', imageName: 'example.png' } }),
        // elevation
        elevation: form.float({ default: 10 }),
        // angle / azimuth
        steps: form.int({ min: 1, max: 100, default: 20 }),
        from: form.float({ min: -180, max: 180, default: -180 }),
        to: form.float({ min: -180, max: 180, default: 180 }),
        step: form.float({ min: 0.1, max: 180, default: 10 }),
        upscale: form.bool({ default: false }),
    }),

    // execution logic
    run: async (run, ui) => {
        // 1. ensure we have the model present
        const mainHost = run.Hosts.main
        mainHost.downloadFileIfMissing(
            'https://huggingface.co/stabilityai/stable-zero123/resolve/main/stable_zero123.ckpt',
            `${mainHost.absolutPathToDownloadModelsTo}/stable_zero123.ckpt`,
        )

        // 2.
        const graph = run.nodes
        const ckpt = graph.ImageOnlyCheckpointLoader({ ckpt_name: 'stable_zero123.ckpt' })
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

app({
    metadata: {
        name: 'aaaa',
        description: 'tset',
    },
    ui: (form) => ({
        orbit: form.orbit({}),
        image: form.image({ default: 'comfy', defaultComfy: { type: 'ComfyImage', imageName: 'example.png' } }),
    }),
    run: async (run, ui) => {
        const graph = run.nodes
        const ckpt = graph.ImageOnlyCheckpointLoader({ ckpt_name: 'stable_zero123.ckpt' })
        const startImage2 = await run.loadImageAnswer(ui.image)
        const upscale_model = graph.Upscale_Model_Loader({ model_name: 'RealESRGAN_x2.pth' })
        const sz123 = graph.StableZero123$_Conditioning({
            width: 256,
            height: 256,
            batch_size: 1,
            elevation: ui.orbit.elevation,
            azimuth: ui.orbit.azimuth,
            clip_vision: ckpt.outputs.CLIP_VISION,
            init_image: startImage2,
            vae: ckpt,
        })
        let latent: _LATENT = graph.KSampler({
            seed: run.randomSeed(),
            steps: 20,
            cfg: 4,
            sampler_name: 'euler',
            scheduler: 'sgm_uniform',
            denoise: 1,
            model: ckpt,
            positive: sz123.outputs.positive,
            negative: sz123.outputs.negative,
            latent_image: sz123,
        })

        // run.add_previewImageWithAlpha(latent)
        graph.SaveImage({ images: graph.VAEDecode({ samples: latent, vae: ckpt }) })
        await run.PROMPT()
        if (run.isCurrentDraftAutoStartEnabled() && run.isCurrentDraftDirty()) {
            console.log(`[👙] 1. isCurrentDraftAutoStartEnabled: ${run.isCurrentDraftAutoStartEnabled()}`)
            console.log(`[👙] 1. isCurrentDraftDirty: ${run.isCurrentDraftDirty()}`)
            return
        }

        // Keep gooing if more time available ---------------------------------------------------------
        // if (ui.highResFix) {
        // if (ui.highResFix.saveIntermediaryImage) {
        //     graph.SaveImage({ images: graph.VAEDecode({ samples: latent, vae }) })
        // }
        const ckpt2 = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v121.safetensors' })
        latent = graph.LatentUpscale({
            samples: latent,
            crop: 'disabled',
            upscale_method: 'nearest-exact',
            height: 512,
            width: 512,
        })
        latent = latent = run_sampler(
            run,
            {
                seed: run.randomSeed(),
                cfg: 4,
                steps: 15,
                denoise: 0.6,
                sampler_name: 'ddim',
                scheduler: 'ddim_uniform',
            },
            {
                latent,
                preview: false,
                ckpt: ckpt2,
                clip: ckpt2,
                vae: ckpt2,
                negative: run.formatEmbeddingForComfyUI('EasyNegative'),
                positive: '3dcg, toy dinosaur, green',
            },
        ).latent

        graph.SaveImage({ images: graph.VAEDecode({ samples: latent, vae: ckpt }) })
        await run.PROMPT()
    },
})
