app({
   metadata: {
      name: 'Simple Demo App',
      description: 'A simple demo App',
   },
   ui: (b) =>
      b.fields({
         model: b.enum['CheckpointLoaderSimple.ckpt_name']({}),
         positive: b.string({ default: 'masterpiece, tree' }),
         seed: b.seed({}),
      }),
   run: async (run, ui) => {
      const workflow = run.workflow
      const graph = workflow.builder

      const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: ui.model })
      const latent = graph.EmptyLatentImage({})
      const image = graph.VAEDecode({
         samples: graph.KSampler({
            seed: ui.seed,
            latent_image: latent,
            model: ckpt,
            sampler_name: 'ddim',
            scheduler: 'karras',
            positive: graph.CLIPTextEncode({ clip: ckpt, text: ui.positive }),
            negative: graph.CLIPTextEncode({ clip: ckpt, text: '' }),
         }),
         vae: ckpt,
      })

      graph.PreviewImage({ images: image })
      await workflow.sendPromptAndWaitUntilDone()
   },
})
