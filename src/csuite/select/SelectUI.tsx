import type { SelectProps } from './SelectProps'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { Ikon } from '../icons/iconHelpers'
import { RevealUI } from '../reveal/RevealUI'
import { SelectPopupUI } from './SelectPopupUI'
import { AutoCompleteSelectState } from './SelectState'

export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
    const s = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])
    const csuite = useCSuite()
    const border = csuite.inputBorder
    return (
        <Frame /* Container/Root */
            tabIndex={0}
            tw={['SelectUI minh-input', 'flex flex-1 items-center relative']}
            border={{ contrast: border }}
            className={p.className}
            ref={s.anchorRef}
            onKeyUp={s.onRealInputKeyUp}
            onMouseDown={s.onRealWidgetMouseDown}
            onKeyDown={s.handleTooltipKeyDown}
            onFocus={(ev) => {
                s.isFocused = true // TODO remove
                if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) {
                    s.openMenu()
                }
            }}
            // onBlur={(ev) => s.onBlur(ev)}
        >
            {/* {(s.isOpen) && <SelectPopupUI showValues={!p.wrap} s={s} />} */}
            <RevealUI //
                ref={s.revealStateRef}
                trigger='click'
                shell='popover'
                placement='autoVerticalStart'
                // defaultVisible
                content={({ reveal }) => (
                    <SelectPopupUI //
                        reveal={reveal}
                        showValues={!s.p.wrap}
                        s={s}
                    />
                )}
            >
                <Frame
                    //
                    tabIndex={1}
                    base={{ contrast: csuite.inputContrast ?? 0.05 }}
                    hover
                    className='flex-1 h-full '
                >
                    {s.displayValue}

                    {/* <div // ANCHOR
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
                    </div> */}

                    {/* <input // INPUT
                        ref={s.inputRef_fake}
                        // onFocusCapture={(ev) => {
                        //     // const prevFocusWasOn = ev.relatedTarget
                        // }}
                        // placeholder={s.isOpen ? p.placeholder : undefined}
                        // onChange={s.handleInputChange}
                        tw={[
                            //
                            'opacity-0',
                            'absolute top-0 left-0 right-0 z-50 h-full',
                            'csuite-basic-input',
                            'w-full h-full !outline-none',
                        ]}
                        type='text'
                        value={s.searchQuery}
                    /> */}
                </Frame>
            </RevealUI>
        </Frame>
    )
})
