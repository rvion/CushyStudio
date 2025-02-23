import type { MediaImageL } from '../../../src/models/MediaImage'
import type { OutputFor } from './_prefabs'

export type UI_Mask = Z.XGroup<{
   image: Z.XImage
   mode: Z.XEnum<'LoadImageMask.channel'>
   invert: Z.XBool
   grow: Z.XNumber
   feather: Z.XNumber
   preview: Z.XBool
}>

export function ui_mask(): UI_Mask {
   const form: Z.Builder = getCurrentForm()
   return form.group({
      icon: 'mdiDominoMask',
      label: 'Mask',
      collapsed: false,
      items: {
         image: form.image({}),
         mode: form.enum['LoadImageMask.channel']({}),
         invert: form.bool({}),
         grow: form.int({ default: 0, min: -100, max: 100 }),
         feather: form.int({ default: 0, min: 0, max: 100 }),
         preview: form.bool({}),
      },
   })
}

export async function run_mask(
   x: OutputFor<typeof ui_mask>,
   imageOverride?: Maybe<MediaImageL>,
): Promise<Comfy.Signal['MASK'] | null> {
   const p = x
   const graph = getCurrentRun().nodes
   let mask: Comfy.Signal['MASK'] = await (imageOverride ?? p.image).loadInWorkflowAsMask(p.mode)
   if (p.invert) mask = graph.InvertMask({ mask: mask })
   if (p.grow) mask = graph.GrowMask({ mask: mask, expand: p.grow })
   if (p.feather)
      mask = graph.FeatherMask({
         mask: mask,
         bottom: p.feather,
         top: p.feather,
         left: p.feather,
         right: p.feather,
      })
   if (p.preview) graph.PreviewImage({ images: graph.MaskToImage({ mask }) })
   return mask
}
