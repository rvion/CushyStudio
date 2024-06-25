import type { IconName } from '../../csuite/icons/icons'
import type { Model } from '../../csuite/model/Model'

import { CushyFormManager, type FormBuilder } from '../../controls/FormBuilder'
import { ui_tint, type UI_Tint } from '../../csuite/kolor/prefab_Tint'
import { readJSON, writeJSON } from '../jsonUtils'

export type ThemeConf = X.XGroup<{
    tabSetEnableSingleTabStretch: X.XBool
    labelLayout: X.XSelectOne<{ id: 'left' | 'right' | 'fluid'; icon: IconName }>
    base: X.XString
    appbar: X.XOptional<X.XString>
    tooltipDelay: X.XOptional<X.XNumber>
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
    inputHeight: X.XNumber
    useDefaultCursorEverywhere: X.XBool
    showWidgetUndo: X.XBool
    showWidgetMenu: X.XBool
    showWidgetDiff: X.XBool
    showToggleButtonBox: X.XBool
}>

export const themeConf: Model<ThemeConf, FormBuilder, {}> = CushyFormManager.form(
    (ui): ThemeConf =>
        ui.fields(
            {
                // name copied from flexlayout; will be used
                tabSetEnableSingleTabStretch: ui.boolean({
                    label: 'Auto-Hide Tabset',
                    tooltip: 'Hide the tabset when there is only one tab',
                    default: false,
                }),

                labelLayout: ui.selectOne<{ id: 'left' | 'right' | 'fluid'; icon: IconName }>({
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
                        { icon: 'mdiLightSwitch', apply: (w) => (w.value = '#1E212B'), label: 'Dark' },
                        { icon: 'mdiLightSwitch', apply: (w) => (w.value = '#F4F5FB'), label: 'Light' },
                    ],
                }),
                appbar: ui.colorV2({ default: '#313338' }).optional(true),

                // ...
                tooltipDelay: ui
                    .int({ min: 0, softMin: 50, softMax: 1000, default: 500, unit: 'ms', suffix: 'ms' })
                    .optional(true),
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
                text: ui_tint(ui, {
                    contrast: 0.824,
                }),
                textLabel: ui_tint(ui, {
                    contrast: 0.45,
                    chroma: 0.045,
                }).optional(true),

                // 3. misc
                border: ui.percent({ default: 8 }).optional(true),
                inputHeight: ui.number({ min: 1.4, max: 3, default: 1.6, unit: 'rem', suffix: 'rem' }),
                // 4. components
                useDefaultCursorEverywhere: ui.boolean({ default: false }),
                showWidgetUndo: ui.boolean({ tooltip: 'show undo button near every field', default: true }),
                showWidgetMenu: ui.boolean({ tooltip: 'show action buttons at the bottom of the form', default: true }),
                showWidgetDiff: ui.boolean({ tooltip: 'show diff button near every field', default: true }),
                showToggleButtonBox: ui.boolean({
                    default: false,
                    tooltip: 'show either chekbox icon or radio button icon in every InputBool',
                }),
            },
            { label: false, collapsed: false },
        ),
    {
        name: 'theme config',
        initialSerial: () => readJSON('settings/theme2.json'),
        onSerialChange: (form) => writeJSON('settings/theme2.json', form.serial),
    },
)
