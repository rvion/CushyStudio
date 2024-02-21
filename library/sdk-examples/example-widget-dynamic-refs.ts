import { isObservable, isObservableProp } from 'mobx'

app({
    metadata: {
        help: 'This is an example app to show how you can reference dynamically items from a list',
    },
    ui: (form) => {
        // 🔶 if you want to use a form dynamically,
        // for now, you need to form.shared first aroudn it
        const listOfStuff = form.shared(
            'test1',
            form.list({
                label: 'Sampler',
                defaultLength: 3,
                // min: 1,
                element: (i: number) => form.string({ default: `hello ${i}` }),
            }),
        )

        return {
            x: form.string(),
            listOfStuff,
            listOfRefs: form.list({
                defaultLength: 3,
                // min: 1,
                element: () =>
                    form.selectOne({
                        label: 'dynamic-test',
                        choices: (x) => {
                            const CHOICES = listOfStuff.shared.items.map((item, ix) => ({
                                id: item.serial.id,
                                label: item.value,
                            }))
                            console.log(`[🤠] ready`, CHOICES)
                            return CHOICES
                        },
                    }),
            }),
        }
    },
    run(run, ui) {
        console.log(`[🟢] done`)
    },
})
