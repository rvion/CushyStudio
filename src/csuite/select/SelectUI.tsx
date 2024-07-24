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
    const s = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])
    const csuite = useCSuite()
    const border = csuite.inputBorder
    return (
        <RevealUI //
            ref={s.revealStateRef}
            trigger='pseudofocus'
            shell='popover'
            placement='autoVerticalStart'
            onHidden={() => {
                s.revealState?.log(`🔶 revealUI - onHidden (focus anchor)`)
                // 🔴 should only focus anchor in certain cases?
                // (ex: escape while in popup should probably focus the anchor?)
                // (ex: clicking outside the popup should probably focus the anchor?)
                // (ex: tab should probably go to the next select, NOT focus this anchor?)
                // (ex: programmatically or whatever random reason closes the select, should NOT focus the anchor?)
                // ...but this can probably be improved in a future release
                s.anchorRef.current?.focus()
                s.clean()
            }}
            content={({ reveal }) => <SelectPopupUI reveal={reveal} s={s} />}
            sharedAnchorRef={s.anchorRef}
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
                    s.handleTooltipKeyDown(ev)
                    s.revealState?.onAnchorKeyDown(ev)
                }}
                onFocus={(ev) => {
                    s.revealState?.log(`🔶 revealUI - onFocus`)
                }}
                onBlur={(ev) => {
                    s.revealState?.log(`🔶 revealUI - onBlur`)
                }}

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
            >
                <Ikon.mdiTextBoxSearchOutline //
                    tw='box-border ml-[5px] mr-[2px]'
                    size='calc((var(--input-height) - 4px - 4px)' // 2px for parent border + 2 * 2px for icon padding
                />

                <SelectValueContainerUI // list of currently selected values
                    wrap={s.p.wrap}
                >
                    {s.displayValue}
                </SelectValueContainerUI>

                <Ikon.mdiChevronDown // 'v' caret to indicate this is a select
                    tw='box-border ml-auto m-[2px]'
                    size='calc((var(--input-height) - 4px - 4px)'
                />
            </Frame>
        </RevealUI>
    )
})

/*
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
<div // ANCHOR
        tabIndex={-1}
        tw={['text-sm', 'flex gap-1', 'p-0 h-full bg-transparent', 'select-none overflow-clip']}
    >
    <div tw={['w-full', 'px-0.5', 'grid']} style={{ gridTemplateColumns: '24px 1fr 24px' }}>
        <Ikon.mdiTextBoxSearchOutline //
            tw='box-border m-[2px]' // 2px for parent border + 2 * 2px for icon padding
            size='calc((var(--input-height) - 4px - 2px)'
        />
        <div
            tw={[
                'flex gap-0.5 flex-grow items-center lh-input-2 ',
                p.wrap //
                    ? 'flex-wrap'
                    : 'overflow-hidden line-clamp-1 text-ellipsis whitespace-nowrap',
            ]}
        >
            {s.displayValue}
        </div>
        <Ikon.mdiChevronDown //
            tw='box-border m-[2px]'
            size='calc((var(--input-height) - 4px - 2px)'
        />
    </div>
</div>
 */
