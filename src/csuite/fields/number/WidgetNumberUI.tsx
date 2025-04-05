import type { Field_number } from './FieldNumber'

import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WidgetNumberUI = obs(function WidgetNumberUI_(p: {
   field: Field_number
   config?: Field_number['zConfig']
}) {
   const field = p.field
   const value = field.zValueOrZero
   const finalConfig = p.config ? { ...field.zConfig, ...p.config } : field.zConfig
   const mode = finalConfig.mode
   const step = finalConfig.step ?? (mode === 'int' ? 1 : 0.1)

   return (
      <InputNumberUI
         mode={mode === 'int' ? 'int' : 'float'}
         value={value}
         hideSlider={finalConfig.hideSlider}
         max={finalConfig.max}
         min={finalConfig.min}
         softMin={finalConfig.softMin}
         softMax={finalConfig.softMax}
         step={step}
         suffix={finalConfig.suffix}
         text={finalConfig.text}
         onValueChange={(next) => {
            field.zValue = next
         }}
         onBlur={() => field.zTouch()}
         forceSnap={finalConfig.forceSnap}
      />
   )
})
