import type { Field_string } from './FieldString'

export const WidgetString_summary = obs(function WidgetString_TextareaHeaderUI_(p: { field: Field_string }) {
   const field = p.field
   if (!field.ϟconfig.textarea) return null
   if (!p.field.ϟserial.collapsed) return null
   return <div tw='line-clamp-1 italic opacity-50'>{JSON.stringify(p.field.ϟvalue)}</div>
})
