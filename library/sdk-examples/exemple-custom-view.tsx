const demoView = view<{ emoji: string }>({
    preview: (p) => <div>{p.emoji}</div>,
    render: (p) => <div>hello, you picked the emoji {p.emoji}</div>,
})

app({
    metadata: { name: 'Custom view demo', description: 'Demo of a custom view' },
    ui: (b) => b.empty(),
    run: async (run, ui) => {
        run.output_custom({
            view: demoView,
            params: {
                emoji: '❤️',
            },
        })
    },
})
