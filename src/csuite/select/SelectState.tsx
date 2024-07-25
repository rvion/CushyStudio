import type { RevealHideReason } from '../reveal/RevealProps'
import type { RevealState } from '../reveal/RevealState'
import type { RevealStateLazy } from '../reveal/RevealStateLazy'
import type { SelectProps } from './SelectProps'

import { makeAutoObservable } from 'mobx'
import React, { ReactNode } from 'react'

import { getUIDForMemoryStructure } from '../utils/getUIDForMemoryStructure'
import { createObservableRef } from '../utils/observableRef'
import { searchMatches } from '../utils/searchMatches'

interface ToolTipPosition {
    top?: number | undefined
    bottom?: number | undefined
    left?: number | undefined
    right?: number | undefined
}

export class AutoCompleteSelectState<OPTION> {
    // various refs for our select so we can quickly puppet
    // various key dom elements of the select, or move the focus
    // around when needed

    anchorRef = createObservableRef<HTMLDivElement>()
    inputRef_real = createObservableRef<HTMLInputElement>()
    revealStateRef = createObservableRef<RevealStateLazy>()

    selectedIndex: number = 0
    get revealState(): Maybe<RevealState> {
        return this.revealStateRef.current?.state
    }
    get isOpen(): boolean {
        return this.revealStateRef.current?.state?.isVisible ?? false
    }
    wasEnabled: boolean = false
    tooltipPosition: ToolTipPosition = { top: undefined, bottom: undefined, left: undefined, right: undefined }
    tooltipMaxHeight: number = 100

    /** return the unique key for the given option */
    getKey(option: OPTION): React.Key | null | undefined {
        return this.p.getKey?.(option) ?? getUIDForMemoryStructure(option)
    }

    constructor(public p: SelectProps<OPTION>) {
        makeAutoObservable(this, {
            anchorRef: false,
            inputRef_real: false,
        })
    }

    /**
     * return true if given option selected
     * (or one of the selected values, if this.isMultiSelect)
     */
    isOptionSelected(option: OPTION): boolean {
        const selected = this.value
        if (selected == null) return false
        if (Array.isArray(selected)) return selected.some((s) => this.isEqual(s, option))
        return this.isEqual(selected, option)
    }

    /**
     * return true if the given option is the only one selected
     * (return false if more than one option is selected when this.isMultiSelect)
     */
    isSingleSelectedOption(option: OPTION): boolean {
        const selected = this.value
        if (selected == null) return false
        if (Array.isArray(selected)) return selected.length === 1 && selected.some((s) => this.isEqual(s, option))
        return this.isEqual(selected, option)
    }

    isMultiSelect = this.p.multiple ?? false

    get options(): OPTION[] {
        return this.p.options?.(this.searchQuery) ?? [] // replace with actual options logic
    }

    /**
     * function to compare value or options,
     * using the provided equality check  if provided.
     *
     * '===' check if the object is exactly the same.
     * It work in some cases like those:
     * case 1: 🟢
     *   | const myvar = {a:1}
     *   | <SelectUI options={[myvar, {a:2}]}, value={myvar} />
     * case 2: 🟢
     *   | <SelectUI options={[1,2]}, value={1} />
     *   (because primitve type are always compared by value)
     *
     * but not here
     *
     * case 3: ❌
     *   | <SelectUI options={[{a:1}, {a:2}]}, value={{a:1}} />
     *                          👆   is NOT '===' to  👆 (not the same instance object)
     *                                but is "equal" according to human logic
     *
     */
    isEqual = (a: OPTION, b: OPTION): boolean => {
        if (this.p.equalityCheck) return this.p.equalityCheck(a, b)
        return a === b
    }

    /**
     * return the index of the first selected Item amongst options;
     * just in case the name wasn't clear enough.
     * TODO: rename this funciton, and remove this comment about the function name.
     */
    get indexOfFirstSelectedItemAmongstOptions(): Maybe<number> {
        const firstSelection = this.firstValue
        if (firstSelection == null) return null
        return this.options.findIndex((o) => this.isEqual(o, firstSelection))
    }

    /** return the first selected value */
    get firstValue(): Maybe<OPTION> {
        const v = this.value
        if (v == null) return null
        if (Array.isArray(v)) {
            if (v.length === 0) return null
            return v[0]
        }
        return v
    }

    /** currently selected value or values */
    get value(): Maybe<OPTION | OPTION[]> {
        return this.p.value?.()
    }

    /** list of all selected values */
    get values(): OPTION[] {
        const v = this.value
        if (v == null) return []
        return Array.isArray(v) ? v : [v]
    }

    displayOption(option: OPTION): React.ReactNode {
        if (this.p.getLabelUI) return this.p.getLabelUI(option)
        const label = this.p.getLabelText(option)
        return label

        //   if (!this.isMultiSelect) return label
        //   return (
        //       <BadgeUI
        //           key={label}
        //           // hack to allow to unselect quickly selected items
        //           onClick={() => this.p.onOptionToggled?.(i, this)}
        //       >
        //           {label}
        //       </BadgeUI>
        //   )
    }

