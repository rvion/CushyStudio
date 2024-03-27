app({
    metadata: {
        description: 'show how to re-use part of the drafts in various places.',
    },
    ui: (ui) => {
        const sharedString = ui.shared('test1', ui.int())
        return {
            a: sharedString,
            b: ui.int(),
            c: sharedString,
        }
    },

    run: async (sdk, ui) => {},
})
