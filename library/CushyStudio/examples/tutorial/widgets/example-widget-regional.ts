import { run_prompt } from 'library/CushyStudio/default/_prefabs/prefab_prompt'

card({
    ui: (form) => ({
        demo: form.regional({
            h: 512,
            w: 512,
            element: ({ w, h }) => ({
                fill: `#${Math.round(Math.random() * 0xffffff).toString(16)}`,
                h: 64,
                w: 64,
                x: Math.round(Math.random() * w),
                y: Math.round(Math.random() * h),
                item: form.prompt({}),
            }),
        }),
        mainPos: form.prompt({}),
        mainNeg: form.prompt({}),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes

        let ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v122.safetensors' })
        let clip = ckpt
        let vae = ckpt

        let positive: _CONDITIONING = run_prompt(flow, { richPrompt: form.mainPos, clip: ckpt, ckpt: ckpt }).conditionning
        let negative: _CONDITIONING = run_prompt(flow, { richPrompt: form.mainNeg, clip: ckpt, ckpt: ckpt }).conditionning

        for (const x of form.demo.items) {
            const y = run_prompt(flow, { richPrompt: x.item, clip: ckpt, ckpt: ckpt })
            const conditioning = y.conditionning
            const localConditionning = graph.ConditioningSetArea({
                conditioning,
                height: x.h * (x.scaleX ?? 1),
                width: x.w * (x.scaleY ?? 1),
                x: x.x,
                y: x.y,
                strength: 1,
            })
            positive = graph.ConditioningCombine({
                conditioning_1: positive,
                conditioning_2: localConditionning,
            })
        }

        graph.PreviewImage({
            images: graph.VAEDecode({
                vae,
                samples: graph.KSampler({
                    seed: flow.randomSeed(),
                    model: ckpt,
                    sampler_name: 'ddim',
                    scheduler: 'ddim_uniform',
                    positive: positive,
                    negative: negative,
                    latent_image: graph.EmptyLatentImage({
                        batch_size: 1,
                        width: form.demo.w,
                        height: form.demo.h,
                    }),
                }),
            }),
        })
        await flow.PROMPT()
    },
})
