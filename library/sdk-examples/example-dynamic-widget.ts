/**🔶 This is an advanced example of the runtime updating the widget live during runtime */
app({
    ui: (ui) => ({
        demo1: ui.number().list(),
    }),

    run: async (run) => {
        // add a item dynamically
        run.form.fields.demo1.addItem()

        // then repeatedly update the value of the items
        for (const _ of [1, 2, 3, 4, 5]) {
            await run.sleep(100)
            run.form.fields.demo1.items.map((i) => {
                i.value += 3
            })
        }
    },
})
