import type { RelativeStyle } from '../../theme/colorEngine/AbsoluteStyle'

import { CushyFormManager, type FormBuilder } from '../../controls/FormBuilder'
import { readJSON, writeJSON } from '../jsonUtils'

export const themeConf = CushyFormManager.form(
    (ui) =>
        ui.fields(
            {
                base: ui.colorV2({ default: '#1E212B' /* `oklch(0.01 0.1 220)` */ }),
                text: ui_relativeStyle(ui), // ui.number({ min: 0.1, max: 1, default: 0.6 }),
                textLabel: ui_relativeStyle(ui).optional(),
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

const ui_relativeStyle = (ui: FormBuilder) => {
    return ui.fields(
        {
            l: ui.choiceV2({
                auto: ui.number({ min: -1, softMin: 0, max: 1, default: 0, step: 0.01 }),
                manual: ui.number({ min: 0, max: 1, default: 0.1, step: 0.01 }),
            }),
            c: ui.choiceV2({
                multiply: ui.number({ min: 0, max: 100, default: 1, step: 0.2 }),
                manual: ui.number({ min: 0, max: 0.47, default: 0.1, step: 0.01 }),
            }),
            h: ui.choiceV2({
                shift: ui.number({ min: -360, softMin: 0, max: 360, default: 0, step: 1 }),
                manual: ui.number({ min: -360, softMin: 0, max: 360, default: 0, step: 1 }),
            }),
        },
        {
            body: (p) => (
                <div tw='flex-1'>
                    <div tw='grid flex-1 grid-cols-2'>
                        <div tw='flex'>L {p.widget.fields.l.uiTab()}</div>
                        {p.widget.fields.l.uiChildren()}
                        <div tw='flex'>C {p.widget.fields.c.uiTab()}</div>
                        {p.widget.fields.c.uiChildren()}
                        <div tw='flex'>H {p.widget.fields.h.uiTab()}</div>
                        {p.widget.fields.h.uiChildren()}
                    </div>
                </div>
            ),
            // body: null,
        },
    )
}

export const compileToRelativeStyle = (ui: ReturnType<typeof ui_relativeStyle>['$Value']): RelativeStyle => {
    return {
        // l
        lightness: ui.l.manual,
        contrast: ui.l.auto,
        // c
        chroma: ui.c.manual,
        chromaBlend: ui.c.multiply,
        // h
        hue: ui.h.manual,
        hueShift: ui.h.shift,
    }
}
