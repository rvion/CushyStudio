app({
    metadata: {
        name: 'Logo generator',
        description: 'generate a social site card for your project',
    },
    ui: (form) => ({
        title: form.string({ placeHolder: 'My Project' }),
    }),
    run: async (run, ui) => {
        //
    },
})
