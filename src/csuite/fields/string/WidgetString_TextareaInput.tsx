import type { Field_string } from './FieldString'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'

// Textarea BODY

export const WidgetString_TextareaInput = observer(function WidgetString_TextareaBodyUI_(p: {
   field: Field_string
   readonly?: boolean
}) {
   const field = p.field
   const csuite = useCSuite()
   if (p.readonly) return <pre>{field.value_or_zero}</pre>
   return (
      <Frame base={csuite.inputContrast} expand>
         {/* <pre>{JSON.stringify(Object.keys(p))}</pre> */}
         <textarea
            style={{
               /* ...p.widget.config.style, */
               lineHeight: '1.3rem',
               resize: p.field.config.resize ?? 'both',
            }}
            tw='csuite-input w-full !bg-transparent p-2'
            placeholder={field.config.placeHolder}
            rows={3}
            value={field.value_or_zero}
            onChange={(ev) => {
               field.value = ev.target.value
            }}
            onBlur={() => field.touch()}
         />
      </Frame>
   )
})
