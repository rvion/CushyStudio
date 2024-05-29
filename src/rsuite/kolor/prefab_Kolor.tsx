import type { Kolor } from './Kolor'

import { type FormBuilder } from '../../controls/FormBuilder'

export const ui_Kolor = (ui: FormBuilder) => {
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
                <div tw='grid flex-1 grid-cols-[1rem_minmax(130px,_1fr)_3fr]'>
                    <div>L</div>
                    <p.widget.fields.l.UITab />
                    {p.widget.fields.l.UIChildren()}
                    <div>C</div>
                    {p.widget.fields.c.UITab()}
                    {p.widget.fields.c.UIChildren()}
                    <div>H</div>
                    {p.widget.fields.h.UITab()}
                    {p.widget.fields.h.UIChildren()}
                </div>
            ),
        },
    )
}

export const run_Kolor = (ui: ReturnType<typeof ui_Kolor>['$Value']): Kolor => {
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
