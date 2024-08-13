const TOTAL_DURATION = 40
app({
    metadata: {
        name: 'AnimateDiff v0.1',
        illustration: 'library/built-in/_illustrations/mc.jpg',
        description: 'Minimalist AnimateDiff example',
    },
    ui: (form) => ({
        preText: form.string({
            default: ' (Masterpiece, best quality:1.2), closeup, close-up, a girl in a forest',
        }),
        seed: form.int({}).optional(),
        timeline: form.timeline({
            width: TOTAL_DURATION,
            height: 2,
            element: ({ ix }) => form.prompt({}),
            initialPosition: ({ ix }) => ({
                width: 0.25 * TOTAL_DURATION,
                x: TOTAL_DURATION * (ix / 4),
            }),
        }),
        // text: form.str({
        //     textarea: true,
        //     default: [
        //         `"0" :"spring day, blossoms, flowers, cloudy",`,
        //         `"4" :"summer day, sunny, leaves",`,
        //         `"8" :"fall day, colorful leaves dancing in the wind",`,
        //         `"12" :"winter day, snowing, cold, jacket"`,
        //         ``,
        //     ].join('\n'),
        // }),
        removeBG: form.bool({ default: false }),
        samplerSteps: form.int({ default: 20 }),
        // frames: form.int({ default: 16, group: 'video' }),
    }),
    run: async (run, ui) => {
        const graph = run.nodes

        const checkpointLoaderSimpleWithNoiseSelect = graph.CheckpointLoaderSimpleWithNoiseSelect({
            ckpt_name: 'deliberate_v2.safetensors',
            beta_schedule: 'sqrt_linear (AnimateDiff)',
        })
        const vAE = graph.VAELoader({ vae_name: 'vae-ft-mse-840000-ema-pruned.safetensors' })
        const cLIPTextEncode = graph.CLIPTextEncode({
            text: '(bad quality, worst quality:1.2)',
            clip: checkpointLoaderSimpleWithNoiseSelect,
        })
        const aDE_AnimateDiffUniformContextOptions = graph.ADE$_AnimateDiffUniformContextOptions({
            context_length: 16,
            context_stride: 1,
            context_overlap: 4,
            context_schedule: 'uniform',
            closed_loop: false,
        })
        const aDE_AnimateDiffLoaderWithContext = graph.ADE$_AnimateDiffLoaderWithContext({
            model_name: 'mm_sd_v15_v2.ckpt',
            beta_schedule: 'sqrt_linear (AnimateDiff)',
            model: checkpointLoaderSimpleWithNoiseSelect,
            context_options: aDE_AnimateDiffUniformContextOptions,
        })
        const text = ui.timeline.items
            .map((entry) => {
                return `"${entry.shape.x}" : "${entry.value.text}"`
            })
            .join(',\n')
        const batchPromptSchedule = graph.BatchPromptSchedule({
            text: text, //'"0" :"spring day, blossoms, flowers, cloudy",\n"25" :"summer day, sunny, leaves",\n"50" :"fall day, colorful leaves dancing in the wind",\n"75" :"winter day, snowing, cold, jacket"\n',
            max_frames: 120,
            pre_text: ui.preText, //' (Masterpiece, best quality:1.2), closeup, close-up, a girl in a forest',
            app_text: '',
            pw_a: 0,
            pw_b: 0,
            pw_c: 0,
            pw_d: 0,
            clip: checkpointLoaderSimpleWithNoiseSelect,
        })
        const aDE_EmptyLatentImageLarge = graph.ADE$_EmptyLatentImageLarge({
            width: 512,
            height: 512,
            batch_size: ui.timeline.items.length, //100,
        })
        let kSampler = graph.KSampler({
            seed: ui.seed ?? run.randomSeed(),
            steps: ui.samplerSteps,
            cfg: 7,
            sampler_name: 'euler_ancestral',
            scheduler: 'normal',
            denoise: 1,
            model: aDE_AnimateDiffLoaderWithContext,
            positive: batchPromptSchedule as any /* 🔴 */,
            negative: cLIPTextEncode,
            latent_image: aDE_EmptyLatentImageLarge,
        })
        let vAEDecode
        if (ui.removeBG) {
            vAEDecode = graph.Image_Rembg_$1Remove_Background$2({
                images: graph.VAEDecode({ samples: kSampler, vae: vAE }),
                model: 'u2net',
                background_color: 'black',
            })
        } else {
            vAEDecode = graph.VAEDecode({ samples: kSampler, vae: vAE })
        }
        const save = graph.SaveImage({ filename_prefix: 'Images\\image', images: vAEDecode._IMAGE })
        // graph.SaveImage({
        //     images: graph.Write_to_Video({ image: vAEDecode, codec: 'H264' }),
        // })
        // const aDE_AnimateDiffCombine = graph.ADE_AnimateDiffCombine({
        //     frame_rate: 10,
        //     loop_count: 0,
        //     filename_prefix: 'AnimateDiff',
        //     format: 'image/gif',
        //     pingpong: false,
        //     save_image: true,
        //     // ad_gif_preview__0: '/view?filename=AnimateDiff_00001_.gif&subfolder=&type=output&format=image%2Fgif',
        //     images: vAEDecode.IMAGE,
        // })
        const gif = graph.Write_to_GIF({
            image: vAEDecode,
        })
        await run.PROMPT()
        await run.Videos.output_video_ffmpegGeneratedImagesTogether(undefined, 30, { transparent: ui.removeBG })
    },
})
