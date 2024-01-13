app({
    metadata: {
        name: 'improve app',
        description: 'improve app',
    },

    ui: (form) => ({
        image: form.image({}),
    }),
    run: async (run, ui) => {},
    startFromImage: (image, form) => {
        form.values.image.state.pick === 'cushy'
    },
})
