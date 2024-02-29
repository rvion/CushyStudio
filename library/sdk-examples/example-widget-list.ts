app({
    ui: (form) => ({
        basicList: form.list({
            element: form.int(),
        }),
        minMax: form.list({
            min: 2,
            max: 4,
            element: form.int(),
        }),
        startWith3Items: form.list({
            defaultLength: 3,
            element: form.int(),
        }),
        listOfGroups: form.list({
            defaultLength: 2,
            element: form.group({
                items: {
                    foo: form.string(),
                    bar: form.number(),
                },
            }),
        }),
    }),

    run: async (flow, form) => {
        const DEBUG = JSON.stringify(form, null, 3)
        flow.output_text(`basicList: ${DEBUG}`)
    },
})
