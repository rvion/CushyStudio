import type { Widget_optional } from './WidgetOptional'
import type { Widget } from '../../Widget'

import { observer } from 'mobx-react-lite'
import { WidgetUI } from '../WidgetUI'

export const WidgetOptionalUI = observer(function WidgetBoolUI_<T extends Widget>(p: { widget: Widget_optional<T> }) {
    if (!p.widget.serial.active) return null
    if (p.widget.child == null) return <>❌ ERROR: optional is active but no widget❓</>
    return <WidgetUI widget={p.widget.child} />
})
