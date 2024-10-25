import type { Field_string } from './FieldString'

import { observer } from 'mobx-react-lite'

import { InputStringUI } from '../../input-string/InputStringUI'

// string HEADER

export const WidgetString_SmallInput = observer(function WidgetStringUI_(p: {
   field: Field_string
   readonly?: boolean
}) {
   const field = p.field
   const config = field.config
   // prettier-ignore
   const placeholder =
        // 1. if placeholder is specified, use it
        config.placeHolder ??
        // 2. if label is specified, and is string, use it
        (typeof config.label == 'string' ? config.label : undefined) ??
        // 3. if none of the above, use mountKye
        field.mountKey

   return (
      <InputStringUI
         tw={['w-full', field.mustDisplayErrors && 'rsx-field-error']}
         icon={p.field.config.innerIcon}
         type={config.inputType}
         placeholder={placeholder}
         pattern={config.pattern}
         className={config.className}
         getValue={() => field.value_or_zero}
         setValue={(value) => {
            field.value = value
            field.touch()
         }}
         disabled={p.readonly}
         clearable={config.clearable}
         autoResize={config.autoResize}
         buffered={
            field.config.buffered
               ? {
                    getTemporaryValue: (): string | null => field.temporaryValue,
                    setTemporaryValue: (value): void => void (field.temporaryValue = value),
                 }
               : undefined
         }
         onBlur={() => field.touch()}
      />
   )
})
