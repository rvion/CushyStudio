import { CushyFormManager } from '../../controls/cushy/FormBuilder'
import { ui_tint } from '../../csuite/kolor/prefab_Tint'
import { readJSON, writeJSON } from '../jsonUtils'

export const themeConf = CushyFormManager.form(
    (ui) =>
        ui.fields(
            {
                // name copied from flexlayout; will be used
                tabSetEnableSingleTabStretch: ui.boolean({
                    default: false,
                    label: 'Stretch single tab in tabset',
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
            { label: 'Theme' },
        ),
    {
        name: 'theme config',
        initialSerial: () => readJSON('settings/theme2.json'),
        onSerialChange: (form) => writeJSON('settings/theme2.json', form.serial),
    },
)
