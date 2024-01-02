import type { STATE } from 'src/state/state'
import type { RSSize } from './RsuiteTypes'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { useSt } from 'src/state/stateContext'
import { searchMatches } from 'src/utils/misc/searchMatches'
import { createPortal } from 'react-dom'
import { nanoid } from 'nanoid'

type PP<T> = {
    label?: string
    /** callback when a new option is added */
    onChange: null | ((next: T, self: AutoCompleteSelectState<T>) => void)
    /** list of all options */
    options?: () => T[]
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
    size?: RSSize
    disabled?: boolean
    cleanable?: boolean
    hideValue?: boolean
    className?: string
    /** @default: false if multi-select, true if single select */
    closeOnPick?: boolean
    /** @default: false if multi-select, true if single select */
    resetQueryOnPick?: boolean
}

class AutoCompleteSelectState<T> {
    /** for debugging purposes */
    _uid = nanoid()

    constructor(public st: STATE, public p: PP<T>) {
        makeAutoObservable(this, { anchorRef: false })
    }
    onChange = this.p.onChange
    multiple = this.p.multiple ?? false
    get options(): T[] {
        return this.p.options?.() ?? [] // replace with actual options logic
    }
    get filteredOptions() {
        if (this.searchQuery === '') return this.options
        return this.options.filter((p) => {
            const label = this.p.getLabelText(p)
            return searchMatches(label, this.searchQuery)
        })
    }
    searchQuery = ''

    /** currently selected value */
    get value(): Maybe<T | T[]> {
        return this.p.value?.()
    }

    /** list of all selected values */
    get values(): T[] {
        const v = this.value
        if (v == null) return []
        return Array.isArray(v) ? v : [v]
    }

    get displayValue(): string {
        if (this.p.hideValue) return ''
        const sop = this.value
        if (sop == null) return 'Select...'
        const str = Array.isArray(sop) ? sop.map(this.p.getLabelText).join(', ') : this.p.getLabelText(sop)
        if (this.p.label) return `${this.p.label}: ${str}`
        return str
    }

    anchorRef = React.createRef<HTMLInputElement>()
    selectedIndex = 0
    isOpen = false

    tooltipPosition = { top: 0, left: 0 }
    updatePosition = () => {
        const rect = this.anchorRef.current?.getBoundingClientRect()
        if (rect == null) return
        this.tooltipPosition = {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        }
    }

    onRealWidgetMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // ev.preventDefault()
        // ev.stopPropagation()
        this.openMenu()
    }
    openMenu = () => {
        this.isOpen = true
        this.updatePosition()
    }

    closeMenu() {
        this.isOpen = false
        this.selectedIndex = 0
        this.searchQuery = ''
    }

    filterOptions(inputValue: string) {
        this.searchQuery = inputValue
        this.isOpen = true
        // Logic to filter options based on input value
        // Update this.filteredOptions accordingly
    }

    // click means focus change => means need to refocus the input
    onMenuEntryClick = (ev: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        ev.preventDefault()
        ev.stopPropagation()
        this.selectOption(index)
        this.anchorRef.current?.focus()
    }

    selectOption(index: number) {
        const selectedOption = this.filteredOptions[index]
        if (selectedOption) {
            this.onChange?.(selectedOption, this)
            const shouldResetQuery = this.p.resetQueryOnPick ?? !this.multiple
            const shouldCloseMenu = this.p.closeOnPick ?? !this.multiple
            if (shouldResetQuery) this.searchQuery = ''
            if (shouldCloseMenu) this.closeMenu()
        }
    }

    navigateSelection(direction: 'up' | 'down') {
        this.updatePosition() // just in case we scrolled
        if (direction === 'up' && this.selectedIndex > 0) {
            this.selectedIndex--
        } else if (direction === 'down' && this.selectedIndex < this.filteredOptions.length - 1) {
            this.selectedIndex++
        }
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.filterOptions(event.target.value)
        this.updatePosition() // just in case we scrolled
    }

    onBlur = () => {
        this.closeMenu()
    }

    handleTooltipKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === 'ArrowDown') this.navigateSelection('down')
        else if (ev.key === 'ArrowUp') this.navigateSelection('up')
        else if (ev.key === 'Enter' && !ev.metaKey && !ev.ctrlKey) this.selectOption(this.selectedIndex)
    }

    onRealInputKeyUp = (ev: React.KeyboardEvent) => {
        if (ev.key === 'Escape') {
            this.closeMenu()
            this.anchorRef.current?.focus()
            ev.preventDefault()
            ev.stopPropagation()
        }
    }
}

