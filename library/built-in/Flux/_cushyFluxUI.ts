import { type $extra1, extra1 } from '../_extra/extra1'
import { type $extra2, extra2 } from '../_extra/extra2'
import { ui_latent_v3, type UI_LatentV3 } from '../_prefabs/prefab_latent_v3'
import { ui_sampler_advanced, type UI_Sampler_Advanced } from '../_prefabs/prefab_sampler_advanced'
import { ui_customSave, type UI_customSave } from '../_prefabs/saveSmall'
import { sampleNegative, samplePrompts } from '../samplePrompts'
import { type $prefabModelFlux, prefabModelFlux } from './_modelFlux'

export type $CushySD15UI = Z.Group<{
   positive: Z.Prompt
   negative: Z.Prompt
   model: $prefabModelFlux
   latent: UI_LatentV3
   sampler: UI_Sampler_Advanced
   customSave: Z.Maybe<UI_customSave>
   // controlnets: UI_cnet
   // ipAdapter: Z.Optional<UI_IPAdapterV2>
   // faceID: Z.Optional<UI_IPAdapterFaceIDV2>
   extra: $extra1
   extra2: $extra2
}>

export function CushyFluxUI(ui: Z.Builder): $CushySD15UI {
   return ui.fields({
      positive: ui.prompt({
         icon: IKONS.mdiPlusBoxOutline,
         default: samplePrompts.tree,
         presets: [
            //
            { label: 'Portrait', icon: IKONS.mdiFaceWoman, apply: (w) => w.setText('portrait, face') },
            {
               label: 'Landscape',
               icon: IKONS.mdiImageFilterHdr,
               apply: (w) => w.setText('landscape, nature'),
            },
            { label: 'Tree', icon: IKONS.mdiTree, apply: (w) => w.setText(samplePrompts.tree) },
            { label: 'Abstract', icon: IKONS.mdiShape, apply: (w) => w.setText('abstract, art') },
         ],
      }),
      negative: ui.prompt({
         icon: IKONS.mdiMinusBoxOutline,
         startCollapsed: true,
         default: 'bad quality, blurry, low resolution, pixelated, noisy',
         box: { base: { hue: 0, chroma: 0.05 } },
         presets: [
            {
               icon: IKONS.mdiCloseOctagon,
               label: 'simple negative',
               apply: (w) => w.setText(sampleNegative.simpleNegative),
            },
            {
               icon: IKONS.mdiCloseOctagon,
               label: 'simple negative + nsfw',
               apply: (w) => w.setText(sampleNegative.simpleNegativeNsfw),
            },
         ],
      }),
      model: prefabModelFlux(),
      latent: ui_latent_v3(),
      sampler: ui_sampler_advanced(),
      customSave: ui_customSave().optional(true),
      // controlnets: ui_cnet(),
      // ipAdapter: ui_IPAdapterV2().optional(),
      // faceID: ui_IPAdapterFaceIDV2().optional(),
      extra: extra1(),
      extra2: extra2(),
   })
}
