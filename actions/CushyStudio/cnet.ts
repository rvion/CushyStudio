action('CNET', {
    author: 'rvion',
    priority: 1,
    help: 'test controlnet preprocessors',
    ui: (form) => ({
        scribblePreprocessor: form.groupOpt({
            items: () => ({
                threeshold: form.int({}),
                // resolution: from.int({})
            }),
        }),
    }),
    run: async (flow, p) => {},
})
