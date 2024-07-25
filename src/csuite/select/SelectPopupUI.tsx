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
    const s = p.selectState

    // 'clientWidth:', s.anchorRef.current?.clientWidth, 466 => ❌ do not take border into account
    // 'scrollWidth:', s.anchorRef.current?.scrollWidth, 466 => ❌ do not take border into account
    // 'offsetWidth:', s.anchorRef.current?.offsetWidth, 468 => 🟢 take border into acount
    const minWidth =
        s.anchorRef.current?.clientWidth != null //
            ? `max(${s.anchorRef.current.offsetWidth}px, ${trueMinWidth})`
            : trueMinWidth

    const itemSize = typeof s.p.virtualized === 'number' ? s.p.virtualized : 30
    return (
        <Frame col style={{ minWidth }} {...p.selectState.p.popupWrapperProps}>
            {s.p.slotTextInputUI != null ? (
                <s.p.slotTextInputUI
                    select={s}
                    // TODO: better props passing...
                    // ref={s.inputRef_real}
                />
            ) : (
                <InputStringUI
                    autofocus
                    icon='mdiSelectMarker'
                    onFocus={(ev) => {
                        s.revealState?.log(`🔶 input - onFocus (no op)`)
                    }}
                    onBlur={(ev) => {
                        s.revealState?.log(`🔶 input - onBlur`)
                    }}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Tab') {
                            s.revealState?.log(`🔶 input - onKeyDown TAB (closes and focus anchor)`)
                            const reason = ev.shiftKey ? 'shiftTabKey' : 'tabKey'
                            s.closeMenu(reason)
                            // 🔶 should probably focus the next select instead?
                            // anyway, already handled via onHidden
                            // s.anchorRef.current?.focus()
                            ev.stopPropagation()
                            ev.preventDefault()
                            return
                        }

                        // s.handleTooltipKeyDown(ev) // 🔶 already caught by the anchor!
                    }}
                    placeholder={s.p.placeholder ?? 'Search...'}
                    ref={s.inputRef_real}
                    type='text'
                    getValue={() => s.searchQuery}
                    setValue={(next) => s.filterOptions(next)}
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
            {s.filteredOptions.length === 0 //
                ? s.p.slotPlaceholderWhenNoResults ?? <li className='h-input text-base'>No results</li>
                : null}

            {s.p.slotResultsListUI != null ? (
                <s.p.slotResultsListUI select={s} />
            ) : s.p.virtualized !== false ? (
                <FixedSizeList<{
                    s: AutoCompleteSelectState<OPTION>
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
                <Frame col tw='max-h-96'>
                    {s.filteredOptions.map((option, index) =>
                        s.p.slotOptionUI != null ? (
                            <s.p.slotOptionUI //
                                key={s.getKey(option)}
                                index={index}
                                option={option}
                                state={s}
                                reveal={p.reveal}
                            />
                        ) : (
                            <SelectOptionUI<OPTION> //
                                key={s.getKey(option)}
                                index={index}
                                reveal={p.reveal}
                                option={option}
                                state={s}
                            />
                        ),
                    )}
                </Frame>
            )}
        </Frame>
    )
})
