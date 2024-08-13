import type { RevealState } from '../reveal/RevealState'
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
}

export const SelectPopupUI = observer(function SelectPopupUI_<OPTION>(p: SelectPopupProps<OPTION>) {
    const select = p.selectState
    const minWidth =
        select.anchorRef.current?.clientWidth != null //
            ? `max(${select.anchorRef.current.offsetWidth /* take into account border width */}px, ${trueMinWidth})`
            : trueMinWidth

    const itemSize = typeof select.p.virtualized === 'number' ? select.p.virtualized : 30
    return (
        <Frame col style={{ minWidth }} {...p.selectState.p.popupWrapperProps}>
            {select.p.slotTextInputUI != null ? (
                <select.p.slotTextInputUI select={select} />
            ) : (
                <InputStringUI
                    autoFocus
                    icon='mdiMagnify'
                    onKeyDown={(ev) => {
                        if (ev.key === 'Tab') {
                            select.revealState?.log(`🔶 input - onKeyDown TAB (closes and focus anchor)`)
                            const reason = ev.shiftKey ? 'shiftTabKey' : 'tabKey'
                            select.closeMenu(reason)
                            // 🔶 should probably focus the next select instead?
                            // anyway, already handled via onHidden
                            // s.anchorRef.current?.focus()
                            ev.stopPropagation()
                            ev.preventDefault()
                            return
                        }

                        // s.handleTooltipKeyDown(ev) // 🔶 already caught by the anchor!
                    }}
                    placeholder={select.p.placeholder ?? 'Search...'}
                    ref={select.inputRef_real}
                    type='text'
                    getValue={() => select.searchQuery}
                    setValue={(next) => select.filterOptions(next)}
                    tw={[
                        //
                        'absolute top-0 left-0 right-0 z-50 h-full',
                        'csuite-basic-input',
                        'w-full h-full',
                    ]}
                    // TODO: better props passing...
                    {...p.selectState.p.textInputProps}
                />
            )}

            {/* No results */}
            {select.filteredOptions.length === 0 //
                ? select.p.slotPlaceholderWhenNoResults ?? <li className='h-input text-base'>No results</li>
                : null}

            {select.p.slotResultsListUI != null ? (
                <select.p.slotResultsListUI select={select} />
            ) : select.p.virtualized !== false ? (
                <FixedSizeList<{
                    s: AutoCompleteSelectState<OPTION>
                    reveal: RevealState
                }>
                    useIsScrolling={false}
                    height={Math.min(
                        400,
                        itemSize /* temp hack to leave place for soon-to-be input */ * select.filteredOptions.length,
                    )}
                    itemCount={select.filteredOptions.length}
                    itemSize={itemSize}
                    width='100%'
                    children={SelectOptionUI_FixedList}
                    itemData={{ s: select, reveal: p.reveal }}
                />
            ) : (
                <Frame col tw='max-h-96'>
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
        </Frame>
    )
})
