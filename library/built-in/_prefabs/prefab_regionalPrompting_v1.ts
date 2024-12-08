import type { CushySchemaBuilder } from '../../../src/controls/CushyBuilder'
import type { OutputFor } from './_prefabs'

export type UI_regionalPrompting_v1 = X.XBoard<
   X.XGroup<{
      prompt: X.XPrompt
      strength: X.XNumber
   }>
>

export function ui_regionalPrompting_v1(b: CushySchemaBuilder): UI_regionalPrompting_v1 {
   b = b ?? getCurrentForm()
   return b.regional({
      element: b.group({
         // uiui: (b) => b.apply({ Header: '🟢222', Body: '🟢' }),
         items: {
            prompt: b.prompt({}),
            strength: b.number({ default: 1, min: 0, max: 2, step: 0.1 }),
            // mode: form.enum["ConditioningBlend.blending_mode"]({}),
         },
      }),
      height: 512,
      width: 512,
      icon: 'mdiPictureInPictureTopRight',
      initialPosition: () => ({
         x: 0,
         y: 0,
         width: 128,
         height: 128,
         fill: `#${Math.round(Math.random() * 0xffffff).toString(16)}`,
      }),
   })
}

export const run_regionalPrompting_v1 = (
   ui: OutputFor<typeof ui_regionalPrompting_v1>,
   p: {
      conditionning: Comfy.Signal['CONDITIONING']
      clip: Comfy.Signal['CLIP']
   },
): Comfy.Signal['CONDITIONING'] => {
   const run = getCurrentRun()
   let positive = p.conditionning
   const graph = run.nodes
   for (const square of ui.items) {
      const squareCond = graph.ConditioningSetArea({
         conditioning: graph.CLIPTextEncode({ clip: p.clip, text: square.value.prompt.text }),
         height: square.shape.height,
         width: square.shape.width,
         x: square.shape.x,
         y: square.shape.y,
         strength: square.value.strength,
      })
      // positive = graph.ConditioningBlend({
      //     conditioning_a: positive,
      //     conditioning_b: squareCond,
      //     blending_strength: square.value.strength,
      //     blending_mode: square.value.mode,
      // })
      positive = graph.ConditioningCombine({
         conditioning_1: positive,
         conditioning_2: squareCond,
      })
   }
   return positive
}
