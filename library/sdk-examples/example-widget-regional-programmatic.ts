import type { OpenRouter_Models } from 'src/llm/OpenRouter_models'

import { openRouterInfos } from 'src/llm/OpenRouter_infos'

app({
    metadata: {
        name: 'example prompt programmatic',
        description: 'my app description',
    },
    ui: (ui) => ({
        userMessage: ui.string({ textarea: true }),
        llmModel: ui.selectOne({
            // appearance: 'tab',
            choices: Object.entries(openRouterInfos).map(([id, info]) => ({
                id: id as OpenRouter_Models,
                label: info.name,
            })),
        }),
        regionalPrompt: ui.regional({
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
                ui.fields({
                    prompt: ui.prompt({}),
                    mode: ui.selectOne({
                        choices: [{ id: 'combine' }, { id: 'concat' }],
                    }),
                }),
        }),
        button: ui.button({ onClick: () => void cushy.showConfettiAndBringFun() }),
    }),
    run: async (run, ui) => {
        const regional = run.formInstance.fields.regionalPrompt
        regional.addItem()
        regional.entries[0]!.shape.width = 256
        regional.entries[0]!.shape.height = 256
        regional.entries[0]!.shape.x = 0
        regional.entries[0]!.shape.y = 128
        regional.entries[0]!.widget.fields.prompt.text = `Set to dynamic prompt at ${Date.now()}`
    },
})
