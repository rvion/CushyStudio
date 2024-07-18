import type { SelectProps } from './SelectProps'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { Ikon } from '../icons/iconHelpers'
import { SelectPopupUI } from './SelectPopupUI'
import { AutoCompleteSelectState } from './SelectState'

export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    // const st = useSt()
    const s = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])
    const csuite = useCSuite()
    const border = csuite.inputBorder
    return (
        <Frame /* Container/Root */
            tabIndex={-1}
            tw={['SelectUI minh-input', 'flex flex-1 items-center relative']}
            border={{ contrast: border }}
            className={p.className}
            ref={s.anchorRef}
            onKeyUp={s.onRealInputKeyUp}
            onMouseDown={s.onRealWidgetMouseDown}
            onKeyDown={s.handleTooltipKeyDown}
            onFocus={(ev) => {
                s.isFocused = true
                if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) {
                    s.openMenu()
                }
            }}
            onBlur={(ev) => s.onBlur(ev)}
        >
            <Frame
                //
                base={{ contrast: csuite.inputContrast ?? 0.05 }}
                hover
                className='flex-1 h-full '
            >
                <div // ANCHOR
                    tabIndex={-1}
                    tw={[
                        //
                        'text-sm',
                        'flex gap-1',
                        'p-0 h-full bg-transparent',
                        'select-none overflow-clip',
                    ]}
                >
                    {false && (s.isOpen || s.isFocused) ? null : (
                        /* Using grid here to make sure that inner text will truncate instead of pushing the right-most icon out of the container. */
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
                    )}
                </div>

                {/* MODAL */}
                <div tw='absolute top-0 left-0 right-0 z-50 h-full'>
                    <input
                        placeholder={s.isOpen ? p.placeholder : undefined}
                        ref={s.inputRef}
                        onChange={s.handleInputChange}
                        style={{ opacity: s.isOpen ? 1 : 0 }}
                        tw={['csuite-basic-input', 'w-full h-full !outline-none']}
                        type='text'
                        value={s.searchQuery}
                    />
                </div>
            </Frame>
            {/* TOOLTIP */}
            {(s.isOpen || false) && <SelectPopupUI showValues={!p.wrap} s={s} />}
        </Frame>
    )
})
