app({
    metadata: {
        description: 'show how to re-use part of the drafts in various places.',
    },
    ui: (ui) => ({
        foo: ui.string(),
        root: ui.with(
            ui.fields({
                xx: ui.int(),
                yy: ui.string(),
            }),
            (int) =>
                ui.fields({
                    foo2: ui.int(),
                    foo1: ui.linked(int),
                    foo3: ui.linked(int),
                }),
        ),
        demoChanel: ui
            .fields({
                foo: ui.int().publish('foo', (self) => self.value),
                bar: ui.int().subscribe('foo', (value: number, self) => {
                    self.value = value + 1
                }),
            })
            .list(),
        toto: ui.int().subscribe('foo', (value: number, self) => {
            self.value = value + 1
        }),
    }),

    run: async (sdk, ui) => {
        console.clear()
        console.log(`[🤠] `, JSON.stringify(ui))
        debugger
    },
})
