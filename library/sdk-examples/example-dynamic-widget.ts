/**🔶 This is an advanced example of the runtime updating the widget live during runtime */
app({
    ui: (ui) => ({
        list: ui.list({
            element: () => ui.number({}),
        }),
    }),

    run: async (run) => {
        // add a item dynamically
        run.formInstance.fields.list.addItem()

        // then repeatedly update the value of the items
        for (const _ of [1, 2, 3, 4, 5]) {
            await run.sleep(100)
            run.formInstance.fields.list.items.map((i) => {
                i.serial.val += 3
            })
        }
    },
})
