import type { OpenRouter_Models } from 'src/llm/OpenRouter_models'

import { openRouterInfos } from 'src/llm/OpenRouter_infos'

app({
    ui: (ui) => ({
        topic: ui.string({ textarea: true }),
        model: ui.selectOne({
            choices: Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name })),
        }),
    }),

    run: async (sdk, ui) => {
        // ask LLM to generate
        const llmResult = await sdk.llm_ask_PromptMaster(ui.topic, ui.model.id)
        const positiveTxt = llmResult.prompt

        sdk.output_text(positiveTxt)

        // generate an image
        const graph = sdk.create_ComfyUIWorkflow()
        const builder = graph.builder
        const model = builder.CheckpointLoaderSimple({ ckpt_name: 'lyriel_v15.safetensors' })
        builder.PreviewImage({
            images: builder.VAEDecode({
                vae: model,
                samples: builder.KSampler({
                    latent_image: builder.EmptyLatentImage({}),
                    model: model,
                    sampler_name: 'ddim',
                    scheduler: 'ddim_uniform',
                    positive: builder.CLIPTextEncode({ clip: model, text: positiveTxt }),
                    negative: builder.CLIPTextEncode({ clip: model, text: 'nsfw, nude' }),
                }),
            }),
        })

        const prompt = await graph.PROMPT({ step: sdk.step })
        await prompt.finished
    },
})
