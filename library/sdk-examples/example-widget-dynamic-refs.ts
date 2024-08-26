app({
    metadata: {
        help: 'This is an example app to show how you can reference dynamically items in a list from an other list',
    },
    ui: (ui) => {
        // 🔶 if you want to use a form dynamically,
        // for now, you need to form.shared first aroudn it

        return {
            root: ui
                .list({
                    label: 'Sampler',
                    defaultLength: 2,
                    // min: 1,
                    element: (i: number) => ui.string({ default: `hello ${i}` }),
                })
                .useIn((listOfStuff) =>
                    ui.fields({
                        _1: ui.header({ markdown: `#### Define values:`, label: false, border: false }),
                        listOfStuff,
                        _2: ui.header({ markdown: `#### Reference values (select):`, label: false, border: false }),
                        listOfRefs: ui.list({
                            defaultLength: 1,
                            element: ui.selectOneOption(
                                listOfStuff.items.map((item) => ({ id: item.id, label: item.value })),
                                { label: 'dynamic OneOf' },
                            ),
                        }),
                        listOfRefs2: ui.list({
                            defaultLength: 1,
                            element: ui.selectManyOptions(
                                listOfStuff.items.map((item) => ({ id: item.id, label: item.value })),
                                { label: 'dynamic Many' },
                            ),
                        }),
                        _3: ui.header({ markdown: `#### Reference values (tabs):`, label: false, border: false }),
                        refs4: ui.list({
                            defaultLength: 1,
                            element: ui.selectOneOption(
                                listOfStuff.items.map((item) => ({ id: item.id, label: item.value })),
                                { label: 'dynamic OneOf(tab)', appearance: 'tab' },
                            ),
                        }),
                        refs5: ui.list({
                            defaultLength: 1,
                            element: ui.selectManyOptions(
                                listOfStuff.items.map((item) => ({ id: item.id, label: item.value })),
                                { label: 'dynamic Many(tab)', appearance: 'tab' },
                            ),
                        }),
                    }),
                ),
        }
    },
    run(run, ui) {
        console.log(`[🟢] done`)
    },
})
