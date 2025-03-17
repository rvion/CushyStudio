import type { SelectOptionNoVal } from '../../csuite/fields/selectOne/SelectOption'
import type { FormGlobalLayoutMode } from './FormGlobalLayoutMode'

import { cushyFactory, type CushySchemaBuilder } from '../../controls/CushyBuilder'
import { Field_group, type MAGICFIELDS } from '../../csuite/fields/group/FieldGroup'
import { WidgetSelectOne_TabUI } from '../../csuite/fields/selectOne/WidgetSelectOne_TabUI'
import { type $schemaSimpleDropShadow, schemaSimpleDropShadow } from '../../csuite/frame/SimpleDropShadow'
import { ui_theme_text, type UI_Theme_Text } from '../../csuite/kolor/prefab_Text'
import { ui_tint, type UI_Tint } from '../../csuite/kolor/prefab_Tint'
import { readJSON, writeJSON } from '../jsonUtils'

// --------------
export type ThemeConf = {
   labelLayout: Z.XSelectOne_<FormGlobalLayoutMode>
   base: Z.Color
   appbar: Z.Maybe<Z.Color>
   fieldGroups: Z.Group<{
      border: Z.Maybe<Z.Number>
      contrast: Z.Maybe<Z.Number>
   }>
   global: Z.Group<{
      border: Z.Maybe<Z.Number>
      contrast: Z.Maybe<Z.Number>
      shadow: Z.Maybe<$schemaSimpleDropShadow>
      roundness: Z.Number
      active: UI_Tint
      text: UI_Theme_Text
      labelText: UI_Theme_Text
   }>
   groups: Z.Group<{
      border: Z.Maybe<Z.Number>
      contrast: Z.Maybe<Z.Number>
      padding: Z.Number
   }>
}

export interface Theme extends MAGICFIELDS<ThemeConf> {}
export class Theme extends Field_group<ThemeConf> {
   static schema = (b: CushySchemaBuilder) => {
      return b
         .fields<ThemeConf>(
            {
               labelLayout: b.selectOneOptionId<SelectOptionNoVal<FormGlobalLayoutMode>>(
                  [
                     { id: 'fixed-left', /*  */ icon: IKONS.mdiAlignHorizontalLeft /*  */, label: '' },
                     { id: 'fixed-right', /* */ icon: IKONS.mdiAlignHorizontalRight /* */, label: '' },
                     { id: 'fluid', /*       */ icon: IKONS.mdiFullscreenExit /*       */, label: '' },
                     { id: 'mobile', /*      */ icon: IKONS.mdiCellphone /*            */, label: '' },
                  ],
                  {
                     ui: {
                        Header: (p) => (
                           <WidgetSelectOne_TabUI field={p.field} tw='!gap-0 ![flex-wrap:nowrap]' />
                        ),
                     },
                     default: 'fixed-left',
                  },
               ),
               // 1. colors
               base: b.color({
                  tooltip: 'main color of the CushyStudio UI',
                  default: '#242528',
                  // presets: [
                  //     { label: 'Dark', icon: IKONS.mdiLightSwitch, apply: (w) => (w.value = '#1E212B') },
                  //     { label: 'Light', icon: IKONS.mdiLightSwitch, apply: (w) => (w.value = '#F4F5FB') },
                  //     { label: 'Moonlight', icon: IKONS.mdiMoonFull, apply: (w) => (w.value = 'oklch(32.1% 0.01 268.4)') },
                  // ],
               }),
               appbar: b
                  .color({
                     tooltip: 'color or the app shell (appbar, footer, tabset separator, etc.)',
                     default: '#313338',
                  })
                  .optional(false),

               // ...
               // gap: ui.float({ default: 0.5, min: 0, max: 2 }).optional(),
               // widgetWithLabel: ui.fields(
               //     {
               //         border: ui.percent({ default: 8 }).optional(),
               //         contrast: ui.percent({ default: 0.824, min: 0, softMax: 10, max: 100 }).optional(),
               //         padding: ui.float({ default: 0.5, min: 0, max: 2 }).optional(),
               //     },
               //     { background: { hueShift: 90 } },
               // ),
               // fields group
               fieldGroups: b.fields({
                  border: b.percent({ default: 20 }).optional(false),
                  contrast: b.percent({ default: 0.824, min: 0, softMax: 10, max: 100 }).optional(false),
                  // padding: ui.float({ default: 0.5, min: 0, max: 2 }).optional(),
               }),

               global: b.fields({
                  border: b.percent({ default: 5, min: -100, max: 100 }).optional(true),
                  contrast: b.percent({ default: -10, min: -100, max: 100 }).optional(true),
                  shadow: schemaSimpleDropShadow(b).optional(true),
                  roundness: b.int({ default: 5, min: 0 }),
                  active: ui_tint(b, { contrast: 0.25, chromaBlend: 7.5 }),
                  text: ui_theme_text(b),
                  labelText: ui_theme_text(b),
               }),

               groups: b.fields({
                  border: b.percent({ default: 20, min: -100, max: 100 }).optional(false),
                  contrast: b.percent({ default: 11, min: -100, max: 100 }).optional(true),
                  padding: b.number({ default: 0.5, min: 0, max: 20, step: 1, suffix: 'rem' }),
               }),
            },
            {
               label: 'Theme',
               collapsed: false,
            },
         )
         .useClass(Theme)
   }
}

export const themeConf: Theme = cushyFactory.document(Theme.schema, {
   name: 'theme config',
   serial: () => readJSON('settings/theme2.json'),
   onSerialChange: (form) => writeJSON('settings/theme2.json', form.serial),
})
