import type { RevealState } from '../reveal/RevealState'
import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'
import { FixedSizeList } from 'react-window'

import { InputStringUI } from '../input-string/InputStringUI'
import { SelectOptionUI, SelectOptionUI_FixedList } from './SelectOptionUI'

const trueMinWidth = '20rem'

export const SelectPopupUI = observer(function SelectPopupUI_<T>(p: {
    //
    reveal: RevealState
    selectState: AutoCompleteSelectState<T>
}) {
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
        <div style={{ minWidth }}>
            <InputStringUI
                autofocus
                icon='mdiSelectMarker'
                onFocus={(ev) => {
                    s.revealState?.log(`🔶 input - onFocus (no op)`)
                }}
                onBlur={(ev) => {
                    s.revealState?.log(`🔶 input - onBlur`)
                    // s.anchorRef.current?.focus()
                    // s.closeMenu()
                    // TODO: check if the newly focused element is not a child of the popup
                    // if it's a child of the popup, we should (possibly) refocus this instead
                    // or do nothing
                    // ⏸️ if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) {
                    // ⏸️     s.closeMenu()
                    // ⏸️ }
                }}
                onKeyDown={(ev) => {
                    if (ev.key === 'Tab') {
                        s.revealState?.log(`🔶 input - onKeyDown TAB (closes and focus anchor)`)
                        s.closeMenu()
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
            />

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
