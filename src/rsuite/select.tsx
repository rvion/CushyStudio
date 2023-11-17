import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { STATE } from 'src/state/state'
import { useSt } from 'src/state/stateContext'
import { searchMatches } from 'src/utils/misc/searchMatches'
import { Addon, Joined, RSSize } from './shims'

type OptionEntry = {
    asOptionLabel: string
}
type PP<T extends OptionEntry> = {
    onChange: (self: AutoCompleteSelectState<T>) => void
    options?: T[]
    multiple?: boolean
    size?: RSSize
    disabled?: boolean
    cleanable?: boolean
    value?: Maybe<T>
}

class AutoCompleteSelectState<T extends OptionEntry> {
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
        return this.options.filter((p) => searchMatches(p.asOptionLabel, this.inputValue))
    }
    inputValue = ''

    selectedOptions: T[] = []

    get selectedOption(): Maybe<T> {
        return this.selectedOptions[0] ?? null
    }

    selectedIndex = -1
    showMenu = false

    filterOptions(inputValue: string) {
        this.inputValue = inputValue
        this.showMenu = true
        // Logic to filter options based on input value
        // Update this.filteredOptions accordingly
    }

    selectOption(index: number) {
        const selectedOption = this.filteredOptions[index]
        if (selectedOption) {
            if (this.multiple) {
                this.selectedOptions.push(selectedOption)
                this.onChange(this) // Invoke the passed onChange prop
            } else {
                this.onChange(this) // Invoke the passed onChange prop
                this.selectedOptions = [selectedOption]
            }
            this.inputValue = ''
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

export const AutoCompleteSelect = observer(function AutoCompleteSelect_<T extends OptionEntry>(p: PP<T>) {
    const st = useSt()
    const uiSt = useMemo(() => new AutoCompleteSelectState(st, p), [p])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        uiSt.filterOptions(event.target.value)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            uiSt.navigateSelection('down')
        } else if (event.key === 'ArrowUp') {
            uiSt.navigateSelection('up')
        } else if (event.key === 'Enter') {
            uiSt.selectOption(uiSt.selectedIndex)
        }
    }

    const handleBlur = () => {
        uiSt.closeMenu()
    }

    return (
        <div className='relative'>
            <span className='material-symbols-outlined'>search</span>
            <input
                tw='input input-sm'
                placeholder={uiSt.selectedOption?.asOptionLabel ?? 'Select an option'}
                type='text'
                value={uiSt.inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className='input input-bordered' // Tailwind CSS classes
            />
            {uiSt.showMenu && (
                <ul className='absolute z-10 bg-white shadow-md max-h-60 overflow-auto'>
                    {uiSt.filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            className={`p-2 hover:bg-gray-200 cursor-pointer ${
                                index === uiSt.selectedIndex ? 'bg-gray-100' : ''
                            }`}
                            onMouseDown={() => uiSt.selectOption(index)}
                        >
                            {option.asOptionLabel}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
})
