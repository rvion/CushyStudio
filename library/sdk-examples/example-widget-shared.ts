app({
    metadata: {
        description: 'show how to re-use part of the drafts in various places.',
    },
    ui: (form) => {
        return {
            root: form.with(form.string(), (test1) =>
                form.with(
                    form.fields({
                        foo: form.linked(test1),
                        bar: form.number(),
                    }),
                    (test2) =>
                        form.fields({
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
                        }),
                ),
            ),
        }
    },

    run: async (sdk, ui) => {},
})
