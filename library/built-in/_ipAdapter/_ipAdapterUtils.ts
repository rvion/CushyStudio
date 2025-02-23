export type UI_subform_IPAdapter_common = {
   strength: Z.Number
   settings: Z.Group<{
      extra: Z.List<Z.Image>
      crop: Z.Bool
      startAtStepPercent: Z.Number
      endAtStepPercent: Z.Number
      weight_type: Z.Enum<'IPAdapter_plus.IPAdapterAdvanced.weight_type'>
      embedding_scaling: Z.Enum<'IPAdapter_plus.IPAdapterAdvanced.embeds_scaling'>
      noise: Z.Number
      unfold_batch: Z.Bool
   }>
}

// 🅿️ IPAdapter Common FORM ===================================================
export function ui_subform_IPAdapter_common(
   //
   ui: Z.Builder,
   defaultStrength: number = 1,
): UI_subform_IPAdapter_common {
   return {
      strength: ui.float({
         default: defaultStrength,
         min: 0,
         max: 2,
         step: 0.1,
      }),
      settings: ui.group({
         label: 'Settings',
         startCollapsed: true,
         items: {
            extra: ui.list({ label: 'Extra', element: ui.image({ label: 'Image' }) }),
            crop: ui.bool({ default: true }),
            startAtStepPercent: ui.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            endAtStepPercent: ui.float({ default: 1, min: 0, max: 1, step: 0.1 }),
            weight_type: ui.enum['IPAdapter_plus.IPAdapterAdvanced.weight_type']({
               default: 'linear',
            }),
            embedding_scaling: ui.enum['IPAdapter_plus.IPAdapterAdvanced.embeds_scaling']({
               default: 'V only',
            }),
            noise: ui.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            unfold_batch: ui.bool({ default: false }),
         },
      }),
   }
}

export type UI_ipadapter_CLIPSelection = {
   clip_name: Z.Enum<'CLIPVisionLoader.clip_name'>
}

//🅿️ IPAdapter CLIP Selection ===================================================
export function ui_ipadapter_CLIPSelection(form: Z.Builder): UI_ipadapter_CLIPSelection {
   return {
      clip_name: form.enum['CLIPVisionLoader.clip_name']({
         // @ts-ignore
         default: 'CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors',
         label: 'CLIP Vision Model',
      }).addRequirements([
         {
            type: 'modelInManager',
            modelName: 'CLIPVision model (IP-Adapter) CLIP-ViT-H-14-laion2B-s32B-b79K',
         },
      ]),
   }
}
