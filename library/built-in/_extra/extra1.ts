import { ui_highresfix, type UI_HighResFix } from '../_prefabs/_prefabs'
import { ui_3dDisplacement, type UI_3dDisplacement } from '../_prefabs/prefab_3dDisplacement'
import { ui_refiners, type UI_Refiners } from '../_prefabs/prefab_detailer'
import { ui_mask, type UI_Mask } from '../_prefabs/prefab_mask'
import { ui_advancedPrompt, type UI_advancedPrompt } from '../_prefabs/prefab_promptsWithButtons'
import { ui_recursive, type UI_recursive } from '../_prefabs/prefab_recursive'
import {
   ui_regionalPrompting_v1,
   type UI_regionalPrompting_v1,
} from '../_prefabs/prefab_regionalPrompting_v1'
import { ui_rembg_v1, type UI_rembg_v1 } from '../_prefabs/prefab_rembg'
import { ui_upscaleWithModel } from '../_prefabs/prefab_upscaleWithModel'

export type $extra1 = X.XChoices<{
   show3d: UI_3dDisplacement
   regionalPrompt: UI_regionalPrompting_v1
   removeBG: UI_rembg_v1
   mask: UI_Mask
   highResFix: UI_HighResFix
   upscaleWithModel: X.XGroup<{ model: X.XEnum<Comfy.Enums['UpscaleModelLoader.model_name']> }>
   refine: UI_Refiners
   promtPlus: UI_advancedPrompt
   recursiveImgToImg: UI_recursive
}>

export function extra1(): $extra1 {
   const b = getCurrentForm()
   return b.choices(
      {
         show3d: ui_3dDisplacement(),
         regionalPrompt: ui_regionalPrompting_v1(b),
         mask: ui_mask(),
         removeBG: ui_rembg_v1(),
         highResFix: ui_highresfix(),
         upscaleWithModel: ui_upscaleWithModel(), //.withConfig({ label: 'Model' }),
         refine: ui_refiners(),
         promtPlus: ui_advancedPrompt(),
         recursiveImgToImg: ui_recursive(),
      },
      { /* appearance: 'tab', */ icon: 'mdiAlien' },
   )
}
