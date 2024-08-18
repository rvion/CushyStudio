import type { FormGlobalLayoutMode } from '../../state/conf/FormGlobalLayoutMode'
import type { Kolor } from '../kolor/Kolor'
import type { Tint, TintExt } from '../kolor/Tint'


/**
 * set of shared configuration used by cushy kit;
 * to be injected via context
 * can be configured by project
 */
export interface CSuiteConfig {
    // ------------------------------------------------------------
    // [tooltip delay]
    /** how much delay on hover before relealing the tooltip */
    tooltipDelay: Maybe<number>

    // ------------------------------------------------------------
    // [mouse sensitivity]
    clickAndSlideMultiplicator: number

    // ------------------------------------------------------------
    // [global form layout]
    labellayout: FormGlobalLayoutMode

    // ------------------------------------------------------------
    // [widget components]
    showWidgetExtra: boolean
    showWidgetUndo: boolean
    showWidgetMenu: boolean
    showWidgetDiff: boolean
    showToggleButtonBox: boolean
    showFoldButtons: boolean

    // ------------------------------------------------------------
    // [size]
    widgetHeight: number
    inputHeight: number
    insideHeight: number

    // ------------------------------------------------------------
    // [theme]
    base: Kolor
    baseStr: string
    text: Tint

    inputBorder: TintExt
    inputContrast: TintExt

    labelText?: Tint
    labelBackground?: TintExt
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
