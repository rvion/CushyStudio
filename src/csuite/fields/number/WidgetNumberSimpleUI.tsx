import type { Field_number } from './FieldNumber'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../ctx/useCSuite'

export const WidgetNumberSimpleUI = observer(function WidgetNumberSimpleUI_(p: { field: Field_number }) {
   const field = p.field
   const value = field.value_or_zero
   const mode = field.config.mode
   const step = field.config.step ?? (mode === 'int' ? 1 : 0.1)
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
            field.value = parsed
         }}
         value={value}
         min={field.config.min}
         max={field.config.max}
         step={step}
      />
   )
})
