app({
    ui: (form) => ({
        multiChoice: form.choices({
            items: {
                testInt: () => form.int({}),
                testString: () => form.string({}),
                testGroup: () => form.group({ items: () => ({ c1: form.string({}), c2: form.string({}) }) }),
                testList: () => form.list({ element: () => form.string({}) }),
            },
        }),
        multiChoiceAsTabs: form.choices({
            appearance: 'tab',
            items: {
                testInt: () => form.int({}),
                testString: () => form.string({}),
                testGroup: () => form.group({ items: () => ({ c1: form.string({}), c2: form.string({}) }) }),
                testList: () => form.list({ element: () => form.string({}) }),
            },
        }),
    }),

    run: async (run, form) => {
        const foo = form.foo
        const out: string[] = []
        //                          infered as (number) 👇
        if (foo.testInt != null) out.push(`got a number: ${foo.testInt}`)
        //                             infered as (string) 👇
        if (foo.testString != null) out.push(`got a string: ${foo.testString}`)
        //                                                    infered as (string) 👇
        if (foo.testGroup != null) out.push(`got a group: ${JSON.stringify(foo.testGroup.c1)}`)
        //                                      infered as (number) 👇
        if (foo.testList != null) out.push(`got a list with ${foo.testList.length}: ${JSON.stringify(foo.testList)}`)
        run.output_Markdown(out.join('\n\n'))
    },
})
