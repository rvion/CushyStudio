import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { Widget_string } from './WidgetString'

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

    const [inputValue, setInputValue] = useState<string>(val.toString())
    const [isEditing, setEditing] = useState<boolean>(false)
    return (
        <>
            <div
                tw={[
                    'WIDGET-FIELD',
                    'h-full w-full',
                    'flex flex-1 items-center relative',
                    'rounded overflow-clip text-shadow',
                    'border border-base-100 hover:border-base-200',
                    'hover:brightness-110',
                    'bg-primary/5',
                    'border-b-2 border-b-base-200 hover:border-b-base-300',
                ]}
                onMouseDown={(ev) => {
                    if (ev.button == 1) {
                        let textInput = ev.currentTarget.querySelector('input[type="text"') as HTMLInputElement
                        textInput.focus()
                    }
                }}
            >
                <input
                    tw='input input-sm w-full h-full !outline-none text-shadow'
                    type={widget.config.inputType}
                    placeholder={widget.config.placeHolder}
                    value={isEditing ? inputValue : val}
                    onChange={(ev) => {
                        setInputValue(ev.target.value)
                    }}
                    onDragStart={(ev) => {
                        /* Prevents drag n drop of selected text, so selecting is easier. */
                        ev.preventDefault()
                    }}
                    onFocus={(ev) => {
                        setEditing(true)
                        let textInput = ev.currentTarget

                        textInput.select()
                        startValue = val
                        setInputValue(val.toString())
                    }}
                    onBlur={(ev) => {
                        setEditing(false)
                        const next = ev.currentTarget.value

                        if (cancelled) {
                            cancelled = false
                            p.widget.value = startValue
                            return
                        }

                        p.widget.value = inputValue
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
