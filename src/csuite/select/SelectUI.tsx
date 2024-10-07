import type { SelectProps } from './SelectProps'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { Button } from '../button/Button'
import { useCSuite } from '../ctx/useCSuite'
import { Row } from '../frame/Dov/Dov'
import { Ikon } from '../icons/iconHelpers'
import { RevealUI } from '../reveal/RevealUI'
import { SelectPopupUI } from './SelectPopupUI'
import { SelectShellUI } from './SelectShellUI'
import { AutoCompleteSelectState } from './SelectState'
import { SelectValueContainerUI } from './SelectValueContainerUI'
import { Frame } from '../frame/Frame'

// TODO fork this component
export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    const select = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])
    const csuite = useCSuite()
    const PopupComp = p.slotPopupUI ?? SelectPopupUI
    const AnchorContentComp = p.slotAnchorContentUI ?? AnchorContentUI

    // if (p.readonly) return <AnchorContentComp select={select} />
    if (p.readonly)
        return (
            <Frame
                hover
                expand
                tabIndex={0}
                tw={[
                    //
                    'UI-Select minh-input',
                    'ANCHOR-REVEAL',
                    p.hasErrors && 'border-red-700 border',
                ]}
            >
                <AnchorContentComp select={select} />
            </Frame>
        )

    return (
        <Row>
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
                <Frame
                    tw={[
                        //
                        'overflow-clip',
                        'UI-Select minh-input',
                        'relative',
                        'h-full',
                        'flex items-center flex-grow',
                    ]}
                    align
                    base={csuite.inputContrast}
                    border={csuite.inputBorder}
                    roundness={csuite.inputRoundness}
                    dropShadow={cushy.theme.value.inputShadow}
                    expand
                    tabIndex={0}
                    tooltip={p.tooltip}
                    // line
                    // hover
                >
                    <AnchorContentComp select={select} />
                    {p.clearable && (
                        <Button
                            square
                            icon='_clear'
                            onFocus={(ev) => ev.stopPropagation()}
                            onClick={(ev) => {
                                ev.preventDefault()
                                ev.stopPropagation()
                                p.clearable!()
                            }}
                        />
                    )}
                </Frame>
            </RevealUI>
            {p.createOption != null && p.createOption.isActive !== false && (
                <Button subtle size='inside' onClick={() => select.createOption()}>
                    {p.createOption.label ?? 'Créer'}
                </Button>
            )}
        </Row>
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
        <Frame hover tw={['h-input flex', 'flex-grow', 'grid pl-1.5']} line style={{ gridTemplateColumns: '1fr 24px' }}>
            {/* 2px for parent border + 2 * 2px for icon padding */}
            {/* <Ikon.mdiTextBoxSearchOutline tw='box-border m-[2px]' size='calc((var(--input-height) - 4px - 2px)' /> */}
            <SelectValueContainerUI wrap={p.select.p.wrap ?? true}>{displayValue}</SelectValueContainerUI>
            <Ikon.mdiChevronDown size={1} />
        </Frame>
    ) : (
        // IN THIS BRANCH, WE ADD FLEX-NONE
        <>
            {/* <Ikon.mdiTextBoxSearchOutline tw='box-border m-[2px] flex-none' size='calc((var(--input-height) - 4px - 2px)' /> */}
            <SelectValueContainerUI wrap={p.select.p.wrap ?? true}>{displayValue}</SelectValueContainerUI>
            <Ikon.mdiChevronDown size={1} />
        </>
    )
})
