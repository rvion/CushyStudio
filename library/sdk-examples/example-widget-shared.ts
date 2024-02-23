app({
    metadata: {
        description: 'show how to re-use part of the drafts in various places.',
    },
    ui: (form) => {
        const test1 = form.shared('test1', form.string())
        const test2 = form.shared('test2', form.group({ items: { foo: test1, bar: form.number() } }))
        return {
            a: test2,
            b: test2,
            k1: test1,
            k2: test1,
            d: form.group({
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
