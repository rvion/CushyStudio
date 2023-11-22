card({
    ui: (form) => ({
        basicList: form.regional({
            h: 512,
            w: 512,
            element: ({ w, h }) => ({
                fill: `#${Math.round(Math.random() * 0xffffff).toString(16)}`,
                h: 64,
                w: 64,
                x: Math.round(Math.random() * w),
                y: Math.round(Math.random() * h),
                item: form.int({}),
            }),
        }),
    }),

    run: async (flow, form) => {
        const DEBUG = JSON.stringify(form, null, 3)
        flow.print(`basicList: ${DEBUG}`)
    },
})
