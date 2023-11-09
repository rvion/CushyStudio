card({
    // name: 'playground-seed-widget',
    ui: (form) => ({
        prompt: form.prompt({}),
        prompt2: form.prompt({}),
        seed3: form.markdown({ markdown: '' }),
    }),

    run: async (flow, form) => {},
})
