import type { RevealHideReason } from '../reveal/RevealProps'
import type { RevealState } from '../reveal/RevealState'
import type { RevealStateLazy } from '../reveal/RevealStateLazy'
import type { SelectProps } from './SelectProps'
import type { ReactNode } from 'react'

import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'
import React, { Fragment } from 'react'

import { hasMod } from '../accelerators/META_NAME'
import { getUIDForMemoryStructure } from '../utils/getUIDForMemoryStructure'
import { createObservableRef } from '../utils/observableRef'
import { searchMatches } from '../utils/searchMatches'
import { SelectDefaultOptionUI } from './SelectOptionBadgeUI'

interface ToolTipPosition {
   top?: number | undefined
   bottom?: number | undefined
   left?: number | undefined
   right?: number | undefined
}

export type SelectValueSlots = 'anchor' | 'popup-input' | 'options-list'

export class AutoCompleteSelectState<OPTION> {
   // various refs for our select so we can quickly puppet
   // various key dom elements of the select, or move the focus
   // around when needed
   uid: string = nanoid()
   anchorRef = createObservableRef<HTMLDivElement>()
   inputRef_real = createObservableRef<HTMLInputElement>()
   revealStateRef = createObservableRef<RevealStateLazy>()

   selectedIndex: number | null = null
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

   isMultiSelect: boolean

