import type { Field_number } from './FieldNumber'

import { useCSuite } from '../../ctx/useCSuite'

export const WidgetNumberSimpleUI = obs(function WidgetNumberSimpleUI_(p: {
   //
   field: Field_number
   config?: Field_number['ϟconfig']
}) {
   const field = p.field
   const finalConfig = p.config ? { ...field.ϟconfig, ...p.config } : field.ϟconfig
   const value = field.ϟvalue_or_zero
   const mode = finalConfig.mode
   const step = finalConfig.step ?? (mode === 'int' ? 1 : 0.1)
   // const contrast = useCSuite().inputContrast
   return (
      <input
         style={{ backgroundColor: 'oklch(from var(--KLR) calc(l + 0.1 * var(--DIR)) c h)' }}
         tw='w-full'
         type='number'
         onChange={(e) => {
            const raw = e.target.value
            const parsed = mode === 'int' ? parseInt(raw, 10) : parseFloat(raw)
            if (isNaN(parsed)) return
            field.ϟvalue = parsed
         }}
         value={value}
         min={finalConfig.min}
         max={finalConfig.max}
         step={step}
      />
   )
})
