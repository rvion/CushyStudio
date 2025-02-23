import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

export const WidgetDebugIDUI = observer(function WidgetDebugIDUI_(p: { field: Field }) {
   return <span tw='COLLAPSE-PASSTHROUGH text-sm italic opacity-50'>#{p.field._uid.slice(0, 3)}</span>
})
