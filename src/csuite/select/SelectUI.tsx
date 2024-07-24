import type { SelectProps } from './SelectProps'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { Ikon } from '../icons/iconHelpers'
import { RevealUI } from '../reveal/RevealUI'
import { SelectPopupUI } from './SelectPopupUI'
import { AutoCompleteSelectState } from './SelectState'
import { SelectValueContainerUI } from './SelectValueContainerUI'

export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    const select = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])
    const csuite = useCSuite()
    const border = csuite.inputBorder
    return (
        <RevealUI //
            ref={select.revealStateRef}
            trigger='pseudofocus'
            shell='popover'
            placement='autoVerticalStart'
            onHidden={() => {
                select.revealState?.log(`🔶 revealUI - onHidden (focus anchor)`)
                // 🔴 should only focus anchor in certain cases?
                // (ex: escape while in popup should probably focus the anchor?)
                // (ex: clicking outside the popup should probably focus the anchor?)
                // (ex: tab should probably go to the next select, NOT focus this anchor?)
                // (ex: programmatically or whatever random reason closes the select, should NOT focus the anchor?)
                // ...but this can probably be improved in a future release
                select.anchorRef.current?.focus()
                select.clean()
            }}
            content={({ reveal }) => <SelectPopupUI reveal={reveal} selectState={select} />}
            sharedAnchorRef={select.anchorRef}
        >
            <Frame
                expand
                line
                hover
                tabIndex={0}
                tw={['UI-Select minh-input', 'relative', 'h-full']}
                border={{ contrast: border }}
                className={p.className}
                base={{ contrast: csuite.inputContrast ?? 0.05 }}
                onKeyDown={(ev) => {
                    // 🔶 note: the anchor gets all keyboard events even when input inside popup via portal is focused!
                    select.handleTooltipKeyDown(ev)
                    select.revealState?.onAnchorKeyDown(ev)
                }}
                onFocus={(ev) => {
                    select.revealState?.log(`🔶 revealUI - onFocus`)
                }}
                onBlur={(ev) => {
                    select.revealState?.log(`🔶 revealUI - onBlur`)
                }}
            >
                {WRAP_SHOULD_NOT_IMPACT_ICONS ? (
                    // IN THIS BRANCH, LAYOUT IS DONE VIA GRID
                    <div tw={['w-full', 'px-0.5', 'grid']} style={{ gridTemplateColumns: '24px 1fr 24px' }}>
                        {/* 2px for parent border + 2 * 2px for icon padding */}
                        <Ikon.mdiTextBoxSearchOutline tw='box-border m-[2px]' size='calc((var(--input-height) - 4px - 2px)' />
                        <SelectValueContainerUI wrap={select.p.wrap ?? true}>{select.displayValue}</SelectValueContainerUI>
                        <Ikon.mdiChevronDown tw='box-border m-[2px]' size='calc((var(--input-height) - 4px - 2px)' />
                    </div>
                ) : (
                    // IN THIS BRANCH, WE ADD FLEX-NONE
                    <>
                        <Ikon.mdiTextBoxSearchOutline
                            tw='box-border m-[2px] flex-none'
                            size='calc((var(--input-height) - 4px - 2px)'
                />
                        <SelectValueContainerUI wrap={select.p.wrap ?? true}>{select.displayValue}</SelectValueContainerUI>
                        <Ikon.mdiChevronDown
                            tw='flex-none box-border ml-auto m-[2px]'
                    size='calc((var(--input-height) - 4px - 4px)'
                />
                    </>
                )}
            </Frame>
        </RevealUI>
    )
})

const WRAP_SHOULD_NOT_IMPACT_ICONS = true

// HERE
// onMouseDown={s.onRootMouseDown}
// onBlur={(ev) => s.onBlur(ev)}
// onKeyUp={s.onRootKeyUp}
// onFocus={(ev) => {
//     console.log(`[🔴] SelectUI > onFocus`)
//     if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) {
//         s.openMenu()
//     }
// }}
