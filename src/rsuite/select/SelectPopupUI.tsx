import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'
import { createPortal } from 'react-dom'

import { InputBoolCheckboxUI } from '../checkbox/InputBoolCheckboxUI'
import { Frame } from '../frame/Frame'

export const SelectPopupUI = observer(function SelectPopupUI_<T>(p: { s: AutoCompleteSelectState<T> }) {
    const s = p.s

    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button != 0) return
        s.isDragging = false
        window.removeEventListener('mouseup', isDraggingListener, true)
    }

    return createPortal(
        <Frame
            ref={s.popupRef}
            tw={[
                'MENU-ROOT _SelectPopupUI  flex',
                // 'border-l border-r border-base-300',
                'overflow-auto',
                s.tooltipPosition.bottom != null ? 'rounded-t border-t' : 'rounded-b border-b',
            ]}
            style={{
                minWidth: s.anchorRef.current?.clientWidth ?? '100%',
                maxWidth:
                    window.innerWidth - (s.tooltipPosition.left != null ? s.tooltipPosition.left : s.tooltipPosition.right ?? 0),
                pointerEvents: 'initial',
                position: 'absolute',
                zIndex: 99999999,
                top: s.tooltipPosition.top != null ? `${s.tooltipPosition.top}px` : 'unset',
                bottom: s.tooltipPosition.bottom != null ? `${s.tooltipPosition.bottom}px` : 'unset',
                left: s.tooltipPosition.left != null ? `${s.tooltipPosition.left}px` : 'unset',
                right: s.tooltipPosition.right != null ? `${s.tooltipPosition.right}px` : 'unset',
                maxHeight: `${s.tooltipMaxHeight}px`,
                // Adjust positioning as needed
            }}
            // Prevent close when clicking the pop-up frame. There are also small gaps between the buttons where this becomes an issue.
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
            onMouseEnter={(ev) => {
                if (s.isOpen) {
                    s.hasMouseEntered = true
                }
            }}
        >
            <ul className=' max-h-96' tw='flex-col w-full'>
                {/* list of all values */}
                <li>
                    <div tw='overflow-hidden'>{s.displayValue}</div>
                </li>
                {/* No results */}
                {s.filteredOptions.length === 0 ? <li className='WIDGET-FIELD text-base'>No results</li> : null}

                {/* Entries */}
                {s.filteredOptions.map((option, index) => {
                    const isSelected = s.values.find((v) => s.isEqual(v, option)) != null
                    return (
                        <li // Fake gaps by padding <li> to make sure you can't click inbetween visual gaps
                            key={index}
                            style={{ minWidth: '10rem' }}
                            tw={['flex rounded py-0.5', 'h-auto']}
                            onMouseEnter={(ev) => {
                                s.setNavigationIndex(index)
                                if (!s.isDragging || isSelected == s.wasEnabled) return
                                s.onMenuEntryClick(ev, index)
                            }}
                            onMouseDown={(ev) => {
                                if (ev.button != 0) return
                                s.isDragging = true
                                s.wasEnabled = !isSelected
                                s.onMenuEntryClick(ev, index)
                                window.addEventListener('mouseup', isDraggingListener, true)
                            }}
                        >
                            <Frame
                                base={{
                                    contrast: isSelected
                                        ? s.selectedIndex === index
                                            ? 0.75
                                            : 0.7
                                        : s.selectedIndex === index
                                          ? 0.05
                                          : 0,
                                }}
                                tw={[
                                    'WIDGET-FIELD pl-0.5 flex w-full items-center rounded',
                                    'active:cursor-default cursor-pointer',
                                    index === s.selectedIndex ? 'bg-base-300' : null,
                                ]}
                            >
                                {s.isMultiSelect && <InputBoolCheckboxUI mode={'checkbox'} value={isSelected} expand={false} />}
                                <div tw='pl-0.5 flex w-full h-full items-center truncate'>
                                    {s.p.getLabelUI //
                                        ? s.p.getLabelUI(option)
                                        : s.p.getLabelText(option)}
                                </div>
                            </Frame>
                        </li>
                    )
                })}
            </ul>
        </Frame>,
        document.getElementById('tooltip-root')!,
    )
})
