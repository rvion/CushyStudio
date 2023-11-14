/**
 *
 * 🔶 This example is pretty complex and very advanced.
 * 🔶 don't' copy what is in this file unless you know what you are doing
 * 🔶 and really need this.
 *
 */

card({
    ui: (form) => ({
        list: form.list({
            element: () => form.number({}),
        }),
        choice: form.selectOne({
            // choices: [{ type: 'a' }, { type: 'b' }, { type: 'c' }],
            choices: (f) => {
                console.log(`☃️ ---------------`)
                console.log(`☃️ A:`, f?.result ?? [])
                const out = ((f?.result?.list ?? ['coucou']) as any as number[]).map((i) => ({ type: i.toString() }))
                console.log(`☃️ B:`, out)
                return out
            },
        }),
        seed3: form.markdown({
            markdown: (f) =>
                [
                    //
                    `<pre>${JSON.stringify(f.result, null, 3)}</pre>`,
                ].join('\n'),
        }),
    }),

    run: async (flow, form) => {},
})
