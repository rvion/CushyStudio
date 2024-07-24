import type { RevealStateLazy } from '../reveal/RevealStateLazy'
import type { SelectProps } from './SelectProps'
import type { FocusEvent } from 'react'

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
    anchorRef = createObservableRef<HTMLInputElement>()
    inputRef_fake = createObservableRef<HTMLInputElement>()
    inputRef_real = createObservableRef<HTMLInputElement>()
    popupRef = createObservableRef<HTMLDivElement>()
    revealStateRef = createObservableRef<RevealStateLazy>()

    selectedIndex: number = 0
    get isOpen(): boolean {
        return this.revealStateRef.current?.state?.isVisible ?? false
    }
    isDragging: boolean = false
    isFocused: boolean = false
    wasEnabled: boolean = false
    hasMouseEntered: boolean = false
    tooltipPosition: ToolTipPosition = { top: undefined, bottom: undefined, left: undefined, right: undefined }
    tooltipMaxHeight: number = 100

    /** return the unique key for the given option */
    getKey(option: OPTION): React.Key | null | undefined {
        return this.p.getKey?.(option) ?? getUIDForMemoryStructure(option)
    }

    constructor(public p: SelectProps<OPTION>) {
        makeAutoObservable(this, {
            popupRef: false,
            anchorRef: false,
            inputRef_fake: false,
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

    get displayValue(): ReactNode {
        if (this.p.hideValue) return this.p.placeholder ?? ''
        let value = this.value
        const placeHolderStr = this.p.placeholder ?? 'Select...'
        if (value == null) return placeHolderStr
        value = Array.isArray(value) ? value : [value]
        // if (Array.isArray(value)) {
        const str =
            value.length === 0 //
                ? placeHolderStr
                : value.map((i) => {
                      return this.displayOption(i)
                  })
        if (this.p.label)
            return (
                <>
                    {this.p.label}: {str}
                </>
            )
        return <>{str}</>
        // } else {
        //     const str = this.p.getLabelText(value)
        //     if (this.p.label) return `${this.p.label}: ${str}`
        //     return str
        // }
    }

    updatePosition = (): void => {
        const rect = this.anchorRef.current?.getBoundingClientRect()
        if (rect == null) return

        /* Default anchoring is to favor bottom-left */
        this.tooltipPosition = {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            right: undefined,
            bottom: undefined,
        }

        /* Which direction has more space? */
        const onBottom = window.innerHeight * 0.5 < (rect.top + rect.bottom) * 0.5
        const onLeft = window.innerWidth * 0.5 < (rect.left + rect.right) * 0.5

        /* Make sure pop-up always fits within screen, but isn't too large */
        this.tooltipMaxHeight = (window.innerHeight - rect.bottom) * 0.99

        // 2024-03-28 @rvion: not so sure about that use of `window.getComputedStyle(document.body).getPropertyValue('--input-height'))`
        // ping 🌶️
        const inputHeight = parseInt(window.getComputedStyle(document.body).getPropertyValue('--input-height'))
        /* Add 1.25 in case of headers, needs to be done properly by getting if there's a title when moving this to RevealUI. */
        const desiredHeight = Math.min(this.options.length * inputHeight * 1.25)
        const bottomSpace = window.innerHeight - rect.bottom

        /* Make sure pop-up never goes off-screen vertically, preferring to go on the bottom if there is space. */
        if (onBottom && desiredHeight > bottomSpace) {
            /* This probably doesn't take in to account the fact that the browser's menu bar cuts off the top. */
            this.tooltipMaxHeight = rect.top * 0.99

            this.tooltipPosition.top = undefined
            this.tooltipPosition.bottom = window.innerHeight - rect.top
        }

        /* Make sure pop-up never goes off-screen horizontally.  */
        if (onLeft) {
            this.tooltipPosition.left = undefined
            this.tooltipPosition.right = window.innerWidth - rect.right
        }
    }

    onRealWidgetMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        // ev.preventDefault()
        // ev.stopPropagation()
        this.hasMouseEntered = true
        this.openMenu()
    }

    openMenu = (): void => {
        this.revealStateRef.current?.getRevealState()?.enterAnchor()
        this.updatePosition()
        this.inputRef_fake.current?.focus()
    }

    closeMenu(): void {
        this.revealStateRef.current?.state?.close()
        this.isFocused = false
        this.selectedIndex = 0
        this.searchQuery = ''
        this.isDragging = false
        this.hasMouseEntered = false

        // Text cursor should only show when menu is open
        // this.anchorRef?.current?.querySelector('input')?.blur()
    }

    filterOptions(inputValue: string): void {
        this.searchQuery = inputValue
        /* Could maybe try to keep to the highlighted option from before filter? (Not the index, but the actual option)
         * This is just easier for now, and I think it's better honestly. It's more predictable behavior for the user. */
        this.setNavigationIndex(0)
        // Logic to filter options based on input value
        // Update this.filteredOptions accordingly
    }

    // click means focus change => means need to refocus the input
    // ⏸️ onMenuEntryClick = (ev: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    // ⏸️     ev.preventDefault()
    // ⏸️     ev.stopPropagation()
    // ⏸️     this.selectOption(index)
    // ⏸️     this.inputRef.current?.focus()
    // ⏸️ }

    toggleOptionFromFilteredOptionsAtIndex(index: number): void {
        const selectedOption = this.filteredOptions[index]
        if (selectedOption != null) this.toggleOption(selectedOption)
    }

    toggleOption(option: OPTION): void {
        this.p.onOptionToggled?.(option, this)
        // reset the query
        const shouldResetQuery = this.p.resetQueryOnPick ?? false // !this.isMultiSelect
        if (shouldResetQuery) this.searchQuery = ''
        // close the menu
        this.closeIfShouldCloseAfterSelection()
    }

    closeIfShouldCloseAfterSelection(): void {
        // close the menu
        const shouldCloseMenu = this.p.closeOnPick ?? !this.isMultiSelect
        if (shouldCloseMenu) this.closeMenu()
    }

    navigateSelection(direction: 'up' | 'down'): void {
        this.updatePosition() // just in case we scrolled
        if (direction === 'up' && this.selectedIndex > 0) {
            this.selectedIndex--
        } else if (direction === 'down' && this.selectedIndex < this.filteredOptions.length - 1) {
            this.selectedIndex++
        }
    }

    setNavigationIndex(value: number): void {
        this.updatePosition() // just in case we scrolled
        this.selectedIndex = value
    }

    handleInputChange = (next: string): void => {
        this.filterOptions(next)
        this.updatePosition() // just in case we scrolled
    }

    // onBlur(_ev: FocusEvent<HTMLDivElement, Element>): void {
    //     this.closeMenu()
    // }

    handleTooltipKeyDown = (ev: React.KeyboardEvent): void => {
        if (ev.key === 'ArrowDown') this.navigateSelection('down')
        else if (ev.key === 'ArrowUp') this.navigateSelection('up')
        else if (ev.key === 'Enter' && !ev.metaKey && !ev.ctrlKey) {
            this.toggleOptionFromFilteredOptionsAtIndex(this.selectedIndex)
            this.closeIfShouldCloseAfterSelection()
        }
    }

    onRealInputKeyUp = (ev: React.KeyboardEvent): void => {
        if (ev.key === 'Enter' && !this.isOpen) {
            this.openMenu()
            ev.preventDefault()
            ev.stopPropagation()
            return
        }
        if (ev.key === 'Escape') {
            this.closeMenu()
            // this.anchorRef.current?.focus()
            ev.preventDefault()
            ev.stopPropagation()
            return
        }

        if (!this.isOpen) {
            this.openMenu()
            this.setNavigationIndex(0)
            ev.preventDefault()
            ev.stopPropagation()
        }
    }
}
