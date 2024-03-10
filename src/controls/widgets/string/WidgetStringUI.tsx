import { observer } from 'mobx-react-lite'
import { ReactElement, useState } from 'react'

import { Widget_string } from './WidgetString'
import { ClassLike } from 'src/utils/custom-jsx/global'

let startValue = ''
let cancelled = false

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
    return (
        <textarea
            style={{ lineHeight: '1.3rem' }}
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

    switch (widget.config.inputType) {
        case 'color':
            inputTailwind = 'absolute w-full h-full opacity-0'
            visualHelper = <div tw='w-full h-full' style={{ background: val }} />
            highlight = false
            break
        default:
            inputTailwind = 'input input-sm w-full h-full !outline-none text-shadow'
            break
    }

    // console.log('[WidgetString] - val: ', val)

    return (
        <>
            <div
                tw={[
                    'WIDGET-FIELD',
                    'h-full w-full',
                    'flex flex-1 items-center relative',
                    'rounded overflow-clip text-shadow',
                    'border border-base-100 hover:border-base-300',
                    highlight && 'hover:brightness-110',
                    'bg-primary/5',
                    'border-b-2 border-b-base-200 hover:border-b-base-300',
                    'p-0 m-0',
                ]}
                onMouseDown={(ev) => {
                    if (ev.button == 1) {
                        let textInput = ev.currentTarget.querySelector('input[type="text"') as HTMLInputElement
                        textInput.focus()
                    }
                }}
            >
                {visualHelper && visualHelper}
                <input
                    tw={inputTailwind}
                    type={widget.config.inputType}
                    placeholder={widget.config.placeHolder}
                    value={val}
                    onChange={(ev) => {
                        p.widget.value = ev.currentTarget.value
                    }}
                    /* Prevents drag n drop of selected text, so selecting is easier. */
                    onDragStart={(ev) => {
                        ev.preventDefault()
                    }}
                    onFocus={(ev) => {
                        let textInput = ev.currentTarget

                        textInput.select()
                        startValue = val
                    }}
                    onBlur={(ev) => {
                        if (cancelled) {
                            cancelled = false
                            p.widget.value = startValue
                            return
                        }

                        p.widget.value = ev.currentTarget.value
                    }}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.currentTarget.blur()
                        } else if (ev.key === 'Escape') {
                            cancelled = true
                            ev.currentTarget.blur()
                        }
                    }}
                />
            </div>
            <div
                tw={[widget.isChanged ? undefined : 'btn-disabled opacity-50']}
                onClick={() => widget.reset()}
                className='btn btn-xs btn-narrower btn-ghost'
            >
                <span className='material-symbols-outlined'>undo</span>
            </div>
        </>
    )
})
