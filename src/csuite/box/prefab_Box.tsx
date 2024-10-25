import type { Builder } from '../../CUSHY'
import type { Field_choices_config } from '../fields/choices/FieldChoices'
import type { Box } from './Box'

import { run_tint, ui_tint, type UI_Tint } from '../kolor/prefab_Tint'

export type UI_Box = X.XChoices<{
   base: UI_Tint
   text: UI_Tint
   textShadow: UI_Tint
   shadow: UI_Tint
   border: UI_Tint
   hover: X.XBool
}>

export const ui_Box = (
   //
   ui: Builder,
   config?: Omit<
      Field_choices_config<{
         base: UI_Tint
         text: UI_Tint
         textShadow: UI_Tint
         shadow: UI_Tint
         border: UI_Tint
         hover: X.XBool
      }>,
      'multi' | 'items'
   >,
): UI_Box => {
   return ui.choices(
      {
         base: ui_tint(ui),
         // text stuff
         text: ui_tint(ui),
         textShadow: ui_tint(ui),
         // border stuff
         shadow: ui_tint(ui),
         border: ui_tint(ui),
         // interraction effect
         hover: ui.boolean(),
      },
      config,
   )
}

export const run_Box = (ui: UI_Box['$Value']): Box => {
   const box: Box = { hover: ui.hover }
   if (ui.base) box.base = run_tint(ui.base)
   if (ui.text) box.text = run_tint(ui.text)
   if (ui.textShadow) box.textShadow = run_tint(ui.textShadow)
   if (ui.shadow) box.shadow = run_tint(ui.shadow)
   if (ui.border) box.border = run_tint(ui.border)
   return box
}
