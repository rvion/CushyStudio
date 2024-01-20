app({
    // name: 'playground-seed-widget',
    ui: (form) => ({
        nesstedGroups: form.group({
            items: () => ({
                Jack: form.str({ default: 'gold, Knight' }),
                AAAAA: form.group({
                    items: () => ({
                        Jack: form.str({ default: 'gold, Knight' }),
                        foo: form.group({
                            layout: 'H',
                            items: () => ({
                                Jack: form.str({ default: 'gold, Knight' }),
                                Queen: form.str({ default: 'gold, Queen' }),
                                King: form.str({ default: 'gold, King' }),
                            }),
                        }),
                        Queen: form.str({ default: 'gold, Queen' }),
                        King: form.str({ default: 'gold, King' }),
                    }),
                }),
                Queen: form.str({ default: 'gold, Queen' }),
                King: form.str({ default: 'gold, King' }),
            }),
        }),
    }),

    run: async (flow, form) => {
        flow.output_text(`form is: ${JSON.stringify(form, null, 4)}`)
    },
})
