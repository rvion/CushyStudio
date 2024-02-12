app({
    ui: (form) => ({
        // lora: form.auto.FaceDetailer(),
        FeatherMask: form.auto.FeatherMask(),
        EmptyLatentImage: form.auto.EmptyLatentImage(),
        KSampler: form.auto.KSampler(),
    }),
    run: async (run, ui) => {
        // ui.lora.
    },
})
