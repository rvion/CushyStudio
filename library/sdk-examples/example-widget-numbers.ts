/**
 *
 * 🔶 This example is pretty complex and very advanced.
 * 🔶 don't' copy what is in this file unless you know what you are doing
 * 🔶 and really need this.
 *
 */

app({
    ui: (b) =>
        b.fields({
            int: b.int({
                min: 10,
                default: 12,
                max: 20,
            }),
            float: b.float({
                default: 1.0,
                min: 0.0,
                max: 1.0,
                step: 0.01,
                hideSlider: true,
            }),
            xx: b.float({
                min: 10,
                max: 100,
            }),
            abcd: b.float().optional(),
            abcd2: b.float().optional(true),
        }),

    run: async (flow, form) => {},
})
