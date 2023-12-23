import { exhaust } from 'src/utils/misc/ComfyUtils'

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
        if (form.examleChoice.group) {
            flow.output_text(`got a group: ${JSON.stringify(form.examleChoice.group)}`)
        }
        if (form.examleChoice.list) {
            flow.output_text(`got a list: ${JSON.stringify(form.examleChoice.list)}`)
        }
        if (form.examleChoice.image) {
            flow.output_text(`got an image: ${JSON.stringify(form.examleChoice.image)}`)
        }
    },
})
