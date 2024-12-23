import type { ImageStore } from '../../src/back/ImageStore'

// ID = library/built-in/parallel-2023-12-19.ts:0
app({
   metadata: {
      name: 'orchestrator',
   },
   ui: (b) =>
      b.fields({
         batchesStart: b.int({ default: 5 }),
         batchesEnd: b.int({ default: 7 }),
      }),
   run: async (run, ui) => {
      for (let batch = ui.batchesStart; batch <= ui.batchesEnd; batch++) {
         run.output_text(`starting batch ${batch}`)
         try {
            await run.Apps.execute({
               app: foo,
               formValue: {
                  frameStart: 2 * batch,
                  frameEnd: 2 * batch + 2,
                  reprocess: false,
               },
            })
         } catch (e) {
            run.output_text(`error in batch ${batch}: ${e}`)
         }
      }
   },
})

// ID = library/built-in/parallel-2023-12-19.ts:1
const foo = app({
   metadata: {
      name: 'test-2023-12-19',
   },
   ui: (b) =>
      b.fields({
         frameStart: b.int({ default: 1 }),
         frameEnd: b.int({ default: 10 }),
         reprocess: b.boolean({ default: false }),
      }),
   run: async (run, ui) => {
      // run.formInstance.values.frameStart

      for (let frame = ui.frameStart; frame <= ui.frameEnd; frame++) {
         const frameKey = `frame-${frame}`
         const store: ImageStore = run.Store.getImageStore(frameKey)

         // abort if frame is already done
         if (store.hasImage && !ui.reprocess) {
            continue
            // return run.output_text('already have an image')
         }

         // or do the frame
         const builder = run.nodes
         const model = builder.CheckpointLoaderSimple({
            // @ts-ignore
            ckpt_name: 'lyriel_v15.safetensors',
         })
         builder
            .PreviewImage({
               images: builder.VAEDecode({
                  vae: model,
                  samples: builder.KSampler({
                     seed: run.randomSeed(),
                     latent_image: builder.EmptyLatentImage({}),
                     model: model,
                     sampler_name: 'ddim',
                     scheduler: 'ddim_uniform',
                     positive: builder.CLIPTextEncode({ clip: model, text: `frame ${frame}` }),
                     negative: builder.CLIPTextEncode({ clip: model, text: 'nsfw, nude' }),
                  }),
               }),
            })
            .storeAs(frameKey)
      }
      await run.PROMPT()
   },
})
