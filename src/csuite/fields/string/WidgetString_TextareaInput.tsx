import type { Field_string } from './FieldString'

import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'

export const WidgetString_TextareaInput = obs(function WidgetString_TextareaBodyUI_(p: {
   field: Field_string
   readonly?: boolean
}) {
   const field = p.field
   if (p.readonly) return <pre>{field.zValue_or_zero}</pre>

   const theme = cushy.preferences.theme.zValue
   return (
      <Frame base={theme.global.contrast} expand>
         {/* <pre>{JSON.stringify(Object.keys(p))}</pre> */}
         <textarea
            style={{
               /* ...p.widget.config.style, */
               lineHeight: '1.3rem',
               resize: p.field.zConfig.resize ?? 'both',
            }}
            tw='csuite-input w-full !bg-transparent p-2'
            placeholder={field.zConfig.placeHolder}
            rows={3}
            value={field.zValue_or_zero}
            onChange={(ev) => {
               field.zValue = ev.target.value
            }}
            onBlur={() => field.zTouch()}
         />
      </Frame>
   )
})
