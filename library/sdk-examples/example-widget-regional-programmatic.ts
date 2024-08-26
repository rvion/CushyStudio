app({
    metadata: {
        name: 'example prompt programmatic',
        description: 'my app description',
    },
    ui: (ui) => ({
        userMessage: ui.string({ textarea: true }),
        llmModel: ui.llmModel(),
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
            element: () =>
                ui.fields({
                    prompt: ui.prompt({}),
                    mode: ui.selectOneString(['combine', 'concat']),
                }),
        }),
        button: ui.button({ onClick: () => void cushy.showConfettiAndBringFun() }),
    }),
    run: async (run, ui) => {
        const regional = run.form.fields.regionalPrompt
        const newItem = regional.fields.items.addItem()!
        newItem.value.shape.width = 256
        newItem.value.shape.height = 256
        newItem.value.shape.x = 0
        newItem.value.shape.y = 128
        newItem.fields.value.fields.prompt.text = `Set to dynamic prompt at ${Date.now()}`
    },
})
