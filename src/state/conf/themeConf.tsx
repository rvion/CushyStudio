import { CushyFormManager } from '../../controls/FormBuilder'
import { ui_Kolor } from '../../rsuite/kolor/prefab_Kolor'
import { readJSON, writeJSON } from '../jsonUtils'

export const themeConf = CushyFormManager.form(
    (ui) =>
        ui.fields(
            {
                base: ui.colorV2({ default: '#1E212B' /* `oklch(0.01 0.1 220)` */ }),
                text: ui_Kolor(ui), // ui.number({ min: 0.1, max: 1, default: 0.6 }),
                textLabel: ui_Kolor(ui).optional(),
                accent1: ui.colorV2({ default: '#1E212B' /* `oklch(0.01 0.1 220)` */ }),
                accent2: ui.colorV2({ default: '#1E212B' /* `oklch(0.01 0.1 220)` */ }),
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
