import { CushyFormManager } from '../../controls/FormBuilder'
import { ui_Box } from '../../rsuite/box/prefab_Box'
import { ui_Kolor } from '../../rsuite/kolor/prefab_Kolor'
import { readJSON, writeJSON } from '../jsonUtils'

export const themeConf = CushyFormManager.form(
    (ui) =>
        ui.fields(
            {
                // CORE -----------
                appbar: ui.colorV2(),
                base: ui.colorV2({
                    default: '#1E212B' /* `oklch(0.01 0.1 220)` */,
                    presets: [
                        {
                            icon: 'mdiLightSwitch',
                            apply: (w) => (w.value = '#1E212B'),
                            label: 'Dark',
                        },
                        {
                            icon: 'mdiLightSwitch',
                            apply: (w) => (w.value = '#F1F5F9'),
                            label: 'Light',
                        },
                    ],
                }),
                text: ui_Kolor(ui, { contrast: 0.9 }), // ui.number({ min: 0.1, max: 1, default: 0.6 }),
                textLabel: ui_Kolor(ui, { contrast: 0.5, hue: 0.8 }).optional(true),
                primary: ui_Box(ui, { icon: 'mdiPodiumGold' }),
                // subtle: ui_Box(ui, { icon: 'mdiCursorDefaultClick' }),
                // default: ui_Box(ui, { icon: 'mdiCursorDefaultOutline' }),
                // ghost: ui_Box(ui, { icon: 'mdiGhost' }),
                // secondary: ui_Box(ui, { icon: 'mdiPodiumSilver' }),
                // accent1: ui.colorV2({ default: '#1E212B' /* `oklch(0.01 0.1 220)` */ }),
                // accent2: ui.colorV2({ default: '#1E212B' /* `oklch(0.01 0.1 220)` */ }),
                // use default cursor everywhere
                useDefaultCursorEverywhere: ui.boolean({ default: false }),
            },
            { label: 'Theme' },
        ),
    {
        name: 'theme config',
        initialSerial: () => readJSON('settings/theme.json'),
        onSerialChange: (form) => writeJSON('settings/theme.json', form.serial),
    },
)