    getDisplayValueWithLabel(): ReactNode {
        if (this.p.label)
            return (
                <>
                    {this.p.label}: {this.displayValue}
                </>
            )
        return <>{this.displayValue}</>
    }

    get displayValue(): ReactNode {
        if (this.p.hideValue) return this.p.placeholder ?? ''
        let value = this.value
        const placeHolderStr = this.p.placeholder ?? 'Select...'
        if (value == null) return placeHolderStr
        value = Array.isArray(value) ? value : [value]
        if (value.length === 0) return placeHolderStr

        return value.map((op) => this.displayOption(op))
    }

    // UNUSED
    openMenuProgrammatically = (): void => {
        this.revealState?.log(`🔶 SelectSate openMenuProgrammatically`)
        this.revealStateRef.current?.getRevealState()?.open()
        this.inputRef_real.current?.focus() // 🔴 never been tested
    }

    closeMenu(reason: RevealHideReason): void {
        this.revealState?.log(`🔶 SelectSate closeMenu`)
        this.revealStateRef.current?.state?.close(reason)
        // this.clean() // 🔶 called by onHidden
    }

    clean(): void {
        this.revealState?.log(`🔶 SelectSate clean`)
        this.selectedIndex = 0
        this.searchQuery = ''
    }

    closeIfShouldCloseAfterSelection(): void {
        // close the menu
        const shouldCloseMenu = this.p.closeOnPick ?? !this.isMultiSelect
        if (shouldCloseMenu) this.closeMenu('pickOption')
    }

    // click means focus change => means need to refocus the input
    // ⏸️ onMenuEntryClick = (ev: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    // ⏸️     ev.preventDefault()
    // ⏸️     ev.stopPropagation()
    // ⏸️     this.selectOption(index)
    // ⏸️     this.inputRef.current?.focus()
    // ⏸️ }

    /**
     * SEARCH/FILTER OPTIONS
     **/

    private _searchQuery = ''
    get searchQuery(): string {
        return this.p.getSearchQuery?.() ?? this._searchQuery
    }
    set searchQuery(value: string) {
        if (this.p.setSearchQuery) this.p.setSearchQuery(value)
        else this._searchQuery = value
    }

    get filteredOptions(): OPTION[] {
        if (this.searchQuery === '') return this.options
        if (this.p.disableLocalFiltering) return this.options
        return this.options.filter((p) => {
            const label = this.p.getLabelText(p)
            return searchMatches(label, this.searchQuery)
        })
    }

    filterOptions(inputValue: string): void {
        this.searchQuery = inputValue
        /* Could maybe try to keep to the highlighted option from before filter? (Not the index, but the actual option)
         * This is just easier for now, and I think it's better honestly. It's more predictable behavior for the user. */
        this.setNavigationIndex(0)
        // Logic to filter options based on input value
        // Update this.filteredOptions accordingly
    }

    /**
     * EVENTS ON OPTIONS
     **/

    toggleOptionFromFilteredOptionsAtIndex(index: number): void {
        const selectedOption = this.filteredOptions[index]
        if (selectedOption != null) this.toggleOption(selectedOption)
    }

    toggleOption(option: OPTION): void {
        this.revealState?.log(`_ SelectSate toggleOption`)
        this.p.onOptionToggled?.(option, this)
        // reset the query
        const shouldResetQuery = this.p.resetQueryOnPick ?? false // !this.isMultiSelect
        if (shouldResetQuery) this.searchQuery = ''
        // close the menu
        this.closeIfShouldCloseAfterSelection()
    }

    /**
     * MOVE IN OPTIONS LIST
     **/
    navigateSelection(direction: 'up' | 'down'): void {
        if (direction === 'up' && this.selectedIndex > 0) {
            this.selectedIndex--
        } else if (direction === 'down' && this.selectedIndex < this.filteredOptions.length - 1) {
            this.selectedIndex++
        }
    }

    setNavigationIndex(value: number): void {
        this.selectedIndex = value
    }

    handleTooltipKeyDown = (ev: React.KeyboardEvent): void => {
        this.revealState?.log(`_ SelectSate handleTooltipKeyDown (probably arrows)`)
        if (ev.key === 'ArrowDown') this.navigateSelection('down')
        else if (ev.key === 'ArrowUp') this.navigateSelection('up')
        else if (ev.key === 'Enter' && !ev.metaKey && !ev.ctrlKey) {
            this.toggleOptionFromFilteredOptionsAtIndex(this.selectedIndex)
            this.closeIfShouldCloseAfterSelection()
        }

        // when the select is hidden but the anchor is focused
        // typing a letter should add it to the search query in addition to opening the select
        const isLetter = ev.keyCode >= 65 && ev.keyCode <= 90
        if (isLetter && !this.revealState?.isVisible) {
            // setTimeout prevents from having the newly added letter being selected due to subsequent input.focus()
            setTimeout(() => (this.searchQuery += ev.key), 0)
        }
    }
}
