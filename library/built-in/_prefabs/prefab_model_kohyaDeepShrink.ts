export type UI_model_kohyaDeepShrink = Z.Group<{
   include: Z.Choices<{
      base: Z.Group<{}>
      hiRes: Z.Group<{}>
   }>
   advancedSettings: Z.Group<{
      downscaleFactor: Z.Number
      block_number: Z.Number
      startPercent: Z.Number
      endPercent: Z.Number
      downscaleAfterSkip: Z.Bool
      downscaleMethod: Z.Enum<'LatentUpscale.upscale_method'>
      upscaleMethod: Z.Enum<'LatentUpscale.upscale_method'>
   }>
}>

export function ui_model_kohyaDeepShrink(form: Z.Builder): UI_model_kohyaDeepShrink {
   return form.fields(
      {
         include: form.choices(
            { base: form.fields({}), hiRes: form.fields({}) },
            { appearance: 'tab', default: 'hiRes' },
         ),
         advancedSettings: form.fields(
            {
               downscaleFactor: form.float({
                  default: 2,
                  min: 0.1,
                  max: 9,
                  softMax: 4,
                  step: 0.25,
                  tooltip: 'only applies to shrink on base model. hires will use hires scale factor.',
               }),
               block_number: form.int({ default: 3, max: 32, min: 1 }),
               startPercent: form.float({ default: 0, min: 0, max: 1, step: 0.05 }),
               endPercent: form.float({ default: 0.35, min: 0, max: 1, step: 0.05 }),
               downscaleAfterSkip: form.bool({ default: false }),
               downscaleMethod: form.enum['PatchModelAddDownscale.downscale_method']({
                  default: 'bislerp',
               }),
               upscaleMethod: form.enum['PatchModelAddDownscale.upscale_method']({
                  default: 'bicubic',
               }),
            },
            {
               startCollapsed: true,
               toString_: ({ value: ui }): string => {
                  return `scale:${ui.downscaleFactor} end:${ui.endPercent} afterSkip:${ui.downscaleAfterSkip} downMethod:${ui.downscaleMethod}`
               },
            },
         ),
      },
      {
         startCollapsed: true,
         tooltip:
            'Shrinks and patches the model. Can be used to generate resolutions higher than the model training and helps with hires fix.',
         toString_: ({ value: ui }): string => {
            return `${ui.include.base ? '🟢Base (' + ui.advancedSettings.downscaleFactor + ')' : ''}${ui.include.hiRes ? '🟢HiRes ' : ''} end:${ui.advancedSettings.endPercent}`
         },
      },
   )
}

/** https://www.reddit.com/r/StableDiffusion/comments/18ld5sj/kohya_deep_shrink_explain_to_me_like_im_5_years/  */
export const run_model_kohyaDeepShrink = (
   ui: UI_model_kohyaDeepShrink['$value'],
   ckpt: Comfy.Signal['MODEL'],
   forHiRes?: boolean,
   kohyaScale?: number,
): Comfy.Signal['MODEL'] => {
   const run = getCurrentRun()
   const graph = run.nodes

   // 7. Kohya Deepshrink
   if (
      (!forHiRes && ui.include.base) || //
      (forHiRes && ui.include.hiRes)
   ) {
      const setScale = forHiRes ? kohyaScale : (ui.advancedSettings.downscaleFactor ?? 2)
      const set = ui.advancedSettings
      ckpt = graph.PatchModelAddDownscale({
         downscale_factor: setScale,
         model: ckpt,
         block_number: set.block_number,
         start_percent: set.startPercent,
         end_percent: set.endPercent,
         downscale_after_skip: set.downscaleAfterSkip,
         downscale_method: set.downscaleMethod,
         upscale_method: set.upscaleMethod,
      })
   }
   return ckpt
}
