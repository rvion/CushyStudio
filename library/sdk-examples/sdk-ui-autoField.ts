app({
   ui: (b) =>
      b.fields({
         // lora: form.auto.FaceDetailer(),
         FeatherMask: b.auto.FeatherMask(),
         EmptyLatentImage: b.auto.EmptyLatentImage(),
         KSampler: b.auto.KSampler(),

         // case 2. invalid node
         // @ts-expect-error
         test: b.auto.FAKE_STUFF(),

         // case 3. node without any primitive value
         invert: b.auto['was.Mask Invert'](),
      }),
   run: async (run, ui) => {
      // ui.lora.
   },
})
