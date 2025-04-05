import type { Field_number } from './FieldNumber'

import { useCSuite } from '../../ctx/useCSuite'

export const WidgetNumberSimpleUI = obs(function WidgetNumberSimpleUI_(p: {
   //
   field: Field_number
   config?: Field_number['zConfig']
}) {
   const field = p.field
   const finalConfig = p.config ? { ...field.zConfig, ...p.config } : field.zConfig
   const value = field.zValueOrZero
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
            field.zValue = parsed
         }}
         value={value}
         min={finalConfig.min}
         max={finalConfig.max}
         step={step}
      />
   )
})
