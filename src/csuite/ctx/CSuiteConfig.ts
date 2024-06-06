import type { Kolor } from '../kolor/Kolor'
import type { OKLCH } from '../kolor/OKLCH'

import { NumberVar } from '../tinyCSS/CSSVar'

/**
 * set of shared configuration used by cushy kit;
 * to be injected via context
 * can be configured by project
 */
export interface CSuiteConfig {
    clickAndSlideMultiplicator: number
    showWidgetUndo: boolean
    showWidgetMenu: boolean
    showWidgetDiff: boolean
    showToggleButtonBox: boolean
    //
    inputBorder: number | NumberVar<'input-border'>
    // -----------
    // base colors
    base: OKLCH
    baseStr: string
    text: Kolor
    // misc:
    labelText?: Kolor
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    shiftDirection?: 1 | -1
}
