app({
   ui: (b) =>
      b.fields({
         steps: b.choices(
            {
               frame: b.group({
                  className: ' p-2 bg-blue-800 rounded-xl',
                  items: {
                     seed: b.seed({ default: 12, defaultMode: 'fixed' }),
                     positive: b.string({}),
                  },
               }),
               portrait: b.group({
                  className: 'p-2 bg-red-800 ',
                  items: { seed: b.seed({}) },
               }),
            },
            { default: { frame: true } },
         ),
      }),

   run: async (flow, form) => {
      const graph = flow.nodes
      const ckpt = graph.CheckpointLoaderSimple({
         // @ts-ignore
         ckpt_name: 'revAnimated_v122.safetensors',
      })
      const positive = graph.CLIPTextEncode({ clip: ckpt, text: form.steps.frame?.positive || 'a house' })
      const negative = graph.CLIPTextEncode({ clip: ckpt, text: 'bad' })
      const latent_image = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
      const images = graph.VAEDecode({
         vae: ckpt,
         samples: graph.KSampler({
            model: ckpt,
            sampler_name: 'ddim',
            scheduler: 'ddim_uniform',
            positive,
            negative,
            latent_image,
         }),
      })
      graph.PreviewImage({ images: images })

      // execute
      await flow.PROMPT()
   },
})
