import type { OpenRouter_Models } from 'src/llm/OpenRouter_models'

import { openRouterInfos } from 'src/llm/OpenRouter_infos'

const defaultSystemPrompt = [
    //
    `You are an assistant in charge of writing a prompt to be submitted to a stable distribution ai image generative pipeline.`,
    `Write a prompt describing the user submited topic in a way that will help the ai generate a relevant image.`,
    `Your answer must be arond 500 chars in length`,
    `Start with most important words describing the prompt`,
    `Include lots of adjective and adverbs. no full sentences. remove useless words`,
    `try to include a long list of comma separated words.`,
    'Once main keywords are in, if you still have character to add, include vaiours beauty or artsy words',
    `ONLY answer with the prompt itself. DO NOT answer anything else. No Hello, no thanks, no signature, no nothing.`,
].join('\n')

app({
    ui: (ui) => ({
        topic: ui.string({ textarea: true, default: 'world tree, fantasy, epic, majestic' }),
        llmModel: ui.selectOne({
            choices: Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name })),
        }),
        customSystemMessage: ui.group({
            startCollapsed: true,
            items: {
                system: ui.string({
                    textarea: true,
                    default: defaultSystemPrompt,
                    tooltip:
                        'Try experimenting with the system prompt. You may get better results from different models depending on how specific the instructions are.',
                }),
            },
        }),
        promptFromLlm: ui.markdown({
            markdown: ``,
        }),
        ckpt_name: ui.enum.Enum_CheckpointLoaderSimple_ckpt_name({
            default: 'revAnimated_v122.safetensors',
            label: 'Checkpoint',
        }),
    }),

    run: async (sdk, ui) => {
        if (!sdk.LLM.isConfigured) {
            sdk.output_text(`Enter your api key in Config`)
            return
        }

        // ask LLM to generate
        const llmResult = await sdk.LLM.expandPrompt(ui.topic, ui.llmModel.id, ui.customSystemMessage.system)
        const positiveTxt = llmResult.prompt

        sdk.formInstance.fields.promptFromLlm.config.markdown = positiveTxt

        // generate an image
        const graph = sdk.ComfyUI.create_basicWorkflow({
            positivePrompt: positiveTxt,
            chekpointName: ui.ckpt_name,
        })

        await graph.sendPromptAndWaitUntilDone()
    },
})
