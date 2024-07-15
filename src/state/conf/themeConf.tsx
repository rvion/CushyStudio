import type { BaseSelectEntry } from '../../csuite/fields/selectOne/FieldSelectOne'

import { cushyFactory } from '../../controls/Builder'
import { ui_tint, type UI_Tint } from '../../csuite/kolor/prefab_Tint'
import { readJSON, writeJSON } from '../jsonUtils'

export type ThemeConf = X.XGroup<{
    labelLayout: X.XSelectOne_<'left' | 'right' | 'fluid'>
    base: X.XString
    appbar: X.XOptional<X.XString>
    gap: X.XOptional<X.XNumber>
    widgetWithLabel: X.XGroup<{
        border: X.XOptional<X.XNumber>
        contrast: X.XOptional<X.XNumber>
        padding: X.XOptional<X.XNumber>
    }>
    fieldGroups: X.XGroup<{
        border: X.XOptional<X.XNumber>
        contrast: X.XOptional<X.XNumber>
        padding: X.XOptional<X.XNumber>
    }>
    text: UI_Tint
    textLabel: X.XOptional<UI_Tint>
    border: X.XOptional<X.XNumber>
}>

export const themeConf: ThemeConf['$Field'] = cushyFactory.entity(
    (ui) =>
        ui.fields(
            {
                labelLayout: ui.selectOne<BaseSelectEntry<'left' | 'right' | 'fluid'>>({
                    appearance: 'tab',
                    choices: [
                        { id: 'left', icon: 'mdiAlignHorizontalLeft' },
                        { id: 'right', icon: 'mdiAlignHorizontalRight' },
                        { id: 'fluid', icon: 'mdiFullscreenExit' },
                    ],
                    default: { id: 'left', icon: 'mdiAlignHorizontalRight' },
                }),
                // 1. colors
                base: ui.colorV2({
                    default: '#F4F5FB',
                    presets: [
                        { label: 'Dark', icon: 'mdiLightSwitch', apply: (w) => (w.value = '#1E212B') },
                        { label: 'Light', icon: 'mdiLightSwitch', apply: (w) => (w.value = '#F4F5FB') },
                        { label: 'Moonlight', icon: 'mdiMoonFull', apply: (w) => (w.value = 'oklch(32.1% 0.01 268.4)') },
                    ],
                }),
                appbar: ui.colorV2({ default: '#313338' }).optional(true),

                // ...
                gap: ui.float({ default: 0.5, min: 0, max: 2 }).optional(),
                widgetWithLabel: ui.fields(
                    {
                        border: ui.percent({ default: 8 }).optional(),
                        contrast: ui.percent({ default: 0.824, min: 0, softMax: 10, max: 100 }).optional(),
                        padding: ui.float({ default: 0.5, min: 0, max: 2 }).optional(),
                    },
                    { background: { hueShift: 90 } },
                ),
                // fields group
                fieldGroups: ui.fields(
                    {
                        border: ui.percent({ default: 8 }).optional(),
                        contrast: ui.percent({ default: 0.824, min: 0, softMax: 10, max: 100 }).optional(),
                        padding: ui.float({ default: 0.5, min: 0, max: 2 }).optional(),
                    },
                    { background: { hue: 180 } },
                ),

                // 2. texts
                text: ui_tint(ui, { contrast: 0.824 }),
                textLabel: ui_tint(ui, { contrast: 0.45, chroma: 0.045 }).optional(true),

                // 3. misc
                border: ui.percent({ default: 8 }).optional(true),
            },
            { label: false, collapsed: false },
        ),
    {
        name: 'theme config',
        serial: () => readJSON('settings/theme2.json'),
        onSerialChange: (form) => writeJSON('settings/theme2.json', form.serial),
    },
)
