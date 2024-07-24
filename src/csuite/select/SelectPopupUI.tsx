import type { RevealState } from '../reveal/RevealState'
import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'
import { FixedSizeList } from 'react-window'

import { SelectOptionUI, SelectOptionUI_FixedList } from './SelectOptionUI'

const trueMinWidth = '20rem'

export const SelectPopupUI = observer(function SelectPopupUI_<T>(p: {
    //
    reveal: RevealState
    s: AutoCompleteSelectState<T>
    /** @default true */
    showValues: boolean
}) {
    const s = p.s
    const minWidth =
        s.anchorRef.current?.clientWidth != null //
            ? `max(${s.anchorRef.current.clientWidth}px, ${trueMinWidth})`
            : trueMinWidth

    const itemSize = typeof s.p.virtualized === 'number' ? s.p.virtualized : 30
    return (
        <div style={{ minWidth }}>
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
                <FixedSizeList<{
                    s: AutoCompleteSelectState<T>
                    reveal: RevealState
                }>
                    useIsScrolling={false}
                    height={Math.min(
                        400,
                        itemSize /* temp hack to leave place for soon-to-be input */ * s.filteredOptions.length,
                    )}
                    itemCount={s.filteredOptions.length}
                    itemSize={itemSize}
                    width='100%'
                    children={SelectOptionUI_FixedList}
                    itemData={{ s, reveal: p.reveal }}
                />
            ) : (
                s.filteredOptions.map((option, index) => (
                    <SelectOptionUI<T> //
                        key={s.getKey(option)}
                        index={index}
                        reveal={p.reveal}
                        option={option}
                        state={s}
                    />
                ))
            )}
        </div>
    )
})
