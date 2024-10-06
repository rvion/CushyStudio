import type { RevealState } from '../reveal/RevealState'
import type { SelectProps } from './SelectProps'
import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'
import { FixedSizeList } from 'react-window'

import { Frame } from '../frame/Frame'
import { InputStringUI } from '../input-string/InputStringUI'
import { SelectOptionUI, SelectOptionUI_FixedList } from './SelectOptionUI'

const trueMinWidth = '20rem'

export type SelectPopupProps<OPTION> = {
    reveal: RevealState
    selectState: AutoCompleteSelectState<OPTION>
    createOption?: Pick<SelectProps<OPTION>, 'createOption'>
}

export const SelectPopupUI = observer(function SelectPopupUI_<OPTION>(p: SelectPopupProps<OPTION>) {
    const select = p.selectState
    const minWidth =
        select.anchorRef.current?.clientWidth != null //
            ? `max(${select.anchorRef.current.offsetWidth /* take into account border width */}px, ${trueMinWidth})`
            : trueMinWidth

    const itemSize = typeof select.p.virtualized === 'number' ? select.p.virtualized : 28 // should probably match input height or cell height
    return (
        <div
            tw={[
                //
                'flex flex-col',
                'max-w-xl',
                'overflow-hidden',
            ]}
            {...p.selectState.p.popupWrapperProps}
            style={{ minWidth, ...p.selectState.p.popupWrapperProps?.style }}
        >
            <div
                tw={[
                    //
                    'minh-input p-input', // padding shoud simulate the difference between input size and inside size
                    'flex flex-wrap items-start gap-0.5 rounded-t-md',
                    'border-b border-gray-200',
                    'bg-gray-100',
                ]}
            >
                {p.selectState.displayValueInPopup}

                {select.p.slotTextInputUI != null ? (
                    <select.p.slotTextInputUI select={select} />
                ) : (
                    <InputStringUI
                        noColorStuff
                        autoFocus
                        onKeyDown={(ev) => {
                            if (ev.key === 'Backspace' && select.searchQuery === '' && select.lastValue != null) {
                                select.toggleOption(select.lastValue)
                                ev.stopPropagation()
                                ev.preventDefault()
                                return
                            }

                            // s.handleTooltipKeyDown(ev) // 🔶 already caught by the anchor!
                        }}
                        placeholder={select.firstValue == null ? 'Rechercher une valeur...' : undefined} // 🚂 we need a second placeholder prop
                        ref={select.inputRef_real}
                        type='text'
                        getValue={() => select.searchQuery}
                        setValue={(next) => select.filterOptions(next)}
                        tw={[
                            //
                            'absolute top-0 left-0 right-0 z-50 h-inside',
                            'min-w-24 flex-1',
                            // 'bg-gray-200 !rounded-none',
                        ]}
                        // TODO: better props passing...
                        {...p.selectState.p.textInputProps}
                    />
                )}
            </div>

            {/* No results */}
            {select.filteredOptions.length === 0 //
                ? // select.p.slotPlaceholderWhenNoResults ?? <span className='h-input text-base px-2'>Aucun résultat</span>
                  (select.p.slotPlaceholderWhenNoResults ?? <li className='h-input text-base'>No results</li>)
                : null}

            {select.p.slotResultsListUI != null ? (
                <select.p.slotResultsListUI select={select} />
            ) : select.p.virtualized !== false ? (
                select.filteredOptions.length !== 0 && (
                    <FixedSizeList<{ s: AutoCompleteSelectState<OPTION>; reveal: RevealState }>
                        className='mt-2 mb-1'
                        useIsScrolling={false}
                        /* temp hack to leave place for soon-to-be input */
                        height={Math.min(400, itemSize * select.filteredOptions.length)}
                        itemCount={select.filteredOptions.length}
                        itemSize={itemSize}
                        width='100%'
                        children={SelectOptionUI_FixedList}
                        itemData={{ s: select, reveal: p.reveal }}
                    />
                )
            ) : (
                <Frame col tw='max-h-96 pt-2 pb-1'>
                    {select.filteredOptions.map((option, index) =>
                        select.p.slotOptionUI != null ? (
                            <select.p.slotOptionUI //
                                key={select.getKey(option)}
                                index={index}
                                option={option}
                                state={select}
                                reveal={p.reveal}
                            />
                        ) : (
                            <SelectOptionUI<OPTION> //
                                key={select.getKey(option)}
                                index={index}
                                reveal={p.reveal}
                                option={option}
                                state={select}
                            />
                        ),
                    )}
                </Frame>
            )}
        </div>
    )
})
