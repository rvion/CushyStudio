app({
    metadata: {
        description: 'show how to re-use part of the drafts in various places.',
    },
    ui: (ui) => ({
        root: ui.with(ui.fields({ xx: ui.int(), yy: ui.string() }), (int) =>
            ui.fields({
                foo2: ui.int(),
                foo1: ui.linked(int),
                foo3: ui.linked(int),
            }),
        ),
    }),

    run: async (sdk, ui) => {
        console.clear()
        console.log(JSON.stringify(ui))
    },
})
