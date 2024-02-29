import type { STATE } from 'src/state/state'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { ReactNode, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { InputBoolUI } from 'src/controls/widgets/bool/InputBoolUI'
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
    /** text to show when no value yet nor filter query */
    placeholder?: string
    disabled?: boolean
    cleanable?: boolean
    hideValue?: boolean
    className?: string
    /**
     * @default: false
     * (previous default before 2024-02-29: false if multi-select, true if single select)
     */
    closeOnPick?: boolean
    /**
     * @default: false
     * (previous default before 2024-02-29: false if multi-select, true if single select)
     */
    resetQueryOnPick?: boolean
}

class AutoCompleteSelectState<T> {
    constructor(public st: STATE, public p: SelectProps<T>) {
        makeAutoObservable(this, {
            popupRef: false,
            anchorRef: false,
            inputRef: false,
        })
    }

    isMultiSelect = this.p.multiple ?? false

    get options(): T[] {
        return this.p.options?.() ?? [] // replace with actual options logic
    }

    searchQuery = ''

    get filteredOptions() {
        if (this.searchQuery === '') return this.options
        return this.options.filter((p) => {
            const label = this.p.getLabelText(p)
            return searchMatches(label, this.searchQuery)
        })
    }

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
        let value = this.value
        const placeHolderStr = this.p.placeholder ?? 'Select...'
        if (value == null) return placeHolderStr
        value = Array.isArray(value) ? value : [value]
        // if (Array.isArray(value)) {
        const str =
            value.length === 0 //
                ? placeHolderStr
                : value.map((i) => {
                      const label = this.p.getLabelText(i)
                      return (
                          <div key={label} tw='badge badge-primary text-shadow-inv'>
                              {label}
                          </div>
                      )
                  })
        if (this.p.label)
            return (
                <div tw='flex gap-1'>
                    {this.p.label}: {str}
                </div>
            )
        return <div tw='flex gap-1'>{str}</div>
        // } else {
        //     const str = this.p.getLabelText(value)
        //     if (this.p.label) return `${this.p.label}: ${str}`
        //     return str
        // }
    }

    anchorRef = React.createRef<HTMLInputElement>()
    inputRef = React.createRef<HTMLInputElement>()
    popupRef = React.createRef<HTMLDivElement>()
    selectedIndex = 0
    isOpen = false
    isDragging = false
    isFocused = false
    wasEnabled = false

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

    onRealWidgetMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // ev.preventDefault()
        // ev.stopPropagation()
        this.openMenu()
    }

    openMenu = () => {
        this.isOpen = true
        this.updatePosition()
        window.addEventListener('mousemove', this.MouseMoveTooFar, true)
    }

    closeMenu() {
        this.isOpen = false
        this.isFocused = false
        this.selectedIndex = 0
        this.searchQuery = ''
        this.isDragging = false

        // Text cursor should only show when menu is open
        // this.anchorRef?.current?.querySelector('input')?.blur()
        window.removeEventListener('mousemove', this.MouseMoveTooFar, true)
    }

    filterOptions(inputValue: string) {
        this.searchQuery = inputValue
        this.isOpen = true
        /* Could maybe try to keep to the highlighted option from before filter? (Not the index, but the actual option)
         * This is just easier for now, and I think it's better honestly. It's more predictable behavior for the user. */
        this.setNavigationIndex(0)
        // Logic to filter options based on input value
        // Update this.filteredOptions accordingly
    }

    // click means focus change => means need to refocus the input
    onMenuEntryClick = (ev: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        ev.preventDefault()
        ev.stopPropagation()
        this.selectOption(index)
        this.inputRef.current?.focus()
    }

    selectOption(index: number) {
        const selectedOption = this.filteredOptions[index]
        if (selectedOption) {
            this.p.onChange?.(selectedOption, this)
            const shouldResetQuery = this.p.resetQueryOnPick ?? false // !this.isMultiSelect
            const shouldCloseMenu = this.p.closeOnPick ?? false // !this.isMultiSelect
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

    // Close pop-up if too far outside
    // 2024-02-29 rvion:
    // | this code was a good idea; but it's really
    // | not pleasant when working mostly with keyboard and using tab to open selects.
    // | as soon as the moouse move just one pixel, popup close.
    // |  =>  commenting it out until we find a solution confortable in all cases
    MouseMoveTooFar = (event: MouseEvent) => {
        return
        // ⏸️ let popup = this.popupRef?.current
        // ⏸️ let anchor = this.anchorRef?.current
        // ⏸️
        // ⏸️ if (!popup || !anchor) {
        // ⏸️     return
        // ⏸️ }
        // ⏸️
        // ⏸️ const x = event.clientX
        // ⏸️ const y = event.clientY
        // ⏸️
        // ⏸️ // XXX: Should probably be scaled by UI scale
        // ⏸️ const maxDistance = 75
        // ⏸️
        // ⏸️ if (
        // ⏸️     // left
        // ⏸️     popup.offsetLeft - x > maxDistance ||
        // ⏸️     // top
        // ⏸️     popup.offsetTop - y > maxDistance ||
        // ⏸️     // right
        // ⏸️     x - (popup.offsetLeft + popup.offsetWidth) > maxDistance ||
        // ⏸️     // bottom
        // ⏸️     y - (popup.offsetTop + popup.offsetHeight) > maxDistance
        // ⏸️ ) {
        // ⏸️     this.closeMenu()
        // ⏸️ }
    }

    onBlur = () => this.closeMenu()

    handleTooltipKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === 'ArrowDown') this.navigateSelection('down')
        else if (ev.key === 'ArrowUp') this.navigateSelection('up')
        else if (ev.key === 'Enter' && !ev.metaKey && !ev.ctrlKey) this.selectOption(this.selectedIndex)
    }

    onRealInputKeyUp = (ev: React.KeyboardEvent) => {
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

export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    const st = useSt()
    const s = useMemo(() => new AutoCompleteSelectState(st, p), [])
    return (
        <div /* Container/Root */
            tabIndex={-1}
            tw={[
                'WIDGET-FIELD',
                'flex flex-1 items-center p-0.5 relative',
                'rounded overflow-clip text-shadow',
                'border border-base-100 hover:brightness-110',
                'hover:border-base-200',
                'bg-primary/20 border-1',
                'border-b-2 border-b-base-200 hover:border-b-base-300',
            ]}
            className={p.className}
            ref={s.anchorRef}
            onKeyUp={s.onRealInputKeyUp}
            onMouseDown={s.onRealWidgetMouseDown}
            onChange={s.handleInputChange}
            onKeyDown={s.handleTooltipKeyDown}
            onFocus={(ev) => {
                s.isFocused = true
                if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) {
                    s.openMenu()
                }
            }}
            onBlur={s.onBlur}
            style={{ background: s.searchQuery === '' ? 'none' : undefined }}
        >
            <div className='flex-1 h-full '>
                {/* ANCHOR */}
                <div //
                    tabIndex={-1}
                    tw={[
                        'input input-xs text-sm',
                        'flex items-center gap-1',
                        'p-0 h-full bg-transparent',
                        'select-none pointer-events-none overflow-clip',
                    ]}
                >
                    {s.isOpen || s.isFocused ? null : (
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
                <div tw='absolute top-0 left-0 right-0 z-50 h-full'>
                    {/* it's important for the input to be here so tabulation flow normally */}
                    {/* <div tw='btn btn-square btn-xs bg-transparent border-0'>
                        <span className='material-symbols-outlined'>search</span>
                    </div> */}
                    <input
                        //
                        ref={s.inputRef}
                        tw='input input-sm w-full h-full !outline-none'
                        type='text'
                        value={s.searchQuery}
                        onChange={() => {}}
                    />
                    <div tw='btn btn-square btn-xs ml-auto bg-transparent border-0'>
                        <span className='material-symbols-outlined'>arrow_drop_down</span>
                    </div>
                </div>
                {/* TOOLTIP */}
                {s.isOpen && <SelectPopupUI s={s} />}
            </div>
        </div>
    )
})

