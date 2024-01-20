app({
    ui: (form) => ({
        foo: form.choices({
            items: {
                testInt: () => form.int({}),
                testString: () => form.string({}),
                testGroup: () => form.group({ items: () => ({ c1: form.string({}), c2: form.string({}) }) }),
                testList: () => form.list({ element: () => form.string({}) }),
            },
        }),
    }),

    run: async (flow, form) => {
        const foo = form.foo
        //                          infered as (number) 👇
        if (foo.testInt) flow.output_text(`got a number: ${foo.testInt}`)
        //                             infered as (string) 👇
        if (foo.testString) flow.output_text(`got a string: ${foo.testString}`)
        //                                                    infered as (string) 👇
        if (foo.testGroup) flow.output_text(`got a group: ${JSON.stringify(foo.testGroup.c1)}`)
        //                                      infered as (number) 👇
        if (foo.testList) flow.output_text(`got a list with ${foo.testList.length}: ${JSON.stringify(foo.testList)}`)
    },
})
