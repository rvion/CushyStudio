app({
    ui: (form) => ({
        // lora: form.auto.FaceDetailer(),
        FeatherMask: form.auto.FeatherMask(),
        EmptyLatentImage: form.auto.EmptyLatentImage(),
        KSampler: form.auto.KSampler(),
        text: form.auto.Text(),

        // case 2. invalid node
        // @ts-expect-error
        test: form.auto.FAKE_STUFF(),

        // case 3. node without any primitive value
        invert: form.auto.Mask_Invert(),
    }),
    run: async (run, ui) => {
        // ui.lora.
    },
})
