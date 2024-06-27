import { CushyFormManager } from '../../controls/FormBuilder'
import { ui_tint } from '../../csuite/kolor/prefab_Tint'
import { readJSON, writeJSON } from '../jsonUtils'

export const themeConf = CushyFormManager.form(
    (ui) =>
        ui.fields(
            {
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
            },
            { label: false, collapsed: false },
        ),
    {
        name: 'theme config',
        initialSerial: () => readJSON('settings/theme2.json'),
        onSerialChange: (form) => writeJSON('settings/theme2.json', form.serial),
    },
)
