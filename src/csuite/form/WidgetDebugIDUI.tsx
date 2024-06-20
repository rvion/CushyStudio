import type { BaseField } from '../model/BaseField'

import { observer } from 'mobx-react-lite'

export const WidgetDebugIDUI = observer(function WidgetDebugIDUI_(p: { widget: BaseField }) {
    return <span tw='COLLAPSE-PASSTHROUGH opacity-50 italic text-sm'>#{p.widget.id.slice(0, 3)}</span>
})
