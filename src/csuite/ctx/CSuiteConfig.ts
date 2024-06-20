import type { Kolor } from '../kolor/Kolor'
import type { Tint } from '../kolor/Tint'

import { NumberVar } from '../tinyCSS/CSSVar'

/**
 * set of shared configuration used by cushy kit;
 * to be injected via context
 * can be configured by project
 */
export interface CSuiteConfig {
    clickAndSlideMultiplicator: number

    showWidgetExtra: boolean
    showWidgetUndo: boolean
    showWidgetMenu: boolean
    showWidgetDiff: boolean
    showToggleButtonBox: boolean

    inputHeight: number

    /**
     * @default false
     * when true, force labels to remain inline, and show ellipsis when label is too long  */
    truncateLabels?: boolean
    // ---------------------------
    inputBorder: number | NumberVar<'input-border'>
    // -----------
    // base colors
    base: Kolor
    baseStr: string
    text: Tint
    // misc:
    labelText?: Tint
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    shiftDirection?: 1 | -1
}
