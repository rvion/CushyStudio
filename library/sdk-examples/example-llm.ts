import type { OpenRouter_Models } from 'src/llm/OpenRouter_models'

import { openRouterInfos } from 'src/llm/OpenRouter_infos'

app({
    ui: (ui) => ({
        topic: ui.string({ textarea: true }),
        llmModel: ui.selectOne({
            choices: Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name })),
        }),
        promptFromLlm: ui.markdown({
            markdown: ``,
        }),
        ckpt_name: ui.enum({
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
            default: 'revAnimated_v122.safetensors',
            group: 'Model',
            label: 'Checkpoint',
        }),
    }),

    run: async (sdk, ui) => {
        if (!sdk.llm_isConfigured) {
            sdk.output_text(`Enter your api key in Config`)
            return
        }

        // ask LLM to generate
        const llmResult = await sdk.llm_ask_PromptMaster(ui.topic, ui.llmModel.id)
        const positiveTxt = llmResult.prompt

        sdk.formInstance.state.values.promptFromLlm.input.markdown = positiveTxt

        // generate an image
        const graph = sdk.comfyui.create_ComfyUIWorkflow_forTestPurpose({
            positivePrompt: positiveTxt,
            chekpointName: ui.ckpt_name,
        })

        await graph.sendPromptAndWaitUntilDone()
    },
})