   constructor(public p: SelectProps<OPTION>) {
      this.isMultiSelect = p.multiple ?? false
      makeAutoObservable(this, {
         anchorRef: false, // 🚨 ref do not work when observables!
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
      if (Array.isArray(selected))
         return selected.length === 1 && selected.some((s) => this.isEqual(s, option))
      return this.isEqual(selected, option)
   }

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
      if (a != null && typeof a === 'object' && 'id' in a && b != null && typeof b === 'object' && 'id' in b)
         return a.id === b.id
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

   /** return the last selected value */
   get lastValue(): Maybe<OPTION> {
      const v = this.values
      if (v.length === 0) return null
      return v[v.length - 1]
   }

   /** currently selected value or values */
   get value(): (OPTION | OPTION[]) | undefined {
      return this.p.value?.()
   }

   /** list of all selected values */
   get values(): OPTION[] {
      const v = this.value
      if (v == null) return []
      return Array.isArray(v) ? v : [v]
   }

   getHue(option: OPTION): Maybe<number | false> {
      if (
         option != null && //
         typeof option === 'object' &&
         'hue' in option &&
         (typeof option.hue === 'number' || option.hue === false)
      )
         return option.hue
   }

   DefaultDisplayOption = (option: OPTION, opt: { where: SelectValueSlots }): React.ReactNode => {
      const label = this.p.getLabelText(option)
      return (
         <SelectDefaultOptionUI //
            label={label}
            icon={this.p.startIcon}
            hue={this.getHue(option)}
            key={this.getKey(option)}
            closeFn={
               opt.where === 'popup-input' && !this.p.uncloseableOptions //
                  ? (): void => void this.toggleOption(option)
                  : undefined
            }
         />
      )
   }
   DisplayOptionUI(option: OPTION, opt: { where: SelectValueSlots }): React.ReactNode {
      if (this.p.OptionLabelUI) return this.p.OptionLabelUI(option, opt.where, this)
      return this.DefaultDisplayOption(option, opt)
   }

   // ⏸️ getDisplayValueWithLabel(): ReactNode {
   // ⏸️     if (this.p.label)
   // ⏸️         return (
   // ⏸️             <>
   // ⏸️                 {this.p.label}: {this.displayValue}
   // ⏸️             </>
   // ⏸️         )
   // ⏸️     return <>{this.displayValue}</>
   // ⏸️ }

   get displayValueInAnchor(): ReactNode {
      if (this.p.hideValue) return this.p.placeholder ?? ''
      const value: (OPTION | OPTION[]) | undefined = this.value
      const placeHolderStr = <div tw='w-full text-sm text-gray-300 '>{this.p.placeholder ?? 'Select...'}</div>
      if (value === undefined) return placeHolderStr
      // 💬 2024-09-18 rvion:
      // | null is now a valid value; only undefined means no value.
      // |> if (value == null) return placeHolderStr
      const values = Array.isArray(value) ? value : [value]
      if (values.length === 0) return placeHolderStr

      return values.map((op, ix) => (
         <Fragment key={ix}>{this.DisplayOptionUI(op, { where: 'anchor' })}</Fragment>
      ))
   }

   get displayValueInPopup(): ReactNode {
      // no placeholder in popup, it's in the input
      let value = this.value
      if (value == null) return null
      value = Array.isArray(value) ? value : [value]
      if (value.length === 0) return null

      return value.map((op, index) => (
         <Fragment key={index}>{this.DisplayOptionUI(op, { where: 'popup-input' })}</Fragment>
      ))
   }

   // get placeholderElem(): ReactNode {
   //     return <span tw='whitespace-nowrap'>{this.p.placeholder ?? 'Select...'}</span>
   // }

   // get displayValue(): ReactNode {
   //     let value = this.value
   //     if (value == null) return this.placeholderElem
   //     value = Array.isArray(value) ? value : [value]
   //     if (value.length === 0) return this.placeholderElem
   //     return value.map((op) => this.displayOptionInInside(op, { where: 'select-values' }))
   // }

   // UNUSED
   openMenuProgrammatically = (): void => {
      this.revealState?.log(`🔶 SelectSate openMenuProgrammatically`)
      this.revealStateRef.current?.getRevealState()?.open('programmatically-via-open-function')
      this.inputRef_real.current?.focus() // 🔴 never been tested
   }

   closeMenu(reason: RevealHideReason): void {
      this.revealState?.log(`🔶 SelectSate closeMenu`)
      this.revealStateRef.current?.state?.close(reason)
      // this.clean() // 🔶 called by onHidden
   }

   clean(): void {
      this.revealState?.log(`🔶 SelectSate clean`)
      this.selectedIndex = null
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

   private _searchQuery: string = ''
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
      const isCurrentlySelected = this.isOptionSelected(option)
      this.revealState?.log(`_ SelectSate toggleOption`)
      const onOptionToggled = this.p.onOptionToggled ?? this.p.onChange
      onOptionToggled?.(option, this)
      // reset the query
      const shouldResetQuery = this.p.resetQueryOnPick ?? true // !this.isMultiSelect // 🚂 default was false
      if (shouldResetQuery) this.searchQuery = ''
      // close the menu (if we really selected a value)
      if (!isCurrentlySelected) this.closeIfShouldCloseAfterSelection()
   }

   async createOption(): Promise<void> {
      const createdOption = await this.p.createOption?.action()

      if (createdOption != null) {
         this.options.push(createdOption)
         this.toggleOption(createdOption)
      }
   }

   selectAll(): void {
      runInAction(() => {
         if (this.p.onSelectAll && this.searchQuery == '') {
            this.p.onSelectAll(this.searchQuery)
         } else {
            this.filteredOptions.forEach((option) => {
               if (!this.isOptionSelected(option)) this.toggleOption(option)
            })
         }
      })
   }

   selectNone(): void {
      const unselectedOptions = this.searchQuery == '' ? this.values : this.filteredOptions

      runInAction(() => {
         unselectedOptions.forEach((option) => {
            if (this.isOptionSelected(option)) this.toggleOption(option)
         })
      })
   }

   /**
    * MOVE IN OPTIONS LIST
    **/
   navigateSelection(direction: 'up' | 'down'): void {
      if (this.selectedIndex == null) {
         if (direction === 'down') this.selectedIndex = 0
         else if (direction === 'up') this.selectedIndex = this.filteredOptions.length - 1
      } else if (direction === 'up' && this.selectedIndex > 0) {
         this.selectedIndex--
      } else if (direction === 'down' && this.selectedIndex < this.filteredOptions.length - 1) {
         this.selectedIndex++
      }
   }

   setNavigationIndex(value: number): void {
      this.selectedIndex = value
   }

   handleTooltipKeyDown = (ev: React.KeyboardEvent): void => {
      this.revealState?.log(`_ SelectSate handleTooltipKeyDown (${ev.key})`)
      if (ev.key === 'ArrowDown') this.navigateSelection('down')
      else if (ev.key === 'ArrowUp') this.navigateSelection('up')
      else if (ev.key === 'Enter' && !ev.metaKey && !ev.ctrlKey) {
         if (this.selectedIndex != null) this.toggleOptionFromFilteredOptionsAtIndex(this.selectedIndex)
         this.closeIfShouldCloseAfterSelection()
         this.inputRef_real.current?.focus()
      }

      // when the select is hidden but the anchor is focused
      // typing a letter should add it to the search query in addition to opening the select
      const isLetter = ev.keyCode >= 65 && ev.keyCode <= 90
      // 🔴 this does not work anymore because Reveal is opening on key down, so visible is true and the letter isn't added
      // (we can live with it for now)
      if (isLetter && !this.revealState?.isVisible && !hasMod(ev)) {
         // setTimeout prevents from having the newly added letter being selected due to subsequent input.focus()
         setTimeout(() => (this.searchQuery += ev.key), 0)
      }
   }
}
