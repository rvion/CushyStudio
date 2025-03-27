import type { Field } from '../../../csuite/model/Field'

export const WidgetDebugIDUI = obs(function WidgetDebugIDUI_(p: { field: Field }) {
   return <span tw='COLLAPSE-PASSTHROUGH text-sm italic opacity-50'>#{p.field.ϟuid.slice(0, 3)}</span>
})
