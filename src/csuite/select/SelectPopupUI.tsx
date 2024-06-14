import type { BoolButtonMode } from '../checkbox/InputBoolUI'
import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'
import { createPortal } from 'react-dom'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'

import { InputBoolToggleButtonUI } from '../checkbox/InputBoolToggleButtonUI'
import { Frame } from '../frame/Frame'

export const SelectPopupUI = observer(function SelectPopupUI_<T>(p: {
    //
    s: AutoCompleteSelectState<T>
    /** @default true */
    showValues: boolean
}) {
    const s = p.s

    return createPortal(
        <Frame
            ref={s.popupRef}
            tw={[
                'MENU-ROOT _SelectPopupUI flex',
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
                if (s.isOpen) s.hasMouseEntered = true
            }}
        >
            <ul className='max-h-96' tw='flex-col w-full'>
                {(p.showValues ?? true) && (
                    <div // list of all values
                        tw={[
                            //
                            'overflow-au flex flex-wrap gap-0.5',
                            'max-w-sm',
                        ]}
                    >
                        {s.displayValue}
                    </div>
                )}

                {/* No results */}
                {s.filteredOptions.length === 0 ? <li className='h-input text-base'>No results</li> : null}

                {/* Entries */}
                <FixedSizeList<{ s: AutoCompleteSelectState<T> }>
                    // tw='flex-col w-full'
                    useIsScrolling={false}
                    height={400}
                    itemCount={s.filteredOptions.length}
                    itemSize={30}
                    width='100%'
                    children={SelectOptionUI}
                    itemData={{ s }}
                />
            </ul>
        </Frame>,
        document.getElementById('tooltip-root')!,
    )
})

export const SelectOptionUI = observer(function FooUI_<T>({
    data,
    index,
    style,
}: ListChildComponentProps<{ s: AutoCompleteSelectState<T> }>) {
    const s = data.s
    const option = s.filteredOptions[index]!
    const isSelected = s.values.find((v) => s.isEqual(v, option)) != null
    const mode: BoolButtonMode = s.isMultiSelect ? 'checkbox' : 'radio'
    return (
        <InputBoolToggleButtonUI
            style={style}
            expand
            mode={mode}
            preventDefault
            showToggleButtonBox
            hovered={s.selectedIndex === index}
            value={isSelected}
            onValueChange={(value) => {
                if (value != isSelected) s.selectOption(index)
            }}
        >
            <div tw='w-full'>
                {s.p.getLabelUI //
                    ? s.p.getLabelUI(option)
                    : s.p.getLabelText(option)}
            </div>
        </InputBoolToggleButtonUI>
    )
})

// <li // Fake gaps by padding <li> to make sure you can't click inbetween visual gaps
//     key={index}
//     style={{ minWidth: '10rem', ...style }}
//     tw={['flex py-0.5']}
//     onMouseEnter={(ev) => {
//         console.log(`[🤠] 🟢🔴`, ev)
//         s.setNavigationIndex(index)
//         if (!s.isDragging || isSelected == s.wasEnabled) return
//         s.onMenuEntryClick(ev, index)
//     }}
//     onMouseDown={(ev) => {
//         console.log(`[🤠] 🟢`, ev)
//         if (ev.button != 0) return
//         s.isDragging = true
//         s.wasEnabled = !isSelected
//         s.onMenuEntryClick(ev, index)
//         window.addEventListener('mouseup', isDraggingListener, true)
//     }}
// >
// tw={[
//     //
//     'h-input pl-0.5 flex w-full items-center rounded',
//     'active:cursor-default cursor-pointer',
// ]}
// hover
// hovered={s.selectedIndex === index}
// base={getBaseColor(isSelected)}
// active={index === s.selectedIndex}

//     {/* {s.isMultiSelect && <InputBoolCheckboxUI mode='checkbox' value={isSelected} expand={false} />}
//         <div tw='pl-0.5 flex truncate'>
//             {s.p.getLabelUI //
//                 ? s.p.getLabelUI(option)
//                 : s.p.getLabelText(option)}
//         </div> */}
// // </li>
