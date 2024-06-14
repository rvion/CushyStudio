import type { BaseWidget } from '../BaseWidget'

import { observer } from 'mobx-react-lite'

export const WidgetDebugIDUI = observer(function WidgetDebugIDUI_(p: { widget: BaseWidget }) {
    return <span tw='COLLAPSE-PASSTHROUGH opacity-50 italic text-sm'>#{p.widget.id.slice(0, 3)}</span>
})
