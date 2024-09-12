import type { SelectProps } from './SelectProps'

import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'

import { Button } from '../button/Button'
import { useCSuite } from '../ctx/useCSuite'
import { Row } from '../frame/Dov/Dov'
import { Ikon, IkonOf } from '../icons/iconHelpers'
import { RevealUI } from '../reveal/RevealUI'
import { SelectPopupUI } from './SelectPopupUI'
import { SelectShellUI } from './SelectShellUI'
import { AutoCompleteSelectState } from './SelectState'
import { SelectValueContainerUI } from './SelectValueContainerUI'

export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    const select = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])

    if (false /* falesisDevServer 🔴 */) {
        useEffect(() => {
            // is it too much updates?
            // better than useMemo depending on the props which
            // re-creates AutoCompleteSelectState with every render
            // could target specific props more precisely?
            // but not sure if it would be better or worse?
            // console.log('❌🔶 USE EFFECT props')
            // should we use useState instead of useMemo? https://mobx.js.org/react-integration.html#using-external-state-in-observer-components
            // probably ask @rvion
            if (p !== select.p) select.p = p
        }, [p])
    }

    const csuite = useCSuite()
    const PopupComp = p.slotPopupUI ?? SelectPopupUI
    const AnchorContentComp = p.slotAnchorContentUI ?? AnchorContentUI

    if (p.readonly) return <AnchorContentComp select={select} />

    return (
        <RevealUI //
            ref={select.revealStateRef}
            trigger='pseudofocus'
            // shell='popover'
            shell={SelectShellUI}
            // placement={p.placement ?? 'autoVerticalStart'}
            placement='cover'
            content={({ reveal }) => <PopupComp reveal={reveal} selectState={select} />}
            // 🔶 be careful to not override stuff with that (goes both ways)
            {...p.revealProps}
            onHidden={(reason) => {
                select.revealState?.log(`🔶 revealUI - onHidden (focus anchor)`)
                select.clean()

                p.revealProps?.onHidden?.(reason)
            }}
            sharedAnchorRef={select.anchorRef}
            anchorProps={{
                ...p.revealProps?.anchorProps,
                onKeyDown: (ev) => {
                    // 🔶 note: the anchor gets all keyboard events even when input inside popup via portal is focused!
                    select.handleTooltipKeyDown(ev)
                    p.revealProps?.anchorProps?.onKeyDown?.(ev)
                },
            }}
        >
            <Row
                expand
                tabIndex={0}
                tw={['UI-Select minh-input', 'relative', 'h-full', 'ANCHOR-REVEAL']}
                // style={p.style}
                hoverable

                // 🉑 tw={['UI-Select minh-input', 'relative', /*  'h-full', */ 'ANCHOR-REVEAL']}
                // 🉑 line
                // 🉑 icon={p.startIcon}
                // 🉑 style={p.style}
                // 🉑 hover={3}
                // 🉑 base={csuite.inputContrast}
                // 🉑 border={csuite.inputBorder}
                // 🉑 className={p.className} // will be overwritten by reveal anchorProps, need fix

                // 🧚‍♀️ onFocus={(ev) => {
                // 🧚‍♀️     select.revealState?.log(`🔶 revealUI - onFocus`)
                // 🧚‍♀️     p.onAnchorFocus?.(ev)
                // 🧚‍♀️ }}
                // 🧚‍♀️ onBlur={(ev) => {
                // 🧚‍♀️     select.revealState?.log(`🔶 revealUI - onBlur`)
                // 🧚‍♀️     p.onAnchorBlur?.(ev)
                // 🧚‍♀️ }}
            >
                <AnchorContentComp select={select} />
                {p.clearable && (
                    <Button
                        subtle
                        borderless
                        size='inside'
                        icon='_clear'
                        onFocus={(ev) => ev.stopPropagation()}
                        onClick={(ev) => {
                            ev.preventDefault()
                            ev.stopPropagation()
                            p.clearable!()
                        }}
                    />
                )}
            </Row>
        </RevealUI>
    )
})

const WRAP_SHOULD_NOT_IMPACT_ICONS = true
export const AnchorContentUI = observer(function AnchorContentUI_<OPTION>(p: { select: AutoCompleteSelectState<OPTION> }) {
    if (p.select.p.slotDisplayValueUI != null) return <p.select.p.slotDisplayValueUI select={p.select} />
    const displayValue = p.select.displayValueInAnchor

    const csuite = useCSuite()
    if (!csuite.showSelectIcons)
        return (
            <div tw={['w-full', 'grid', 'p-input']} style={{ gridTemplateColumns: '1fr' }}>
                <SelectValueContainerUI wrap={p.select.p.wrap ?? true}>{displayValue}</SelectValueContainerUI>
            </div>
        )

    return WRAP_SHOULD_NOT_IMPACT_ICONS ? (
        // IN THIS BRANCH, LAYOUT IS DONE VIA GRID
        <div tw={['w-full', 'px-0.5', 'grid']} style={{ gridTemplateColumns: '1fr 24px' }}>
            {/* 2px for parent border + 2 * 2px for icon padding */}
            {/* <Ikon.mdiTextBoxSearchOutline tw='box-border m-[2px]' size='calc((var(--input-height) - 4px - 2px)' /> */}
            <SelectValueContainerUI wrap={p.select.p.wrap ?? true}>{displayValue}</SelectValueContainerUI>
            <Ikon.mdiChevronDown tw='box-border m-[2px]' size='calc((var(--input-height) - 4px - 2px)' />
        </div>
    ) : (
        // IN THIS BRANCH, WE ADD FLEX-NONE
        <>
            {/* <Ikon.mdiTextBoxSearchOutline tw='box-border m-[2px] flex-none' size='calc((var(--input-height) - 4px - 2px)' /> */}
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