export const SelectPopupUI = observer(function SelectPopupUI_<T>(p: { s: AutoCompleteSelectState<T> }) {
    const s = p.s

    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button != 0) return
        s.isDragging = false
        window.removeEventListener('mouseup', isDraggingListener, true)
    }

    return createPortal(
        <div
            ref={s.popupRef}
            tw={[
                'MENU-ROOT _SelectPopupUI bg-base-100 flex',
                'rounded-b border-b border-l border-r border-base-300 overflow-auto',
            ]}
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
            // Prevent close when clicking the pop-up frame. There are also small gaps between the buttons where this becomes an issue.
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
        >
            <ul className='bg-base-100 max-h-96' tw='flex-col w-full'>
                {/* list of all values */}
                <li>
                    <div tw='overflow-hidden'>{s.displayValue}</div>
                </li>
                {/* No results */}
                {s.filteredOptions.length === 0 ? <li className='WIDGET-FIELD text-base'>No results</li> : null}

                {/* Entries */}
                {s.filteredOptions.map((option, index) => {
                    const isSelected =
                        s.values.find((v) => {
                            if (s.p.equalityCheck != null) return s.p.equalityCheck(v, option)
                            return v === option
                        }) != null
                    return (
                        <li // Fake gaps by padding <li> to make sure you can't click inbetween visual gaps
                            key={index}
                            style={{ minWidth: '10rem' }}
                            tw={['flex rounded py-0.5', 'h-auto']}
                            onMouseEnter={(ev) => {
                                s.setNavigationIndex(index)
                                if (!s.isDragging || isSelected == s.wasEnabled) return
                                s.onMenuEntryClick(ev, index)
                            }}
                            onMouseDown={(ev) => {
                                if (ev.button != 0) return
                                s.isDragging = true
                                s.wasEnabled = !isSelected
                                s.onMenuEntryClick(ev, index)
                                window.addEventListener('mouseup', isDraggingListener, true)
                            }}
                        >
                            <div
                                tw={[
                                    'WIDGET-FIELD pl-0.5 flex w-full items-center rounded',
                                    'active:bg-base-300 cursor-default text-shadow',
                                    index === s.selectedIndex ? 'bg-base-300' : null,
                                    /* index === s.selectedIndex && */
                                    // isSelected ? '!text-primary-content text-shadow' : 'bg-base-300',
                                    // !isSelected && 'active:bg-base-100',
                                    // isSelected && 'bg-primary text-primary-content hover:text-neutral-content text-shadow-inv active:bg-primary', // prettier-ignore
                                ]}
                            >
                                {/* {s.isMultiSelect ? <InputBoolUI active={isSelected} expand={false}></InputBoolUI> : <></>} */}
                                <InputBoolUI active={isSelected} expand={false}></InputBoolUI>
                                <div tw='pl-0.5 flex h-full w-full items-center'>
                                    {s.p.getLabelUI //
                                        ? s.p.getLabelUI(option)
                                        : s.p.getLabelText(option)}
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>,
        document.getElementById('tooltip-root')!,
    )
})
