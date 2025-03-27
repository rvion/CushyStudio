import type { Field_string } from './FieldString'

import { InputStringUI } from '../../input-string/InputStringUI'

export const WidgetString_SmallInput = obs(function WidgetStringUI_(p: {
   field: Field_string
   readonly?: boolean
}) {
   const field = p.field
   const config = field.zConfig

   // prettier-ignore
   const placeholder =
        // 1. if placeholder is specified, use it
        config.placeHolder ??
        // 2. if label is specified, and is string, use it
        (typeof config.label == 'string' ? config.label : undefined) ??
        // 3. if none of the above, use mountKye
        field.zMountKey

   // return '🟢'
   return (
      <InputStringUI
         tw={['w-full', field.zMustDisplayErrors && 'rsx-field-error']}
         icon={p.field.zConfig.innerIcon}
         type={config.inputType}
         placeholder={placeholder}
         pattern={config.pattern}
         className={config.className}
         getValue={() => field.zValue_or_zero}
         setValue={(value) => {
            field.zValue = value
         }}
         disabled={p.readonly ?? p.field.zConfig.readonly}
         // clearable={config.clearable}
         autoResize={config.autoResize}
         buffered={
            field.zConfig.buffered
               ? {
                    getTemporaryValue: (): string | null => field.temporaryValue,
                    setTemporaryValue: (value): void => void (field.temporaryValue = value),
                 }
               : undefined
         }
         onBlur={() => field.zTouch()}
      />
   )
})
