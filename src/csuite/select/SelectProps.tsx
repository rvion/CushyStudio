import type { AutoCompleteSelectState } from './SelectState'

import React from 'react'

export type SelectProps<T> = {
    label?: string

    /** callback when a new option is added */
    onChange: null | ((next: T, self: AutoCompleteSelectState<T>) => void)

    /**
     * list of all choices
     * 👉 If the list of options is generated from the query directly,
     *    you should also set `disableLocalFiltering: true`, to avoid
     *    filtering the options twice.
     */
    options?: (query: string) => T[]

    /** set this to true if your choices */
    disableLocalFiltering?: boolean

    /** if provided, is used to compare options with selected values */
    equalityCheck?: (a: T, b: T) => boolean

    /** used to search/filter & for UI if no getLabelUI provided */
    getLabelText: (t: T) => string

    /** if provided, is used to display the options */
    getLabelUI?: (t: T) => React.ReactNode

    /** the selected value / list of values if multiple values provided */
    value?: () => Maybe<T | T[]>

    /** if true, this widget is considered a multi-select */
    multiple?: boolean

    /** text to show when no value yet nor filter query */
    placeholder?: string
    disabled?: boolean
    cleanable?: boolean
    hideValue?: boolean
    className?: string

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
}
