app({
    ui: (form) => ({
        doc: form.markdown({
            label: false,
            markdown:
                '`select{One,Many,OneOrCustom,ManyOrCustom}` easily allow list selection. those are less typed than their form.choice{...} alternatives, but quite versatiles',
        }),
        selectOneBasic: form.selectOne({
            choices: [
                { label: 'one', id: 'one' },
                { label: 'two', id: 'two' },
                { label: 'three', id: 'three' },
            ],
        }),
        selectOneMetadata: form.selectOne({
            choices: [
                { label: 'one', id: 'one', foo: 1 },
                { label: 'two', id: 'two', bar: 2 },
                { label: 'three', id: 'three', baz: 3 },
            ],
        }),
        selectMany: form.selectMany({
            choices: [
                { label: 'one', id: 'one', foo: 1 },
                { label: 'two', id: 'two', bar: 2 },
                { label: 'three', id: 'three', baz: 3 },
            ],
        }),
        // ability to add metadata to choice
        // minMax: form.list({
        //     min: 2,
        //     max: 4,
        //     element: () => form.int({}),
        // }),
        // startWith3Items: form.list({
        //     defaultLength: 3,
        //     element: () => form.int({}),
        // }),
    }),

    run: async (flow, form) => {
        const DEBUG = JSON.stringify(form, null, 3)
        flow.output_text(`basicList: ${DEBUG}`)
    },
})
