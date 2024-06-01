import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import { Ikon } from '../../icons/iconHelpers'
import { Frame } from '../frame/Frame'
import { SelectPopupUI } from './SelectPopupUI'
import { AutoCompleteSelectState } from './SelectState'

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
}
export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    // const st = useSt()
    const s = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])
    return (
        <Frame /* Container/Root */
            base={{ contrast: 0.05 }}
            hover
            tabIndex={-1}
            tw={['WIDGET-FIELD ', 'flex flex-1 items-center relative']}
            border
            className={p.className}
            ref={s.anchorRef}
            onKeyUp={s.onRealInputKeyUp}
            onMouseDown={s.onRealWidgetMouseDown}
            onKeyDown={s.handleTooltipKeyDown}
            onFocus={(ev) => {
                s.isFocused = true
                if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) {
                    s.openMenu()
                }
            }}
            onBlur={s.onBlur}
        >
            <div className='flex-1 h-full '>
                <div // ANCHOR
                    tabIndex={-1}
                    tw={[
                        'text-sm',
                        'flex items-center gap-1',
                        'p-0 h-full bg-transparent',
                        'select-none pointer-events-none overflow-clip',
                    ]}
                >
                    {s.isOpen || s.isFocused ? null : (
                        /* Using grid here to make sure that inner text will truncate instead of pushing the right-most icon out of the container. */
                        <div
                            tw={[
                                //
                                ' h-full w-full items-center',
                                'px-0.5',
                                'grid',
                            ]}
                            style={{ gridTemplateColumns: '24px 1fr 24px' }}
                        >
                            <Ikon.mdiTextBoxSearchOutline size={'18px'} />
                            <div tw='overflow-hidden line-clamp-1 text-ellipsis flex-grow'>{s.displayValue}</div>
                            <Ikon.mdiChevronDown size={'18px'} />
                        </div>
                        // <div tw='grid w-full items-center' style={{ gridTemplateColumns: '24px 1fr 24px' }}>
                        //     <div tw='btn btn-square btn-xs ml-auto bg-transparent border-0'>
                        //         <span className='suffix material-symbols-outlined ml-auto'>arrow_drop_down</span>
                        //     </div>
                        // </div>
                    )}
                </div>

                <div tw='absolute top-0 left-0 right-0 z-50 h-full'>
                    {/* it's important for the input to be here so tabulation flow normally */}
                    {/* <div tw='btn btn-square btn-xs bg-transparent border-0'>
                        <span className='material-symbols-outlined'>search</span>
                    </div> */}
                    <input
                        //
                        placeholder={s.isOpen ? p.placeholder : undefined}
                        ref={s.inputRef}
                        onChange={s.handleInputChange}
                        tw='w-full h-full !outline-none bg-transparent'
                        type='text'
                        value={s.searchQuery}
                        // onChange={() => {}}
                    />
                    {/* <div tw='btn btn-square btn-xs ml-auto bg-transparent border-0'>
                        <span className='material-symbols-outlined'>arrow_drop_down</span>
                    </div> */}
                </div>
                {/* TOOLTIP */}
                {s.isOpen && <SelectPopupUI s={s} />}
            </div>
        </Frame>
    )
})
