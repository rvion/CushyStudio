import { isObservableProp } from 'mobx'

app({
    ui: (form) => {
        // 🔶 if you want to use a form dynamically,
        // for now, you need to form.shared first aroudn it
        const listOfStuff = form.shared(
            'test1',
            form.list({
                label: 'Sampler',
                defaultLength: 3,
                min: 1,
                element: () => form.string(),
            }),
        )

        return {
            listOfStuff,
            listOfRefs: form.list({
                label: 'Sampler',
                defaultLength: 3,
                min: 1,
                element: () =>
                    form.selectOne({
                        label: 'dynamic-test',
                        choices: () => {
                            console.log(
                                `[👙] ready| isobservable`,
                                isObservableProp(listOfStuff.shared, 'items'),
                                listOfStuff.shared.items.length,
                            )
                            const CHOICES = listOfStuff.shared.items.map((item, ix) => ({
                                id: item.serial.id,
                                label: item.value,
                            }))
                            console.log(`[🔴] ready`, CHOICES)
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
