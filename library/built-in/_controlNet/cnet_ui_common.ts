// 🅿️ CNET COMMON FORM ===================================================

export type UI_cnet_ui_common = {
   strength: X.XNumber
   advanced: X.XGroup<{
      startAtStepPercent: X.XNumber
      endAtStepPercent: X.XNumber
      crop: X.XEnum<Comfy.Enums['LatentUpscale.crop']>
      upscale_method: X.XEnum<Comfy.Enums['ImageScale.upscale_method']>
   }>
}
export function cnet_ui_common(ui: X.Builder): UI_cnet_ui_common {
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
   form: X.Builder,
): {
   saveProcessedImage: X.XBool
} => ({
   //preview: form.inlineRun({ text: 'Preview', kind: 'special' }),
   saveProcessedImage: form.bool({ default: false, expand: true, label: 'Save image' }),
   //resolution: form.int({ default: 512, min: 512, max: 1024, step: 512 }),
})
