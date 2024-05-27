import type { Widget_string } from './WidgetString'

import { observer } from 'mobx-react-lite'
import { ReactElement } from 'react'

import { Ikon } from '../../../icons/iconHelpers'
import { Button } from '../../../rsuite/button/Button'
import { Frame } from '../../../rsuite/button/Frame'
import { useColor } from '../../../theme/colorEngine/useColor'

type ClassLike = string | { [cls: string]: any } | null | undefined | boolean

// Textarea HEADER
export const WidgetString_TextareaHeaderUI = observer(function WidgetString_TextareaHeaderUI_(p: { widget: Widget_string }) {
    const widget = p.widget
    if (!widget.config.textarea) return null
    if (!p.widget.serial.collapsed) return null
    return <div tw='line-clamp-1 italic opacity-50'>{p.widget.value}</div>
})

// Textarea BODY
export const WidgetString_TextareaBodyUI = observer(function WidgetString_TextareaBodyUI_(p: { widget: Widget_string }) {
    const widget = p.widget
    if (!widget.config.textarea) return null
    const val = widget.value
    const kolor = useColor({ base: 5 })
    return (
        <textarea
            style={{
                ...kolor.styles,
                /* ...p.widget.config.style, */ lineHeight: '1.3rem',
                resize: p.widget.config.resize ?? 'both',
            }}
            tw='textarea textarea-bordered textarea-sm w-full '
            placeholder={widget.config.placeHolder}
            rows={3}
            value={val}
            onChange={(ev) => {
                widget.value = ev.target.value
            }}
        />
    )
})

// string HEADER
export const WidgetString_HeaderUI = observer(function WidgetStringUI_(p: { widget: Widget_string }) {
    const widget = p.widget
    const val = widget.value

    let inputTailwind: string | ClassLike[] | undefined
    let visualHelper: ReactElement<any, any> | undefined
    let highlight = true

    const color = useColor({
        base: 5,
        text: { contrast: 1, /* hueShift: 150, chromaBlend: 899 */ chromaBlend: 1 },
        border: true,
    })

    switch (widget.config.inputType) {
        case 'color':
            inputTailwind = 'absolute w-full h-full !bg-transparent'
            visualHelper = <Frame tw='w-full h-full' style={{ background: val }} />
            highlight = false
            break
        default:
            inputTailwind = 'w-full h-full !outline-none bg-transparent'
            break
    }

    /* I think we should handle some of these widgets by ourselves so we have better control over
     *  the actual widget, instead of relying on the browser's <input>. */
    // if (widget.config.inputType && widget.config.inputType === 'color') {
    //     return <Frame active tw='WIDGET-FIELD w-full h-full' style={{ background: val }}></Frame>
    // }

    return (
        <div
            style={color.styles}
            tw={[
                // color.className,
                'WIDGET-FIELD',
                'h-full w-full',
                'flex flex-1 items-center relative',
                'rounded overflow-clip text-sm',
                // 'border border-base-100 hover:border-base-300',
                // 'bg-primary/5',
                // highlight && 'hover:brightness-110',
                // 'border-b-2 border-b-base-200 hover:border-b-base-300',
                'p-0 m-0 px-1',
            ]}
            onMouseDown={(ev) => {
                if (ev.button == 1) {
                    const textInput = ev.currentTarget.querySelector('input[type="text"') as HTMLInputElement
                    textInput.focus()
                }
            }}
        >
            {visualHelper}
            <input
                tw={inputTailwind}
                type={widget.config.inputType}
                pattern={widget.config.pattern}
                placeholder={widget.config.placeHolder}
                value={
                    widget.config.buffered //
                        ? widget.temporaryValue ?? val
                        : val
                }
                onChange={(ev) => {
                    if (widget.config.buffered) {
                        widget.setTemporaryValue(ev.target.value)
                    } else {
                        widget.value = ev.currentTarget.value
                    }
                }}
                /* Prevents drag n drop of selected text, so selecting is easier. */
                onDragStart={(ev) => ev.preventDefault()}
                onFocus={(ev) => {
                    widget.setTemporaryValue(widget.value ?? '')
                    ev.currentTarget.select()
                }}
                onBlur={() => {
                    if (widget.config.buffered && widget.temporaryValue != null) {
                        widget.value = widget.temporaryValue
                    }
                }}
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                        ev.currentTarget.blur()
                    } else if (ev.key === 'Escape') {
                        if (!widget.config.buffered && widget.temporaryValue) widget.value = widget.temporaryValue
                        widget.setTemporaryValue(null)
                        ev.currentTarget.blur()
                    }
                }}
            />
        </div>
    )
    // <>
    //     <Button icon='mdiUndoVariant' disabled={!widget.isChanged} onClick={() => widget.reset()}></Button>
    // </>
})
// 1-a 2-a
// 1-b 2-a

// behaviours
// 1. updateValueOn:
//      - a keystroke
//      - b enter
// 2. onEscape or tab or click away:
//      - a revert to last committed value
//      - b do nothing
