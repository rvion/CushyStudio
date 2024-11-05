export type UI_subform_IPAdapter_common = {
   strength: X.XNumber
   settings: X.XGroup<{
      extra: X.XList<X.XImage>
      crop: X.XBool
      startAtStepPercent: X.XNumber
      endAtStepPercent: X.XNumber
      weight_type: X.XEnum<Comfy.Enums['IPAdapterAdvanced.weight_type']>
      embedding_scaling: X.XEnum<Comfy.Enums['IPAdapterAdvanced.embeds_scaling']>
      noise: X.XNumber
      unfold_batch: X.XBool
   }>
}

// 🅿️ IPAdapter Common FORM ===================================================
export function ui_subform_IPAdapter_common(
   //
   ui: X.Builder,
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
            weight_type: ui.enum['IPAdapterAdvanced.input.weight_type']({ default: 'linear' }),
            embedding_scaling: ui.enum['IPAdapterAdvanced.input.embeds_scaling']({ default: 'V only' }),
            noise: ui.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            unfold_batch: ui.bool({ default: false }),
         },
      }),
   }
}

export type UI_ipadapter_CLIPSelection = {
   clip_name: X.XEnum<Comfy.Enums['CLIPVisionLoader.clip_name']>
}

//🅿️ IPAdapter CLIP Selection ===================================================
export function ui_ipadapter_CLIPSelection(form: X.Builder): UI_ipadapter_CLIPSelection {
   return {
      clip_name: form.enum
         .Enum_CLIPVisionLoader_clip_name({
            // @ts-ignore
            default: 'CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors',
            label: 'CLIP Vision Model',
         })
         .addRequirements([
            {
               type: 'modelInManager',
               modelName: 'CLIPVision model (IP-Adapter) CLIP-ViT-H-14-laion2B-s32B-b79K',
            },
         ]),
   }
}
