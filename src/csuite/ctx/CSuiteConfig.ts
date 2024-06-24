import type { Kolor } from '../kolor/Kolor'
import type { Tint } from '../kolor/Tint'

import { NumberVar } from '../tinyCSS/CSSVar'

/**
 * set of shared configuration used by cushy kit;
 * to be injected via context
 * can be configured by project
 */
export interface CSuiteConfig {
    // ------------------------------------------------------------
    // [mouse sensitivity]
    clickAndSlideMultiplicator: number

    // ------------------------------------------------------------
    // [widget layout]
    labellayout: 'fixed-left' | 'fixed-right' | 'fluid'

    // ------------------------------------------------------------
    // [widget components]
    showWidgetExtra: boolean
    showWidgetUndo: boolean
    showWidgetMenu: boolean
    showWidgetDiff: boolean
    showToggleButtonBox: boolean

    // ------------------------------------------------------------
    // [size]
    inputHeight: number

    // ------------------------------------------------------------
    // [theme]
    base: Kolor
    baseStr: string
    text: Tint
    inputBorder: number | NumberVar<'input-border'>
    labelText?: Tint
    shiftDirection?: 1 | -1 /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    fieldGroups: {
        border?: Maybe<number>
        contrast?: Maybe<number>
    }

    // ------------------------------------------------------------
    // [misc]
    /**
     * @default false
     * when true, force labels to remain inline, and show ellipsis when label is too long  */
    truncateLabels?: boolean
}
