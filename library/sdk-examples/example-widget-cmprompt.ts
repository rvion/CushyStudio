app({
    ui: (form) => ({
        promptV2: form.prompt({}),
    }),

    run: async (flow, form) => {
        const DEBUG = JSON.stringify(form, null, 3)
        flow.output_text(`basicList: ${DEBUG}`)
    },
})
