import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

export const WidgetDebugIDUI = observer(function WidgetDebugIDUI_(p: { field: Field }) {
    return <span tw='COLLAPSE-PASSTHROUGH opacity-50 italic text-sm'>#{p.field.id.slice(0, 3)}</span>
})
