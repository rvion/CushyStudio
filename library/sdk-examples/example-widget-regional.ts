import { run_prompt } from '../built-in/_prefabs/prefab_prompt'

app({
   ui: (b) =>
      b.fields({
         ckpt: b.enum['CheckpointLoader.ckpt_name'](),
         demo: b.regional({
            height: 512,
            width: 512,
            initialPosition: ({ width: w, height: h }) => ({
               fill: `#${Math.round(Math.random() * 0xffffff).toString(16)}`,
               height: 64,
               width: 64,
               depth: 1,
               x: Math.round(Math.random() * w),
               y: Math.round(Math.random() * h),
               z: 1,
            }),
            element: ({ width: w, height: h }) =>
               b.group({
                  items: {
                     prompt: b.prompt({}),
                     mode: b.selectOneString(['combine', 'concat']),
                  },
               }),
         }),
         // mainPos: form.prompt({}),
         mainNeg: b.prompt({}),
      }),

   run: async (sdk, ui) => {
      const graph = sdk.nodes

      const ckpt = graph.CheckpointLoaderSimple({
         ckpt_name: ui.ckpt,
      })
      const clip = ckpt
      const vae = ckpt

      // let positive: Comfy.Signal['CONDITIONING'] = run_prompt(flow, { richPrompt: form.mainPos, clip: ckpt, ckpt: ckpt }).conditionning
      let positive: Comfy.Signal['CONDITIONING'] = graph.ConditioningZeroOut({
         conditioning: graph.CLIPTextEncode({ clip: clip, text: '' }),
      })
      const negative: Comfy.Signal['CONDITIONING'] = run_prompt({
         prompt: ui.mainNeg,
         clip: ckpt,
         ckpt: ckpt,
      }).conditioning

      for (const { shape: x, value: item } of ui.demo.items) {
         const y = run_prompt({ prompt: item.prompt, clip: ckpt, ckpt: ckpt })
         const localConditionning = graph.ConditioningSetArea({
            conditioning: y.conditioning,
            height: x.height * (x.scaleX ?? 1),
            width: x.width * (x.scaleY ?? 1),
            x: x.x,
            y: x.y,
            strength: 1,
         })

         positive =
            item.mode === 'combine'
               ? graph.ConditioningCombine({
                    conditioning_1: positive,
                    conditioning_2: localConditionning,
                 })
               : graph.ConditioningConcat({
                    conditioning_from: localConditionning,
                    conditioning_to: positive,
                 })
      }

      graph.PreviewImage({
         images: graph.VAEDecode({
            vae,
            samples: graph.KSampler({
               seed: sdk.randomSeed(),
               model: ckpt,
               sampler_name: 'ddim',
               scheduler: 'ddim_uniform',
               positive: positive,
               negative: negative,
               latent_image: graph.EmptyLatentImage({
                  batch_size: 1,
                  width: ui.demo.area.width,
                  height: ui.demo.area.height,
               }),
            }),
         }),
      })
      await sdk.PROMPT()
   },
})
