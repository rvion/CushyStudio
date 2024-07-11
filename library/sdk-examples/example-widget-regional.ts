import { run_prompt } from '../built-in/_prefabs/prefab_prompt'

app({
    ui: (form) => ({
        demo: form.regional({
            height: 512,
            width: 512,
            initialPosition: ({ width: w, height: h }) => ({
                fill: `#${Math.round(Math.random() * 0xffffff).toString(16)}`,
                height: 64,
                width: 64,
                depth: 1,
                x: Math.round(Math.random() * w),
                y: Math.round(Math.random() * h),
                z: 1,
            }),
            element: ({ width: w, height: h }) =>
                form.group({
                    items: {
                        prompt: form.prompt({}),
                        mode: form.selectOne({
                            choices: [{ id: 'combine' }, { id: 'concat' }],
                        }),
                    },
                }),
        }),
        // mainPos: form.prompt({}),
        mainNeg: form.prompt({}),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes

        let ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v122.safetensors' })
        let clip = ckpt
        let vae = ckpt

        // let positive: _CONDITIONING = run_prompt(flow, { richPrompt: form.mainPos, clip: ckpt, ckpt: ckpt }).conditionning
        let positive: _CONDITIONING = graph.ConditioningZeroOut({
            conditioning: graph.CLIPTextEncode({ clip: clip, text: '' }),
        })
        let negative: _CONDITIONING = run_prompt({ prompt: form.mainNeg, clip: ckpt, ckpt: ckpt }).conditioning

        for (const { shape: x, value: item } of form.demo.items) {
            const y = run_prompt({ prompt: item.prompt, clip: ckpt, ckpt: ckpt })
            const localConditionning = graph.ConditioningSetArea({
                conditioning: y.conditioning,
                height: x.height * (x.scaleX ?? 1),
                width: x.width * (x.scaleY ?? 1),
                x: x.x,
                y: x.y,
                strength: 1,
            })

            positive =
                item.mode.id === 'combine'
                    ? graph.ConditioningCombine({
                          conditioning_1: positive,
                          conditioning_2: localConditionning,
                      })
                    : graph.ConditioningConcat({
                          conditioning_from: localConditionning,
                          conditioning_to: positive,
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
                        width: form.demo.area.width,
                        height: form.demo.area.height,
                    }),
                }),
            }),
        })
        await flow.PROMPT()
    },
})
