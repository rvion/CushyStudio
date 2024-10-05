app({
    ui: (b) => {
        const int0To10 = b.int({ min: 0, max: 10 })
        return b.fields({
            basicList: b.list({
                element: int0To10,
            }),
            minMax: b.list({
                min: 2,
                max: 4,
                element: int0To10,
            }),
            startWith3Items: b.list({
                defaultLength: 3,
                element: int0To10,
            }),
            listOfGroups: b.list({
                defaultLength: 2,
                element: b.group({
                    items: {
                        foo: b.string(),
                        bar: int0To10,
                    },
                }),
            }),
        })
    },

    run: async (flow, form) => {
        const DEBUG = JSON.stringify(form, null, 3)
        flow.output_text(`basicList: ${DEBUG}`)
    },
})
