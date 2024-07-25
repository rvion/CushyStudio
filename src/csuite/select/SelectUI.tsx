import type { RevealState } from '../reveal/RevealState'
import type { SelectProps } from './SelectProps'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { Ikon } from '../icons/iconHelpers'
import { RevealUI } from '../reveal/RevealUI'
import { type SelectPopupProps, SelectPopupUI } from './SelectPopupUI'
import { AutoCompleteSelectState } from './SelectState'
import { SelectValueContainerUI } from './SelectValueContainerUI'

function focusNextElement(dir: 'next' | 'prev'): void {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const elements = Array.from(document.querySelectorAll(focusableElements)) as HTMLElement[]

    const currentFocusIndex = elements.indexOf(document.activeElement as HTMLElement)
    const nextIndex = (currentFocusIndex + (dir === 'next' ? 1 : -1)) % elements.length

    elements[nextIndex]?.focus()
}

export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    const select = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])
    const csuite = useCSuite()
    const border = csuite.inputBorder
    const PopupComp = p.slotPopupUI ?? SelectPopupUI
    const AnchorContentComp = p.slotAnchorContentUI ?? AnchorContentUI
    return (
        <RevealUI //
            ref={select.revealStateRef}
            trigger='pseudofocus'
            shell='popover'
            placement='autoVerticalStart'
            onHidden={(reason) => {
                select.revealState?.log(`🔶 revealUI - onHidden (focus anchor)`)
                select.clean()

                // 🔶 should only focus anchor in certain cases?
                // (ex: escape while in popup should probably focus the anchor?)
                // (ex: clicking outside the popup should probably focus the anchor?)
                // (ex: programmatically or whatever random reason closes the select, should NOT focus the anchor?)
                // (ex: tab should probably go to the next select, NOT focus this anchor?)
                if (reason === 'programmatic' || reason === 'cascade') return
                select.anchorRef.current?.focus()
                if (reason === 'tabKey') focusNextElement('next')
                if (reason === 'shiftTabKey') focusNextElement('prev')

                p.onHidden?.(reason)
            }}
            content={({ reveal }) => <PopupComp reveal={reveal} selectState={select} />}
            {...p.revealProps}
            sharedAnchorRef={select.anchorRef}
        >
            <Frame
                expand
                line
                hover
                tabIndex={0}
                tw={['UI-Select minh-input', 'relative', 'h-full']}
                style={p.style}
                border={{ contrast: border }}
                className={p.className}
                base={{ contrast: csuite.inputContrast ?? 0.05 }}
                onKeyDown={(ev) => {
                    // 2024-07-24 @domi: 🔶 note: the anchor gets all keyboard events even when input inside popup via portal is focused!
                    // 2024-07-25 @rvion: it surprises me; I would have really expected the anchor to NOT get the events
                    select.handleTooltipKeyDown(ev)
                    select.revealState?.onAnchorKeyDown(ev)
                    p.onAnchorKeyDown?.(ev)
                }}
                onFocus={(ev) => {
                    select.revealState?.log(`🔶 revealUI - onFocus`)
                    p.onAnchorFocus?.(ev)
                }}
                onBlur={(ev) => {
                    select.revealState?.log(`🔶 revealUI - onBlur`)
                    p.onAnchorBlur?.(ev)
                }}
                {...p.anchorProps}
            >
                <AnchorContentComp select={select} />
            </Frame>
        </RevealUI>
    )
})

const WRAP_SHOULD_NOT_IMPACT_ICONS = true
export const AnchorContentUI = observer(function AnchorContentUI_<OPTION>(p: { select: AutoCompleteSelectState<OPTION> }) {
    const displayValue =
        p.select.p.slotDisplayValueUI != null ? <p.select.p.slotDisplayValueUI select={p.select} /> : p.select.displayValue
    return WRAP_SHOULD_NOT_IMPACT_ICONS ? (
        // IN THIS BRANCH, LAYOUT IS DONE VIA GRID
        <div tw={['w-full', 'px-0.5', 'grid']} style={{ gridTemplateColumns: '24px 1fr 24px' }}>
            {/* 2px for parent border + 2 * 2px for icon padding */}
            <Ikon.mdiTextBoxSearchOutline tw='box-border m-[2px]' size='calc((var(--input-height) - 4px - 2px)' />
            <SelectValueContainerUI wrap={p.select.p.wrap ?? true}>{displayValue}</SelectValueContainerUI>
            <Ikon.mdiChevronDown tw='box-border m-[2px]' size='calc((var(--input-height) - 4px - 2px)' />
        </div>
    ) : (
        // IN THIS BRANCH, WE ADD FLEX-NONE
        <>
            <Ikon.mdiTextBoxSearchOutline tw='box-border m-[2px] flex-none' size='calc((var(--input-height) - 4px - 2px)' />
            <SelectValueContainerUI wrap={p.select.p.wrap ?? true}>{displayValue}</SelectValueContainerUI>
            <Ikon.mdiChevronDown tw='flex-none box-border ml-auto m-[2px]' size='calc((var(--input-height) - 4px - 4px)' />
        </>
    )
})

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
