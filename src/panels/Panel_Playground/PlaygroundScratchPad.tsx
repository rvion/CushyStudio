import { observer } from 'mobx-react-lite'

import { CushyErrorBoundarySimpleUI } from '../../controls/shared/CushyErrorBoundarySimple'
import { CushyFormManager, FormBuilder } from '../../controls/FormBuilder'
import { readJSON, writeJSON } from '../../state/jsonUtils'
import { FormUI } from '../../controls/FormUI'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundScratchPad = observer(function PlaygroundScratchPad_(p: {}) {
    return (
        <CushyErrorBoundarySimpleUI>
            <ThemeConfigUI />
        </CushyErrorBoundarySimpleUI>
    )
})

export const ThemeConfigUI = observer(function ThemeConfigUI_(p: {}) {
    const theme = cushy.themeManager

    return (
        <div tw='w-full h-full bg-base-300 p-1'>
            <div>
                {Math.sin(
                    ThemeForm.value.inputNumber.background.lightness +
                        ThemeForm.value.inputNumber.text.auto?.inputNumberContrast!,
                )}
            </div>
            <FormUI form={ThemeForm} />
        </div>
    )
})

function templateContrast(p: { id: string; label?: string; f: FormBuilder }) {
    const f = p.f
    return f.shared(
        p.id + '-contrast',
        f
            .group({
                items: {
                    contrast: f.float({ step: 0.1, min: -1.0, max: 1.0, default: -1.0 }),
                    chromaBleed: f.float({ step: 0.1, min: 0.0, max: 1.0, default: 1.0 }),
                    hueOffset: f.int({ step: 20, min: -180, max: 180, default: 180 }),
                    opacity: f.float({ step: 0.1, min: 0, max: 1, default: 0.2 }),
                },
            })
            .optional(true),
    )
}

enum ThemeDefinitions {
    BACKGROUND = 0,
    TEXT,
    SHADOW,
    BORDER,
}

function definitionToWidget(definition: ThemeDefinitions, f: FormBuilder) {
    switch (definition) {
        case ThemeDefinitions.BACKGROUND:
            return { background: f.column({ items: {} }) }
    }
    return
}

enum PropType {
    FLOAT = 0,
    INT,
    GROUP,
    COLUMN,
    ROW,
}

export const ThemeForm = CushyFormManager.form(
    (f) => {
        return {
            test: f.fields(
                { a: f.int() },
                {
                    header: (p) => {
                        return <div className='COLLAPSE-PASSTHROUGH'>{p.widget.defaultBody()}</div>
                    },
                },
            ),
            controls: f.group({
                items: {
                    label: f.row({ label: 'Theme Name' }),
                    test: f.button({ onClick: () => {} }),
                },
            }),
            inputNumber: f.group({
                label: 'Number Field',
                items: {
                    display: f.group({
                        label: '".theme-number-field"',
                        border: false,
                        collapsed: false,
                        items: {
                            display: f.float({}),
                            displayAlt: f.float({ label: false, text: 'Display Alt.', alignLabel: false }),
                        },
                    }),
                    background: f.group({
                        label: 'Background',
                        border: false,
                        items: {
                            lightness: f.float({ step: 0.1, min: 0, max: 1 }),
                            chroma: f.float({ step: 0.01, softMax: 0.2, min: 0, max: 1 }),
                            hue: f.int({ step: 20, min: 0, max: 360 }),
                        },
                    }),
                    // .optional(true),
                    text: f.choice({
                        label: 'Text',
                        border: false,
                        appearance: 'tab',
                        default: 'auto',
                        items: {
                            manual: f.column({
                                items: {
                                    lightness: f.float({ step: 0.1, min: 0, max: 1 }),
                                    chroma: f.float({ step: 0.01, softMax: 0.2, min: 0, max: 1 }),
                                    hue: f.int({ step: 20, min: 0, max: 360 }),
                                    shadow: templateContrast({ id: 'number-field-shadow', label: 'Shadow', f }),
                                },
                            }),
                            auto: f.column({
                                border: false,
                                collapsed: false,
                                items: {
                                    inputNumberContrast: f.float({
                                        label: 'Contrast',
                                        step: 0.1,
                                        min: -1,
                                        max: 1,
                                        default: 0.5,
                                    }),
                                    accentBleed: f.float({ min: 0, max: 1 }),
                                    hueShift: f.int({ step: 20, min: -180, max: 180 }),
                                    shadow: templateContrast({ id: 'number-field-shadow', label: 'Shadow', f: f }),
                                },
                            }),
                        },
                    }),
                    border: f.choice({
                        label: 'Border',
                        border: false,
                        appearance: 'tab',
                        default: 'auto',
                        items: {
                            none: f.column({}),
                            manual: f.column({
                                items: {
                                    lightness: f.float({ step: 0.1, min: 0, max: 1 }),
                                    chroma: f.float({ step: 0.01, softMax: 0.2, min: 0, max: 1 }),
                                    hue: f.int({ step: 20, min: 0, max: 360 }),
                                },
                            }),
                            auto: f.column({
                                border: false,
                                collapsed: false,
                                items: {
                                    inputNumberContrast: f.float({
                                        label: 'Contrast',
                                        step: 0.1,
                                        min: -1.0,
                                        max: 1.0,
                                        default: -0.3,
                                    }),
                                    accentBleed: f.float({ min: 0, max: 1 }),
                                    hueShift: f.int({ step: 20, min: -180, max: 180 }),
                                },
                            }),
                        },
                    }),

                    // .optional(true),
                },
            }),
        }
    },
    {
        name: 'Theme Settings',
        initialSerial: () => readJSON('settings/active_theme.json'),
        onValueChange: () => {
            console.log('[🪥] - Changed globally!')
            cushy.themeManager.updateCSSFromForm()
        },
        onSerialChange: (form) => {
            writeJSON('settings/active_theme.json', form.serial)
            // if (cushy.themeManager) {
            //     // cushy.themeManager.isDirty = true
            //     cushy.themeManager.updateCSSFromForm()
            //     console.log('[🪥] - Changed!')
            // }
            //
        },
    },
)

// export const ThemeForm = MakeThemeForm()
