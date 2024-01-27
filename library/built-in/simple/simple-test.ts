app({
    metadata: {
        name: 'Simple Test',
        description: '',
    },
    ui: (form) => ({
        // foo: form.enum({
        //     enumName: 'Enum_ImpactSEGSRangeFilter_target',
        // }),
        bar: form.bool({}),
        x: form.list({
            element: () => form.bool({}),
        }),
        // baz: form.enum({ enumName: 'Enum_ADE$_AnimateDiffCombine_format' }),
        // x: form.enum({})
        y: form.enum.Enum_LoadImage_image({}),
        coucou: form.enum.Enum_LoadImage_image({ default: '8NMtOqqyVW6gPz6zsV9uThm8Av6HsuHuJT61U22EUY.webp' }),
        adsf: form.enum.Enum_LoadImage_image({}),
    }),
    run: async (run, ui) => {
        ui.coucou
    },
})
