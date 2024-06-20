import type { Widget_string } from './WidgetString'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../frame/Frame'
import { InputStringUI } from '../../input-string/InputStringUI'

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
        <Frame base={5}>
            <textarea
                style={{
                    /* ...p.widget.config.style, */
                    lineHeight: '1.3rem',
                    resize: p.widget.config.resize ?? 'both',
                }}
                tw='cushy-basic-input w-full p-2'
                placeholder={widget.config.placeHolder}
                rows={3}
                value={val}
                onChange={(ev) => {
                    widget.value = ev.target.value
                }}
            />
        </Frame>
    )
})

// string HEADER
export const WidgetString_HeaderUI = observer(function WidgetStringUI_(p: { widget: Widget_string }) {
    const widget = p.widget
    const config = widget.config
    return (
        <InputStringUI
            icon={p.widget.config.innerIcon}
            type={config.inputType}
            pattern={config.pattern}
            className={config.className}
            getValue={() => widget.value}
            setValue={(value) => (widget.value = value)}
            buffered={
                widget.config.buffered
                    ? {
                          getTemporaryValue: () => widget.temporaryValue,
                          setTemporaryValue: (value) => (widget.temporaryValue = value),
                      }
                    : undefined
            }
        />
    )
})
