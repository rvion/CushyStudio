import type { Field_string } from './FieldString'

import { observer } from 'mobx-react-lite'

import { WidgetString_SmallInput } from './WidgetString_SmallInput'
import { WidgetString_summary } from './WidgetString_summary'
import { WidgetString_TextareaInput } from './WidgetString_TextareaInput'

export const WidgetStringUI = observer(function WidgetString(p: { field: Field_string }) {
   const field = p.field
   if (field.config.textarea) {
      return field.isCollapsed ? ( //
         <WidgetString_summary field={field} />
      ) : (
         <WidgetString_TextareaInput field={field} />
      )
   } else {
      return <WidgetString_SmallInput field={field} />
   }
})
