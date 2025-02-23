// 🅿️ CNET COMMON FORM ===================================================

export type UI_cnet_ui_common = {
   strength: Z.XNumber
   advanced: Z.XGroup<{
      startAtStepPercent: Z.XNumber
      endAtStepPercent: Z.XNumber
      crop: Z.XEnum<'LatentUpscale.crop'>
      upscale_method: Z.XEnum<'ImageScale.upscale_method'>
   }>
}

export function cnet_ui_common(ui: Z.Builder): UI_cnet_ui_common {
   return {
      strength: ui.float({ default: 1, min: 0, max: 2, step: 0.1 }),
      advanced: ui.group({
         startCollapsed: true,
         label: 'Settings',
         items: {
            startAtStepPercent: ui.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            endAtStepPercent: ui.float({ default: 1, min: 0, max: 1, step: 0.1 }),
            crop: ui.enum['LatentUpscale.crop']({
               label: 'Image Prep Crop mode',
               default: 'disabled',
            }),
            upscale_method: ui.enum['ImageScale.upscale_method']({
               label: 'Scale method',
               default: 'lanczos',
            }),
         },
      }),
   }
}

export const cnet_preprocessor_ui_common = (
   form: Z.Builder,
): {
   saveProcessedImage: Z.XBool
} => ({
   //preview: form.inlineRun({ text: 'Preview', kind: 'special' }),
   saveProcessedImage: form.bool({ default: false, expand: true, label: 'Save image' }),
   //resolution: form.int({ default: 512, min: 512, max: 1024, step: 512 }),
})
