action({
    name: 'background-removal-playground',
    ui: (form) => ({
        foo: form.choice({
            items: () => ({
                a: form.int({}),
                b: form.str({}),
            }),
        }),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes
        //   👇 < should be infered as (string | number)
        form.foo
        if (typeof form.foo === 'string') {
            flow.print(`got a string: ${form.foo}`)
        } else {
            //   👇 should be infered as number
            const x = form.foo
            flow.print(`got a number: ${form.foo}`)
        }
    },
})
