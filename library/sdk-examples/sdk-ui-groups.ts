app({
    // name: 'playground-seed-widget',
    ui: (form) => ({
        nesstedGroups: form.group({
            items: {
                Jack: form.string({ default: 'gold, Knight' }),
                AAAAA: form.group({
                    items: {
                        Jack: form.string({ default: 'gold, Knight' }),
                        foo: form.group({
                            layout: 'H',
                            items: {
                                Jack: form.string({ default: 'gold, Knight' }),
                                Queen: form.string({ default: 'gold, Queen' }),
                                King: form.string({ default: 'gold, King' }),
                            },
                        }),
                        Queen: form.string({ default: 'gold, Queen' }),
                        King: form.string({ default: 'gold, King' }),
                    },
                }),
                Queen: form.string({ default: 'gold, Queen' }),
                King: form.string({ default: 'gold, King' }),
            },
        }),
    }),

    run: async (flow, form) => {
        flow.output_text(`form is: ${JSON.stringify(form, null, 4)}`)
    },
})
