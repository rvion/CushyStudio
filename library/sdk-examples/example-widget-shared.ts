app({
    metadata: {
        description: 'show how to re-use part of the drafts in various places.',
    },
    ui: (ui) => {
        const test1 = ui.shared('test1', ui.string())
        const test2 = ui.shared('test2', ui.group({ items: { foo: test1, bar: ui.number() } }))
        return {
            a: test2,
            b: test2,
            k1: test1,
            k2: test1,
            d: ui.group({
                layout: 'H',
                items: {
                    x: test2,
                    y: test2,
                },
            }),
        }
    },

    run: async (sdk, ui) => {},
})
