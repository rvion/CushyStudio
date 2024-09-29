app({
    // name: 'playground-seed-widget',
    ui: (b) =>
        b.fields({
            nesstedGroups: b.group({
                items: {
                    Jack: b.string({ default: 'gold, Knight' }),
                    AAAAA: b.group({
                        items: {
                            Jack: b.string({ default: 'gold, Knight' }),
                            foo: b.group({
                                layout: 'H',
                                items: {
                                    Jack: b.string({ default: 'gold, Knight' }),
                                    Queen: b.string({ default: 'gold, Queen' }),
                                    King: b.string({ default: 'gold, King' }),
                                },
                            }),
                            Queen: b.string({ default: 'gold, Queen' }),
                            King: b.string({ default: 'gold, King' }),
                        },
                    }),
                    Queen: b.string({ default: 'gold, Queen' }),
                    King: b.string({ default: 'gold, King' }),
                },
            }),
        }),

    run: async (flow, form) => {
        flow.output_text(`form is: ${JSON.stringify(form, null, 4)}`)
    },
})
