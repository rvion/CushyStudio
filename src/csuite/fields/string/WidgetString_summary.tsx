import type { Field_string } from './FieldString'

import { observer } from 'mobx-react-lite'

// Textarea HEADER

export const WidgetString_summary = observer(function WidgetString_TextareaHeaderUI_(p: { field: Field_string }) {
    const field = p.field
    if (!field.config.textarea) return null
    if (!p.field.serial.collapsed) return null
    return <div tw='line-clamp-1 italic opacity-50'>{JSON.stringify(p.field.value)}</div>
})
