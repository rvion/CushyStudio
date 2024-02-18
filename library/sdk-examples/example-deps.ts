app({
    metadata: {
        description: '🔴 This is a broken app app; adding that here to monitor how cushy handle those.',
    },
    ui: (ui) => {
        const test1 = ui.group({
            items: () => ({
                foo: ui.string(),
                bar: ui.string(),
            }),
        })

        return {
            a: test1,
            b: test1,
        }
    },

    run: async (sdk, ui) => {},
})
