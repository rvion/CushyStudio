app({
    ui: (form) => ({
        size: form.size({}),
        size_1000: form.size({
            step: 1000,
        }),
    }),
    run: async (flow, form) => {},
})
