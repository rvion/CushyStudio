import type { RSSize } from './RsuiteTypes'
import type { STATE } from 'src/state/state'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import React, { ReactNode, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useSt } from 'src/state/stateContext'
import { searchMatches } from 'src/utils/misc/searchMatches'

type SelectProps<T> = {
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
    placeholder?: string
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

    constructor(public st: STATE, public p: SelectProps<T>) {
        makeAutoObservable(this, { anchorRef: false })
    }
    onChange = this.p.onChange
    isMultiSelect = this.p.multiple ?? false
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

    get displayValue(): ReactNode {
        if (this.p.hideValue) return this.p.placeholder ?? ''
        const value = this.value
        const placeHolderStr = this.p.placeholder ?? 'Select...'
        if (value == null) return placeHolderStr
        if (Array.isArray(value)) {
            const str =
                value.length === 0 //
                    ? placeHolderStr
                    : value.map((i) => {
                          const label = this.p.getLabelText(i)
                          return (
                              <div key={label} tw='badge badge-primary'>
                                  {label}
                              </div>
                          )
                      })
            if (this.p.label)
                return (
                    <div tw='flex gap-1'>
                        {this.p.label}: ${str}
                    </div>
                )
            return <div tw='flex gap-1'>{str}</div>
        } else {
            const str = this.p.getLabelText(value)
            if (this.p.label) return `${this.p.label}: ${str}`
            return str
        }
    }

    anchorRef = React.createRef<HTMLInputElement>()
    selectedIndex = 0
    isOpen = false

    tooltipPosition = { top: 0, left: 0 }
    tooltipMaxHeight = 100
    updatePosition = () => {
        const rect = this.anchorRef.current?.getBoundingClientRect()
        if (rect == null) return
        this.tooltipPosition = {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        }

        /* Make sure to not go off-screen */
        this.tooltipMaxHeight = window.innerHeight - rect.bottom - 8
    }

    onTooltipMouseOut = (ev: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
        // ev.preventDefault()
        // ev.stopPropagation()
        this.closeMenu()
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
            const shouldResetQuery = this.p.resetQueryOnPick ?? !this.isMultiSelect
            const shouldCloseMenu = this.p.closeOnPick ?? !this.isMultiSelect
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

    setNavigationIndex(value: number) {
        this.updatePosition() // just in case we scrolled
        this.selectedIndex = value
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

export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    const st = useSt()
    const s = useMemo(() => new AutoCompleteSelectState(st, p), [])
    return (
        <div
            tw='flex flex-1 items-center h-full p-0.5 relative'
            className={p.className}
            ref={s.anchorRef}
            onKeyUp={s.onRealInputKeyUp}
            onMouseDown={s.onRealWidgetMouseDown}
            onChange={s.handleInputChange}
            onKeyDown={s.handleTooltipKeyDown}
            onFocus={s.openMenu}
            onBlur={s.onBlur}
            style={{ background: s.searchQuery === '' ? 'none' : undefined }}
        >
            <div className='flex-1'>
                {/* ANCHOR */}
                <div //
                    tabIndex={-1}
                    tw='input input-xs text-sm flex items-center gap-1 bg-transparent p-0 select-none pointer-events-none'
                >
                    {s.isOpen ? (
                        <></>
                    ) : (
                        <>
                            <div tw='btn btn-square btn-xs bg-transparent border-0'>
                                <span className='material-symbols-outlined'>search</span>
                            </div>
                            <div tw='whitespace-nowrap overflow-hidden'>{s.displayValue}</div>
                            <div tw='btn btn-square btn-xs ml-auto bg-transparent border-0'>
                                <span className='material-symbols-outlined'>arrow_drop_down</span>
                            </div>
                        </>
                    )}
                </div>
                <div tw='absolute top-0 left-0 right-0 z-100 '>
                    <input
                        //
                        tw='input input-sm w-full'
                        type='text'
                        value={s.searchQuery}
                        onChange={() => {}}
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
        <div
            tw={['MENU-ROOT _SelectPopupUI bg-base-100 flex', 'rounded-b border-b border-l border-r border-base-300']}
            style={{
                minWidth: s.anchorRef.current?.clientWidth ?? '100%',
                pointerEvents: 'initial',
                position: 'absolute',
                zIndex: 99999999,
                top: `${s.tooltipPosition.top}px`,
                left: `${s.tooltipPosition.left}px`,
                maxHeight: `${s.tooltipMaxHeight}px`,
                // Adjust positioning as needed
            }}
        >
            <ul
                onMouseLeave={s.onTooltipMouseOut}
                className='p-0.5 bg-base-100 max-h-96 overflow-auto'
                tw='flex flex-col gap-0.5 p-1 w-full'
            >
                {s.filteredOptions.length === 0 ? <li className='p-1 text-base'>No results</li> : null}
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
                            className={`active:bg-base-300 cursor-pointer text-shadow ${
                                index === s.selectedIndex && (isSelected ? '!text-primary-content text-shadow' : 'bg-base-300')
                            }`}
                            tw={[
                                'flex items-center gap-1 rounded',
                                isSelected && 'bg-primary text-primary-content hover:text-neutral-content text-shadow-inv',
                            ]}
                            onMouseEnter={(ev) => {
                                s.setNavigationIndex(index)
                            }}
                            onMouseDown={(ev) => s.onMenuEntryClick(ev, index)}
                        >
                            <div tw={'rounded py-3 h-6'}>
                                {s.isMultiSelect ? (
                                    <input
                                        onChange={() => {}}
                                        checked={isSelected}
                                        type='checkbox'
                                        tw='checkbox checkbox-primary checkbox-sm input-xs bg-none'
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                            {/* {isSelected ? '🟢' : null} */}
                            {s.p.getLabelUI //
                                ? s.p.getLabelUI(option)
                                : s.p.getLabelText(option)}
                        </li>
                    )
                })}
            </ul>
        </div>,
        document.getElementById('tooltip-root')!,
    )
})
