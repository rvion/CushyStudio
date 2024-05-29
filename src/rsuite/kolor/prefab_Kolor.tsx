import type { Kolor } from './Kolor'

import { type FormBuilder } from '../../controls/FormBuilder'

export const ui_Kolor = (ui: FormBuilder) => {
    return ui.fields(
        {
            l: ui
                .choiceV2({
                    auto: ui.number({ label: 'relative', text: 'contrast', min: -1, softMin: 0, max: 1, default: 0, step: 0.1 }),
                    manual: ui.number({ min: 0, max: 1, default: 0.1, step: 0.1 }),
                })
                .optional(),
            c: ui
                .choiceV2({
                    multiply: ui.number({ label: 'relative', text: 'multiply', min: 0, softMax: 2, default: 1, step: 0.1 }),
                    manual: ui.number({ min: 0, max: 0.47, default: 0.1, step: 0.1 }),
                })
                .optional(),
            h: ui
                .choiceV2({
                    shift: ui.number({ label: 'relative', text: 'shift', min: -360, softMin: 0, max: 360, default: 0, step: 10 }),
                    manual: ui.number({ min: -360, softMin: 0, max: 360, default: 0, step: 1 }),
                })
                .optional(),
        },
        {
            body: (p) => {
                return (
                    <div tw='grid flex-1 grid-cols-[auto_minmax(130px,_.5fr)_3fr]'>
                        {/* ------------------ */}
                        <div tw='flex'>
                            <p.widget.fields.l.UIToggle /> L
                        </div>
                        <p.widget.fields.l.child.UITab />
                        {p.widget.fields.l.child.UIChildren()}
                        {/* ------------------ */}
                        <div tw='flex'>
                            <p.widget.fields.c.UIToggle /> C
                        </div>
                        {p.widget.fields.c.child.UITab()}
                        {p.widget.fields.c.child.UIChildren()}
                        {/* ------------------ */}
                        <div tw='flex'>
                            <p.widget.fields.h.UIToggle /> H
                        </div>
                        {p.widget.fields.h.child.UITab()}
                        {p.widget.fields.h.child.UIChildren()}
                    </div>
                )
            },
        },
    )
}

export const run_Kolor = (ui: ReturnType<typeof ui_Kolor>['$Value']): Kolor => {
    return {
        // l
        lightness: ui.l?.manual,
        contrast: ui.l?.auto,
        // c
        chroma: ui.c?.manual,
        chromaBlend: ui.c?.multiply,
        // h
        hue: ui.h?.manual,
        hueShift: ui.h?.shift,
    }
}
