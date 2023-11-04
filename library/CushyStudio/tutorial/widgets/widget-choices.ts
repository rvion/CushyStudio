card({
    ui: (form) => ({
        foo: form.choices({
            items: () => ({
                testInt: form.int({}),
                testString: form.str({}),
                testGroup: form.group({ items: () => ({ c1: form.str({}), c2: form.str({}) }) }),
                testList: form.list({ element: () => form.str({}) }),
            }),
        }),
    }),

    run: async (flow, form) => {
        const foo = form.foo
        //                          infered as (number) 👇
        if (foo.testInt) flow.print(`got a number: ${foo.testInt}`)
        //                             infered as (string) 👇
        if (foo.testString) flow.print(`got a string: ${foo.testString}`)
        //                                                    infered as (string) 👇
        if (foo.testGroup) flow.print(`got a group: ${JSON.stringify(foo.testGroup.c1)}`)
        //                                      infered as (number) 👇
        if (foo.testList) flow.print(`got a list with ${foo.testList.length}: ${JSON.stringify(foo.testList)}`)
    },
})
