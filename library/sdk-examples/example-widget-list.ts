app({
    ui: (form) => {
        const int0To10 = form.int({ min: 0, max: 10 })
        return {
            basicList: form.list({
                element: int0To10,
            }),
            minMax: form.list({
                min: 2,
                max: 4,
                element: int0To10,
            }),
            startWith3Items: form.list({
                defaultLength: 3,
                element: int0To10,
            }),
            listOfGroups: form.list({
                defaultLength: 2,
                element: form.group({
                    items: {
                        foo: form.string(),
                        bar: int0To10,
                    },
                }),
            }),
        }
    },

    run: async (flow, form) => {
        const DEBUG = JSON.stringify(form, null, 3)
        flow.output_text(`basicList: ${DEBUG}`)
    },
})
