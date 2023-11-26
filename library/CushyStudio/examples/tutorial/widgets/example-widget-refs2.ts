/**
 * 🔶 This example is pretty complex and very advanced.
 * 🔶 don't' copy what is in this file unless you know what you are doing
 * 🔶 and really need this.
 */
app({
    ui: (form) => ({
        // first way to do: build the list of choice from the form result
        // 🔶 problem: this needs the referenced items to have some kind of `name` property
        // 🔶 problem 2: no id to keep things stable
        // 🔶 problem 3: please don't use this, skip to the example below
        // dynamicSelectOne: form.selectOne({
        //     choices: (form) => {
        //         const formResult = form?.result
        //         if (formResult == null) return []
        //         return (formResult as any).foos.map((i: { name: string }, index: number) => ({
        //             id: index,
        //             label: `#${index}: ${i.name}`,
        //         }))
        //     },
        // }),
        // ------------------------------------------------------------------------------------
        // second way to do: build the list of choice from the form serial
        // 🔶 problem: serial is
        dynamicSelectTwo: form.selectOne({
            choices: (form) => {
                const fomSerial = form?.serial
                if (fomSerial == null) return []
                const entries = fomSerial.values_.foos.items_
                return (entries as any).map((i: any, index: number) => ({
                    id: i.id,
                    label: `(${index + 1}th entry: ${i.values_.a.val}|${i.values_.b.val}|${i.values_.c.val})`,
                }))
            },
        }),
        // ------------------------------------------------------------------------------------
        // third way to do: build the list of choice from the form serial
        // TODO
        foos: form.list({
            element: () =>
                form.group({
                    label: 'stuff you can select in the reference input below',
                    items: () => ({
                        name: form.str({}),
                        a: form.number({}),
                        b: form.number({}),
                        c: form.number({}),
                    }),
                }),
        }),
        // debug: form.markdown({
        //     markdown: (f) => {
        //         return [
        //             `val 1 is: ${JSON.stringify(f?.result?.dynamicSelectOne)}`,
        //             `<br />`,
        //             `val 2 is: ${JSON.stringify(f?.result?.dynamicSelectTwo)}`,
        //         ].join('\n')
        //     },
        // }),    }),
    }),
    run: async ({ print, formResult: form, formSerial }) => {
        print('A: ' + 'Hello.')
        print('B: ' + JSON.stringify(form.dynamicSelectTwo))
        const itemSelected = formSerial.foos.items_.find((i) => i.id === form.dynamicSelectTwo.id)
        print('C: ' + JSON.stringify(itemSelected))
        print(
            'D: ' +
                JSON.stringify({
                    a: itemSelected?.values_.a.val,
                    b: itemSelected?.values_.b.val,
                    c: itemSelected?.values_.c.val,
                }),
        )
        print('E: ' + 'Bye.')
    },
})
