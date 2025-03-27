import type { Field_string } from './FieldString'

import { InputStringUI } from '../../input-string/InputStringUI'

export const WidgetString_SmallInput = obs(function WidgetStringUI_(p: {
   field: Field_string
   readonly?: boolean
}) {
   const field = p.field
   const config = field.ϟconfig

   // prettier-ignore
   const placeholder =
        // 1. if placeholder is specified, use it
        config.placeHolder ??
        // 2. if label is specified, and is string, use it
        (typeof config.label == 'string' ? config.label : undefined) ??
        // 3. if none of the above, use mountKye
        field.ϟmountKey

   // return '🟢'
   return (
      <InputStringUI
         tw={['w-full', field.ϟmustDisplayErrors && 'rsx-field-error']}
         icon={p.field.ϟconfig.innerIcon}
         type={config.inputType}
         placeholder={placeholder}
         pattern={config.pattern}
         className={config.className}
         getValue={() => field.ϟvalue_or_zero}
         setValue={(value) => {
            field.ϟvalue = value
         }}
         disabled={p.readonly ?? p.field.ϟconfig.readonly}
         // clearable={config.clearable}
         autoResize={config.autoResize}
         buffered={
            field.ϟconfig.buffered
               ? {
                    getTemporaryValue: (): string | null => field.temporaryValue,
                    setTemporaryValue: (value): void => void (field.temporaryValue = value),
                 }
               : undefined
         }
         onBlur={() => field.ϟtouch()}
      />
   )
})
