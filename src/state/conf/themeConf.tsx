import { cushyFactory } from '../../controls/Builder'
import { SelectOptionNoVal } from '../../csuite/fields/selectOne/SelectOption'
import { WidgetSelectOne_TabUI } from '../../csuite/fields/selectOne/WidgetSelectOne_TabUI'
import { type $schemaSimpleDropShadow, schemaSimpleDropShadow } from '../../csuite/frame/SimpleDropShadow'
import { ui_tint, type UI_Tint } from '../../csuite/kolor/prefab_Tint'
import { readJSON, writeJSON } from '../jsonUtils'
import { FormGlobalLayoutMode } from './FormGlobalLayoutMode'

// --------------
export type ThemeConf = X.XGroup<{
    labelLayout: X.XSelectOne_<FormGlobalLayoutMode>
    base: X.XColor
    appbar: X.XOptional<X.XColor>
    fieldGroups: X.XGroup<{
        border: X.XOptional<X.XNumber>
        contrast: X.XOptional<X.XNumber>
    }>
    text: UI_Tint
    textLabel: X.XOptional<UI_Tint>
    inputBorder: X.XOptional<X.XNumber>
    inputContrast: X.XOptional<X.XNumber>
    inputShadow: X.XOptional<$schemaSimpleDropShadow>
    inputRoundness: X.XNumber
}>

export const themeConf: ThemeConf['$Field'] = cushyFactory.document(
    (ui) =>
        ui.fields(
            {
                labelLayout: ui.selectOneOptionId<SelectOptionNoVal<FormGlobalLayoutMode>>(
                    [
                        { id: 'fixed-left', /*  */ icon: 'mdiAlignHorizontalLeft' /*  */, label: '' },
                        { id: 'fixed-right', /* */ icon: 'mdiAlignHorizontalRight' /* */, label: '' },
                        { id: 'fluid', /*       */ icon: 'mdiFullscreenExit' /*       */, label: '' },
                        { id: 'mobile', /*      */ icon: 'mdiCellphone' /*            */, label: '' },
                    ],
                    {
                        header: (p) => <WidgetSelectOne_TabUI field={p.field} tw='!gap-0 ![flex-wrap:nowrap]' />,
                        default: 'fixed-left',
                    },
                ),
                // 1. colors
                base: ui.colorV2({
                    tooltip: 'main color of the CushyStudio UI',
                    default: '#F4F5FB',
                    // presets: [
                    //     { label: 'Dark', icon: 'mdiLightSwitch', apply: (w) => (w.value = '#1E212B') },
                    //     { label: 'Light', icon: 'mdiLightSwitch', apply: (w) => (w.value = '#F4F5FB') },
                    //     { label: 'Moonlight', icon: 'mdiMoonFull', apply: (w) => (w.value = 'oklch(32.1% 0.01 268.4)') },
                    // ],
                }),
                appbar: ui
                    .colorV2({
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
                fieldGroups: ui.fields(
                    {
                        border: ui.percent({ default: 8 }).optional(),
                        contrast: ui.percent({ default: 0.824, min: 0, softMax: 10, max: 100 }).optional(),
                        // padding: ui.float({ default: 0.5, min: 0, max: 2 }).optional(),
                    },
                    { background: { hue: 180 } },
                ),

                // 2. texts
                text: ui_tint(ui, { contrast: 0.824 }),
                textLabel: ui_tint(ui, { contrast: 0.45, chroma: 0.045 }).optional(true),

                // 3. misc
                inputBorder: ui.percent({ default: 8 }).optional(true),
                inputContrast: ui.percent({ default: 5 }).optional(true),
                inputShadow: schemaSimpleDropShadow(ui).optional(true),
                // ui.ratio({ default: 0.05 }).optional(true),
                inputRoundness: ui.int({ default: 5, min: 0 }),
            },
            {
                label: 'Theme',
                presetButtons: true,
                collapsed: false,
                presets: [
                    {
                        label: 'light',
                        icon: 'mdiLightSwitch',
                        apply: (w): void => {
                            w.value.base = 'oklch(97.1% 0.01 278.6)'
                            w.value.appbar = 'oklch(32.1% 0.01 268.4)'
                        },
                    },
                    {
                        label: 'Dark Blue',
                        icon: 'mdiLightSwitch',
                        apply: (w): void => {
                            w.value.base = 'oklch(24.7% 0.01 247.9)'
                            // w.value.appbar = 'oklch(40.6% 0.08 244.8)'
                            w.value.appbar = 'oklch(51.6% 0.12 263)'
                        },
                    },
                    {
                        label: 'Dark Blue 2',
                        icon: 'mdiLightSwitch',
                        apply: (w): void => {
                            w.value.base = 'oklch(24.7% 0.01 247.9)'
                            w.value.appbar = 'oklch(40.6% 0.08 244.8)'
                            // w.value.appbar = 'oklch(51.6% 0.12 263)'
                        },
                    },
                    {
                        label: 'Dark Red',
                        icon: 'mdiLightSwitch',
                        apply: (w): void => {
                            w.value.base = 'oklch(19.7% 0.00 0)'
                            w.value.appbar = 'oklch(30.6% 0.06 14.7)'
                        },
                    },
                ],
            },
        ),
    {
        name: 'theme config',
        serial: () => readJSON('settings/theme2.json'),
        onSerialChange: (form) => writeJSON('settings/theme2.json', form.serial),
    },
)
