import type { Field } from '../model/Field'

export const WidgetDebugIDUI = obs(function WidgetDebugIDUI_(p: { field: Field }) {
   return <span tw='COLLAPSE-PASSTHROUGH text-sm italic opacity-50'>#{p.field.zUid.slice(0, 3)}</span>
})
