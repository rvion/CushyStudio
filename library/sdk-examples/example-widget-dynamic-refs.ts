app({
    metadata: {
        help: 'This is an example app to show how you can reference dynamically items in a list from an other list',
    },
    ui: (ui) => {
        // 🔶 if you want to use a form dynamically,
        // for now, you need to form.shared first aroudn it
        const listOfStuff = ui.shared(
            'test1',
            ui.list({
                label: 'Sampler',
                defaultLength: 2,
                // min: 1,
                element: (i: number) => ui.string({ default: `hello ${i}` }),
            }),
        )

        return {
            _1: ui.header({ markdown: `#### Define values:`, label: false, border: false }),
            listOfStuff,
            _2: ui.header({ markdown: `#### Reference values (select):`, label: false, border: false }),
            listOfRefs: ui.list({
                defaultLength: 1,
                element: ui.selectOne({
                    label: 'dynamic-test',
                    choices: (x) => listOfStuff.shared.items.map((item, ix) => ({ id: item.serial.id, label: item.value })),
                }),
            }),
            listOfRefs2: ui.list({
                defaultLength: 1,
                element: ui.selectMany({
                    label: 'dynamic-test',
                    choices: (x) => listOfStuff.shared.items.map((item, ix) => ({ id: item.serial.id, label: item.value })),
                }),
            }),
            _3: ui.header({ markdown: `#### Reference values (tabs):`, label: false, border: false }),
            refs4: ui.list({
                defaultLength: 1,
                element: ui.selectOne({
                    label: 'dynamic-test',
                    appearance: 'tab',
                    choices: (x) => listOfStuff.shared.items.map((item, ix) => ({ id: item.serial.id, label: item.value })),
                }),
            }),
            refs5: ui.list({
                defaultLength: 1,
                element: ui.selectMany({
                    label: 'dynamic-test',
                    appearance: 'tab',
                    choices: (x) => listOfStuff.shared.items.map((item, ix) => ({ id: item.serial.id, label: item.value })),
                }),
            }),
        }
    },
    run(run, ui) {
        console.log(`[🟢] done`)
    },
})
