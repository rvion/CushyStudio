app({
    metadata: {
        name: 'Example custom renderer',
        illustration: 'library/built-in/_illustrations/mc.jpg',
        description: 'Example of a custom renderer',
    },
    ui: (ui) => ({
        a: ui.header('Custom with a group header using child widgets:'),
        testA: ui.fields(
            { a: ui.int(), b: ui.string(), c: ui.string() },
            {
                header: ({ field }) => (
                    <div tw='flex'>
                        👉 {field.fields.a.header()} ({field.fields.b.header()}) ({field.fields.a.header()}) 👈
                    </div>
                ),
            },
        ),

        b: ui.header('Same as above, but without body:'),
        testB: ui.fields(
            { a: ui.int(), b: ui.string(), c: ui.string() },
            {
                body: null,
                header: () => <div tw='flex'>nothing to see here</div>,
            },
        ),

        c: ui.header('Custom boolean header wrapping the default:'),
        testC: ui.bool({
            header: ({ field: widget }) => (
                <div tw='flex-1 flex whitespace-nowrap'>
                    <div
                        tw='px-1 cursor-pointer'
                        style={{ border: '3px solid red' }}
                        onClick={() => (widget.value = !widget.value)}
                    >
                        click here
                    </div>
                    <div tw='ml-auto flex flex-nowrap'>(default UI: 👉 {widget.defaultHeader()} 👈)</div>
                </div>
            ),
        }),

        d: ui.header('Custom string body:'),
        testD: ui.string({
            body: ({ field: widget }) => <div>the string is {widget.value.length} char long.</div>,
        }),
    }),
    run: (ctx) => {},
})
