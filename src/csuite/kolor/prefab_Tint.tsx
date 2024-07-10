import type { Tint } from './Tint'

import { Fragment } from 'react/jsx-runtime'

import { getNum } from '../tinyCSS/CSSVar'

export type UI_Tint = X.XChoices<{
    l: X.XChoice<{
        lightness: X.XNumber
        contrast: X.XNumber
    }>
    c: X.XChoice<{
        chroma: X.XNumber
        chromaBlend: X.XNumber
    }>
    h: X.XChoice<{
        hue: X.XNumber
        hueShift: X.XNumber
    }>
}>

export const ui_tint = (ui: X.Builder, def?: Tint): UI_Tint => {
    return ui.choicesV2(
        {
            l: ui.choiceV2(
                {
                    lightness: ui.number({
                        label: 'Manual',
                        text: 'lightness',
                        min: 0,
                        max: 1,
                        default: getNum(def?.lightness, 0.1),
                        step: 0.1,
                        icon: 'mdiGradientHorizontal',
                    }),
                    contrast: ui.number({
                        label: 'Relative',
                        text: 'contrast',
                        min: -1,
                        softMin: 0,
                        max: 1,
                        default: getNum(def?.contrast, 0.1),
                        step: 0.1,
                        icon: 'mdiInvertColors',
                    }),
                },
                {
                    label: 'Light',
                    default: def?.lightness ? 'lightness' : 'contrast',
                },
            ),
            c: ui.choiceV2(
                {
                    chroma: ui.number({
                        label: 'Manual',
                        min: 0,
                        max: 0.47,
                        default: getNum(def?.chroma, 0.1),
                        step: 0.1,
                        icon: 'mdiPalette',
                    }),
                    chromaBlend: ui.number({
                        label: 'Relative',
                        text: 'multiply',
                        min: 0,
                        softMax: 2,
                        default: getNum(def?.chromaBlend, 1),
                        step: 0.1,
                        icon: 'mdiEyedropper',
                    }),
                },
                {
                    label: 'Chroma',
                    default: def?.chroma ? 'chroma' : 'chromaBlend',
                },
            ),
            h: ui.choiceV2(
                {
                    hue: ui.number({
                        label: 'Manual',
                        min: -360,
                        softMin: 0,
                        max: 360,
                        default: getNum(def?.hue, 220),
                        step: 1,
                        icon: 'mdiPalette',
                    }),
                    hueShift: ui.number({
                        label: 'Relative',
                        text: 'shift',
                        min: -360,
                        softMin: 0,
                        max: 360,
                        default: getNum(def?.hueShift, 0),
                        step: 10,
                        icon: 'mdiEyedropper',
                    }),
                },
                {
                    label: 'Hue',
                    default: def?.hue ? 'hue' : 'hueShift',
                },
            ),
        },
        {
            default: {
                l: def?.lightness != null || def?.contrast != null,
                c: def?.chroma != null || def?.chromaBlend != null,
                h: def?.hue != null || def?.hueShift != null,
            },
            presets: [
                {
                    icon: 'mdiText',
                    label: 'Text (v1)',
                    apply(w): void {
                        w.setValue({
                            l: { contrast: 0.9 },
                            c: { chromaBlend: 1 },
                            h: { hue: 0 },
                        })
                    },
                },
                {
                    icon: 'mdiText',
                    label: 'Text (colored)',
                    apply(w): void {
                        w.setValue({
                            l: { contrast: 0.7 },
                            c: { chroma: 0.3 },
                            h: { hueShift: 180 },
                        })
                    },
                },
                {
                    icon: 'mdiText',
                    label: 'Text (subtle)',
                    apply(w): void {
                        w.setValue({
                            l: { contrast: 0.3 },
                        })
                    },
                },
                {
                    icon: 'mdiSquareCircle',
                    label: 'base 100',
                    apply(w): void {
                        w.setValue({
                            l: { contrast: 0.05 },
                        })
                    },
                },
            ],
            // tabPosition: 'start',
            body: (p) => {
                const { l, c, h } = p.field.enabledBranches
                return (
                    <div tw='grid flex-1 gap-y-1 grid-cols-[auto_minmax(170px,_.5fr)_3fr]'>
                        {/* ------------------ */}
                        {l && (
                            <Fragment>
                                <div tw='flex'>
                                    <l.UIToggle /> L
                                </div>
                                <l.UITab />
                                {l.UIChildren()}
                            </Fragment>
                        )}
                        {/* ------------------ */}
                        {c && (
                            <Fragment>
                                <div tw='flex'>
                                    <c.UIToggle /> C
                                </div>
                                {c.UITab()}
                                {c.UIChildren()}
                            </Fragment>
                        )}
                        {/* ------------------ */}
                        {h && (
                            <Fragment>
                                <div tw='flex'>
                                    <h.UIToggle /> H
                                </div>
                                {h.UITab()}
                                {h.UIChildren()}
                            </Fragment>
                        )}{' '}
                    </div>
                )
            },
        },
    )
}

export const run_tint = (ui: ReturnType<typeof ui_tint>['$Value']): Tint => {
    return {
        // l
        lightness: ui.l?.lightness,
        contrast: ui.l?.contrast,
        // c
        chroma: ui.c?.chroma,
        chromaBlend: ui.c?.chromaBlend,
        // h
        hue: ui.h?.hue,
        hueShift: ui.h?.hueShift,
    }
}
