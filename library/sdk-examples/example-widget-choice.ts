app({
    metadata: {
        help: 'This is an example app to show how to use the `choice` widget. It is not meant to be useful.',
    },
    ui: (form) => ({
        exampleChoice: form.choice({
            items: {
                image: form.image({}),
                list: form.list({ element: () => form.int({}) }),
                group: form.group({
                    items: () => ({
                        x: form.markdown({ markdown: '## Hello world' }),
                        c: form.int({}),
                        d: form.string({}),
                    }),
                }),
            },
        }),
        exampleChoiceAsTabs: form.choice({
            appearance: 'tab',
            items: {
                image: form.image({}),
                list: form.list({ element: () => form.int({}) }),
                group: form.group({
                    items: () => ({
                        x: form.markdown({ markdown: '## Hello world' }),
                        c: form.int({ max: 50 }),
                        d: form.string({}),
                    }),
                }),
            },
        }),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes
        //   👇 < should be infered as (string | number)
        form.exampleChoice
        if (form.exampleChoice.group) {
            flow.output_text(`got a group: ${JSON.stringify(form.exampleChoice.group)}`)
        }
        if (form.exampleChoice.list) {
            flow.output_text(`got a list: ${JSON.stringify(form.exampleChoice.list)}`)
        }
        if (form.exampleChoice.image) {
            flow.output_text(`got an image: ${JSON.stringify(form.exampleChoice.image)}`)
        }
    },
})
