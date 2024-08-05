import type { FrameProps } from '../frame/Frame'
import type { IconName } from '../icons/icons'
import type { InputStringProps } from '../input-string/InputStringUI'
import type { RevealHideReason, RevealProps } from '../reveal/RevealProps'
import type { SelectOptionProps } from './SelectOptionUI'
import type { SelectPopupProps } from './SelectPopupUI'
import type { AutoCompleteSelectState } from './SelectState'

import React from 'react'

export type SelectProps<OPTION> = {
    label?: string
    startIcon?: IconName

    /**
     * if true, select is virtualized
     * @default true
     */
    virtualized?: boolean | number

    slotPlaceholderWhenNoResults?: React.ReactNode

    /** callback when a new option is selected */
    onOptionToggled: null | ((next: OPTION, self: AutoCompleteSelectState<OPTION>) => void)

    /**
     * list of all choices
     * 👉 If the list of options is generated from the query directly,
     *    you should also set `disableLocalFiltering: true`, to avoid
     *    filtering the options twice.
     */
    options?: (query: string) => OPTION[]

    /** set this to true if your choices */
    disableLocalFiltering?: boolean

    /** if provided, is used to compare options with selected values */
    equalityCheck?: (a: OPTION, b: OPTION) => boolean

    // --------------------------------------------
    /** used to search/filter & for UI if no getLabelUI provided */
    getLabelText: (t: OPTION) => string

    /** if provided, is used to display the options in the popover */
    getLabelUI?: (t: OPTION) => React.ReactNode
    // ^^^
    // - [ ] RENAME
    // - [ ] allow to specify them by well known slot
    //     - 'ColoredBadgeWithCloseKnob'
    //     - 'ColoredBadge'
    //     - 'Badge'
    //     - 'BadgeWithCloseKnob'

    /** if provided, is used to display the selected options in the inside area  */
    getInsideUI?: (t: OPTION) => React.ReactNode
    // - [ ] RENAME
    // - [ ] allow to specify them by well known slot
    //     - 'ColoredBadgeWithCloseKnob'
    //     - 'ColoredBadge'
    //     - 'Badge'
    //     - 'BadgeWithCloseKnob'
    // --------------------------------------------

    /** if not provided, autoKey will be used instead */
    getKey?: (t: OPTION) => string

    /** the selected value / list of values if multiple values provided */
    value?: () => Maybe<OPTION | OPTION[]>

    /** if true, this widget is considered a multi-select */
    multiple?: boolean

    /** text to show when no value yet nor filter query */
    placeholder?: string
    disabled?: boolean
    cleanable?: boolean
    // hideValue?: boolean
    className?: string
    style?: React.CSSProperties

    /**
     * @default: false if multi-select, true if single select
     */
    closeOnPick?: boolean

    /**
     * @default: false
     * (previous default before 2024-02-29: false if multi-select, true if single select)
     */
    resetQueryOnPick?: boolean

    /** hooks required to plug search query from/into some other system */
    getSearchQuery?: () => string
    setSearchQuery?: (val: string) => void

    /**
     * since 2024-06-12
     * @default false
     */
    wrap?: boolean

    onHidden?: (reason: RevealHideReason) => void
    // 🧚‍♀️ onAnchorFocus?: (ev: React.FocusEvent<HTMLElement>) => void
    // 🧚‍♀️ onAnchorBlur?: (ev: React.FocusEvent<HTMLElement>) => void
    // 🧚‍♀️ onAnchorKeyDown?: (ev: React.KeyboardEvent<HTMLElement>) => void
    revealProps?: RevealProps
    anchorProps?: FrameProps
    popupWrapperProps?: FrameProps
    textInputProps?: InputStringProps

    // customization slots
    slotTextInputUI?: React.FC<{ select: AutoCompleteSelectState<OPTION> }>
    slotPopupUI?: React.FC<SelectPopupProps<OPTION>>
    slotAnchorContentUI?: React.FC<{ select: AutoCompleteSelectState<OPTION> }>
    slotDisplayValueUI?: React.FC<{ select: AutoCompleteSelectState<OPTION> }>
    slotResultsListUI?: React.FC<{ select: AutoCompleteSelectState<OPTION> }>
    slotOptionUI?: React.FC<SelectOptionProps<OPTION>>
}