export const SelectUI = observer(function SelectUI_<T>(p: PP<T>) {
    const st = useSt()
    const s = useMemo(() => new AutoCompleteSelectState(st, p), [])
    return (
        <div tw='flex flex-1 items-center' className={p.className}>
            {/* <span tw='btn btn-sm' className='material-symbols-outlined'>
                search
            </span> */}
            <div className='relative flex-1 w-full'>
                {/* {p.label && (
                    <span tw='btn btn-sm absolute right-0' className='material-symbols-outlined'>
                    search
                    </span>
                )} */}
                {/* ANCHOR */}
                <div //
                    tabIndex={-1}
                    tw='input input-bordered input-sm w-full overflow-hidden'
                >
                    {s.displayValue}
                </div>
                <div tw='absolute top-0 left-0 right-0 z-50'>
                    <input
                        ref={s.anchorRef}
                        onKeyUp={s.onRealInputKeyUp}
                        onMouseDown={s.onRealWidgetMouseDown}
                        onChange={s.handleInputChange}
                        onKeyDown={s.handleTooltipKeyDown}
                        onFocus={s.openMenu}
                        onBlur={s.onBlur}
                        style={{ background: s.searchQuery === '' ? 'none' : undefined }}
                        // style={{ opacity: s.searchQuery === '' ? 0 : 1 }}
                        // style={{ background: 'none' }}
                        // tw='input input-bordered input-sm w-full'
                        tw='input input-sm w-full'
                        // placeholder={s.displayValue}
                        type='text'
                        value={s.searchQuery}
                    />
                </div>
                {/* TOOLTIP */}
                {s.isOpen && <SelectPopupUI s={s} />}
            </div>
        </div>
    )
})

export const SelectPopupUI = observer(function SelectPopupUI_<T>(p: { s: AutoCompleteSelectState<T> }) {
    const s = p.s
    return createPortal(
        <ul
            style={{
                pointerEvents: 'initial',
                position: 'absolute',
                zIndex: 99999999,
                top: `${s.tooltipPosition.top}px`,
                left: `${s.tooltipPosition.left}px`,
                // Adjust positioning as needed
            }}
            className='_SelectPopupUI p-2 bg-base-100 shadow-2xl max-h-60 overflow-auto'
        >
            {s.filteredOptions.length === 0 ? <li className='p-2'>No results</li> : null}
            {s.filteredOptions.map((option, index) => {
                const isSelected =
                    s.values.find((v) => {
                        if (s.p.equalityCheck != null) return s.p.equalityCheck(v, option)
                        return v === option
                    }) != null
                return (
                    <li
                        key={index}
                        style={{ minWidth: '10rem' }}
                        className={`p-2 hover:bg-base-300 cursor-pointer ${index === s.selectedIndex ? 'bg-base-300' : ''}`}
                        tw={[isSelected && 'bg-primary text-primary-content']}
                        onMouseDown={(ev) => s.onMenuEntryClick(ev, index)}
                    >
                        {/* {isSelected ? '🟢' : null} */}
                        {s.p.getLabelUI //
                            ? s.p.getLabelUI(option)
                            : s.p.getLabelText(option)}
                    </li>
                )
            })}
        </ul>,
        document.getElementById('tooltip-root')!,
    )
})
