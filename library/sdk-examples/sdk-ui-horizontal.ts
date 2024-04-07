app({
    ui: (form) => ({
        foo: form.group({
            layout: 'H',
            items: {
                a: form.int({}),
                b: form.int({}),
            },
        }),
        bar: form.group({
            layout: 'H',
            items: {
                a: form.int({}),
                b: form.int({}),
            },
        }),
    }),
    run: async (flow, form) => {},
})
