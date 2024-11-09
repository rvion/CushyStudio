app({
   ui: (b) =>
      b.fields({
         ckpt: b.enum['CheckpointLoader.ckpt_name'](),
         seed1: b.seed({ defaultMode: 'randomize' }),
      }),

   run: async (sdk, p) => {
      const graph = sdk.nodes

      const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.ckpt })
      const latent_image = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
      const negative = graph.CLIPTextEncode({ clip: ckpt, text: 'bad' })
      const positive = graph.CLIPTextEncode({ clip: ckpt, text: 'a house' })

      graph.PreviewImage({
         images: graph.VAEDecode({
            vae: ckpt,
            samples: graph.KSampler({
               latent_image,
               model: ckpt,
               negative,
               positive,
               sampler_name: 'ddim',
               scheduler: 'karras',
               cfg: 8,
               denoise: 1,
               seed: p.seed1,
               steps: 10,
            }),
         }),
      })

      //        👇 for every value
      for (const i of [1, 2, 3]) {
         //                 👇 we patch the postive text
         positive.json.inputs.text = `a house ${i}`
         //        👇 and re-run the prompt
         await sdk.PROMPT()
      }
   },
})
