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
                element: () => form.string(),
            }),
        )

        return {
            x: form.string(),
            listOfStuff,
            listOfRefs: form.list({
                label: 'Sampler',
                defaultLength: 3,
                // min: 1,
                element: () =>
                    form.selectOne({
                        label: 'dynamic-test',
                        choices: (x) => {
                            // console.log(`[🤠] -----------------------------------------------------------------`)
                            // console.log(`[🤠] ${JSON.stringify(x.form.def.initialValue())}`)
                            // console.log(`[🤠] >> ${isObservableProp(listOfStuff, 'shared')}`)
                            // console.log(`[🤠] >> ${isObservableProp(listOfStuff.shared, 'items')}`)
                            // console.log(`[🤠] >> ${isObservableProp(listOfStuff.shared, 'items')}`)
                            // console.log(`[🤠] >> uid = (${listOfStuff.shared.type} ${listOfStuff.shared.memUId})`)
                            // console.log(`[🤠] >> items.length = ${listOfStuff.shared.items.length}`)
                            // console.log(`[🤠] >> serial.items_.length = ${listOfStuff.shared.serial.items_.length}`)
                            // console.log(`[🤠] >> ${x.form._ROOT.serial.values_.__test1__.items_.length}`)
                            // console.log(
                            //     `[🤠] >> ${
                            //         listOfStuff.shared.serial.items_ === x.form._ROOT.serial.values_.__test1__.items_.length
                            //     }`,
                            // )

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
