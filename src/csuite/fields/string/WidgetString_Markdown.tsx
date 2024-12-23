import type { Field_string } from './FieldString'

import { observer } from 'mobx-react-lite'

import { MarkdownUI } from '../../markdown/MarkdownUI'

export const WidgetString_MarkdownUI = observer(function WidgetString_MarkdownUI_(p: {
   field: Field_string
   readonly?: boolean
}) {
   const field = p.field
   const config = field.config

   // 💬 2024-11-30 rvion: do we want to keep the placeholder ❓
   // prettier-ignore
   const placeholder =
        // 1. if placeholder is specified, use it
        config.placeHolder ??
        // 2. if label is specified, and is string, use it
        (typeof config.label == 'string' ? config.label : undefined) ??
        // 3. if none of the above, use mountKye
        field.mountKey

   // return '🟢'
   return <MarkdownUI markdown={field.value ?? placeholder} />
})
