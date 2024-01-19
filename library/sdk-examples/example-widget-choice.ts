import { exhaust } from 'src/utils/misc/ComfyUtils'

app({
    ui: (form) => ({
        exampleChoice: form.choice({
            items: {
                image: () => form.image({}),
                list: () => form.list({ element: () => form.int({}) }),
                group: () =>
                    form.group({
                        items: () => ({
                            x: form.markdown({ markdown: '## Hello world' }),
                            c: form.int({}),
                            d: form.str({}),
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
