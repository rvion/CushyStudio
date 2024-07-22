import type { Field_string } from './FieldString'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputStringUI } from '../../input-string/InputStringUI'

// Textarea HEADER
export const WidgetString_TextareaHeaderUI = observer(function WidgetString_TextareaHeaderUI_(p: { field: Field_string }) {
    const field = p.field
    if (!field.config.textarea) return null
    if (!p.field.serial.collapsed) return null
    return <div tw='line-clamp-1 italic opacity-50'>{JSON.stringify(p.field.value)}</div>
})

// Textarea BODY
export const WidgetString_TextareaBodyUI = observer(function WidgetString_TextareaBodyUI_(p: { field: Field_string }) {
    const field = p.field
    if (!field.config.textarea) return null
    const val = field.value
    const csuite = useCSuite()

    return (
        <Frame base={{ contrast: csuite.inputContrast ?? 0.05 }} expand>
            <textarea
                style={{
                    /* ...p.widget.config.style, */
                    lineHeight: '1.3rem',
                    resize: p.field.config.resize ?? 'both',
                }}
                tw='csuite-input w-full p-2 !bg-transparent'
                placeholder={field.config.placeHolder}
                rows={3}
                value={val}
                onChange={(ev) => {
                    field.value = ev.target.value
                }}
            />
        </Frame>
    )
})

// string HEADER
export const WidgetString_HeaderUI = observer(function WidgetStringUI_(p: { field: Field_string }) {
    const field = p.field
    const config = field.config
    return (
        <InputStringUI
            icon={p.field.config.innerIcon}
            type={config.inputType}
            pattern={config.pattern}
            className={config.className}
            getValue={() => field.value}
            setValue={(value) => (field.value = value)}
            buffered={
                field.config.buffered
                    ? {
                          getTemporaryValue: (): string | null => field.temporaryValue,
                          setTemporaryValue: (value): void => void (field.temporaryValue = value),
                      }
                    : undefined
            }
        />
    )
})
