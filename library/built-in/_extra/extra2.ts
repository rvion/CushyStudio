import { output_demo_summary } from '../_prefabs/prefab_markdown'
import {
   run_addFancyWatermarkToAllImage,
   run_watermark_v1,
   ui_watermark_v1,
   type UI_watermark_v1,
} from '../_prefabs/prefab_watermark'
import { CustomView3dCan } from '../_views/View_3d_TinCan'
import { CustomViewSpriteSheet } from '../_views/View_Spritesheets'

export type $extra2 = Z.Choices<{
   gaussianSplat: Z.Empty
   summary: Z.Empty
   displayAsBeerCan: Z.Empty
   displayAsSpriteSheet: Z.Empty
   watermark: UI_watermark_v1
   fancyWatermark: Z.Empty
   makeAVideo: Z.Empty
}>

export function extra2(): $extra2 {
   const b = getCurrentForm()
   return b.choices(
      {
         gaussianSplat: b.empty({ icon: IKONS.mdiDotsHexagon }),
         summary: b.empty({ icon: IKONS.mdiLanguageMarkdown, tooltip: 'outputs a markdown summary about the execution and outputs' }), // prettier-ignore
         displayAsBeerCan: b.empty({ icon: IKONS.mdiBeerOutline }),
         displayAsSpriteSheet: b.empty({ icon: IKONS.mdiMovie }),
         watermark: ui_watermark_v1(),
         fancyWatermark: b.empty({ icon: IKONS.mdiWatermark }),
         makeAVideo: b.empty({ icon: IKONS.mdiMessageVideo, tooltip: 'generate a video from all the generated images in that step ' }), // prettier-ignore
      },
      { /* appearance: 'tab', */ icon: IKONS.mdiAlien },
   )
}

export async function eval_extra2(p: $extra2['$value']): Promise<void> {
   const run = getCurrentRun()

   if (p?.gaussianSplat) run.output_GaussianSplat({ url: '' })
   if (p?.summary) output_demo_summary(run)
   if (p.displayAsBeerCan) run.output_custom({ view: CustomView3dCan, params: { imageID: run.lastImage?.id } }); // prettier-ignore
   if (p.displayAsSpriteSheet) run.output_custom({ view: CustomViewSpriteSheet, params: { imageID: run.lastImage?.id } }); // prettier-ignore
   if (p.watermark) await run_watermark_v1(p.watermark, run.lastImage)
   if (p.fancyWatermark) await run_addFancyWatermarkToAllImage()
   if (p?.makeAVideo) await run.Videos.output_video_ffmpegGeneratedImagesTogether(undefined, 2)
}
