import type { Widget_optional } from './WidgetOptional'
import type { Widget } from '../../Widget'

import { observer } from 'mobx-react-lite'
import { WidgetUI } from '../WidgetUI'
import { WidgetWithLabelUI } from 'src/controls/shared/WidgetWithLabelUI'

export const WidgetOptionalUI = observer(function WidgetBoolUI_<T extends Widget>(p: { widget: Widget_optional<T> }) {
    if (!p.widget.serial.active) return null
    if (p.widget.child == null) return <>❌ ERROR: optional is active but no widget❓</>
    if (p.widget.child?.serial.collapsed) return <WidgetWithLabelUI rootKey={'_'} widget={p.widget.child} />
    return <WidgetUI widget={p.widget.child} />
})
