app({
    ui: (form) => ({
        examleChoice: form.choice({
            items: () => ({
                image: form.image({}),
                list: form.list({ element: () => form.int({}) }),
                group: form.group({
                    items: () => ({
                        x: form.markdown({ markdown: '## Hello world' }),
                        c: form.int({}),
                        d: form.str({}),
                    }),
                }),
            }),
        }),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes
        //   👇 < should be infered as (string | number)
        form.examleChoice
        if (typeof form.examleChoice === 'string') {
            flow.output_text(`got a string: ${form.examleChoice}`)
        } else {
            //   👇 should be infered as number
            const x = form.examleChoice
            flow.output_text(`got a number: ${form.examleChoice}`)
        }
    },
})
