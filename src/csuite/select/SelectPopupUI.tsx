import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'
import { FixedSizeList } from 'react-window'

import { SelectOptionUI, SelectOptionUI_FixedList } from './SelectOptionUI'

export const SelectPopupUI = observer(function SelectPopupUI_<T>(p: {
    //
    s: AutoCompleteSelectState<T>
    /** @default true */
    showValues: boolean
}) {
    const s = p.s
    return (
        <>
            {(p.showValues ?? true) && (
                <div // list of all currently selected values
                    tw={['overflow-auto flex flex-wrap gap-0.5']} // 'max-w-sm',
                >
                    {s.displayValue}
                </div>
            )}

            {/* No results */}
            {s.filteredOptions.length === 0 //
                ? s.p.slotPlaceholderWhenNoResults ?? <li className='h-input text-base'>No results</li>
                : null}

            {s.p.virtualized !== false ? (
                <FixedSizeList<{ s: AutoCompleteSelectState<T> }>
                    useIsScrolling={false}
                    height={400}
                    itemCount={s.filteredOptions.length}
                    itemSize={typeof s.p.virtualized === 'number' ? s.p.virtualized : 30}
                    width='100%'
                    children={SelectOptionUI_FixedList}
                    itemData={{ s }}
                />
            ) : (
                s.filteredOptions.map((option, index) => (
                    <SelectOptionUI<T> //
                        key={s.getKey(option)}
                        index={index}
                        option={option}
                        state={s}
                    />
                ))
            )}
        </>
    )
})
