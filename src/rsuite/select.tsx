import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { STATE } from 'src/state/state'
import { useSt } from 'src/state/stateContext'
import { searchMatches } from 'src/utils/misc/searchMatches'
import { RSSize } from './shims'

type PP<T> = {
    onChange: (next: T, self: AutoCompleteSelectState<T>) => void
    getLabelText: (t: T) => string
    getLabelUI?: (t: T) => React.ReactNode
    options?: T[]
    value?: () => Maybe<T | T[]>
    multiple?: boolean
    size?: RSSize
    disabled?: boolean
    cleanable?: boolean
}

class AutoCompleteSelectState<T> {
    constructor(
        //
        public st: STATE,
        public p: PP<T>,
    ) {
        makeAutoObservable(this)
    }
    onChange = this.p.onChange
    multiple = this.p.multiple ?? false
    get options() {
        return this.p.options ?? [] // replace with actual options logic
    }
    get filteredOptions() {
        if (this.searchQuery === '') return this.options
        return this.options.filter((p) => {
            const label = this.p.getLabelText(p)
            return searchMatches(label, this.searchQuery)
        })
    }
    searchQuery = ''

    get value() {
        return this.p.value?.()
    }
    get displayValue(): string {
        const sop = this.value
        if (sop == null) return 'Select...'
        if (Array.isArray(sop)) return sop.map(this.p.getLabelText).join(', ')
        return this.p.getLabelText(sop)
    }

    selectedIndex = 0
    showMenu = false

    filterOptions(inputValue: string) {
        this.searchQuery = inputValue
        this.showMenu = true
        // Logic to filter options based on input value
        // Update this.filteredOptions accordingly
    }

    selectOption(index: number) {
        const selectedOption = this.filteredOptions[index]
        if (selectedOption) {
            this.onChange(selectedOption, this)
            this.searchQuery = ''
            this.closeMenu()
        }
    }

    navigateSelection(direction: 'up' | 'down') {
        if (direction === 'up' && this.selectedIndex > 0) {
            this.selectedIndex--
        } else if (direction === 'down' && this.selectedIndex < this.filteredOptions.length - 1) {
            this.selectedIndex++
        }
    }

    closeMenu() {
        this.showMenu = false
        this.selectedIndex = -1
    }
}

export const AutoCompleteSelect = observer(function AutoCompleteSelect_<T>(p: PP<T>) {
    const st = useSt()
    const uiSt = useMemo(() => new AutoCompleteSelectState(st, p), [p])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        uiSt.filterOptions(event.target.value)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') uiSt.navigateSelection('down')
        else if (event.key === 'ArrowUp') uiSt.navigateSelection('up')
        else if (event.key === 'Enter') uiSt.selectOption(uiSt.selectedIndex)
    }

    return (
        <div tw='flex flex-1 items-center'>
            <div className='relative flex-1'>
                <input
                    tw='input input-sm input-bordered w-full'
                    onFocus={() => (uiSt.showMenu = true)}
                    value={uiSt.displayValue}
                ></input>
                {uiSt.showMenu && (
                    <div tw='absolute top-0 left-0 right-0 z-50'>
                        <input
                            onKeyUp={(ev) => {
                                if (ev.key === 'Escape') uiSt.closeMenu()
                            }}
                            onFocus={() => (uiSt.showMenu = true)}
                            autoFocus
                            tw='input input-sm w-full'
                            placeholder={uiSt.displayValue}
                            type='text'
                            value={uiSt.searchQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onBlur={uiSt.closeMenu}
                            className={'input input-bordered '} // Tailwind CSS classes
                        />
                        <ul className='absolute z-10 bg-base-100 shadow-md max-h-60 overflow-auto'>
                            {uiSt.filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className={`p-2 hover:bg-base-100 cursor-pointer ${
                                        index === uiSt.selectedIndex ? 'bg-base-300' : ''
                                    }`}
                                    onMouseDown={() => uiSt.selectOption(index)}
                                >
                                    {uiSt.p.getLabelUI //
                                        ? uiSt.p.getLabelUI(option)
                                        : uiSt.p.getLabelText(option)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
})
