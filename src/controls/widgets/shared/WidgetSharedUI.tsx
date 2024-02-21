import type { Schema } from 'src/controls/Prop'
import type { Widget } from '../../Widget'
import { WidgetUI } from '../WidgetUI'
import type { Widget_shared } from './WidgetShared'

import { observer } from 'mobx-react-lite'

export const WidgetShared_LineUI = observer(function WidgetBoolUI_<T extends Schema>(p: { widget: Widget_shared<T> }) {
    // if (p.widget.shared.serial.collapsed) return <WidgetWithLabelUI rootKey={p.widget.config.rootKey} widget={p.widget.shared} />
    const { WidgetLineUI } = WidgetUI(p.widget.shared)
    if (WidgetLineUI == null) return null
    return <WidgetLineUI widget={p.widget.shared} />
})

export const WidgetShared_BlockUI = observer(function WidgetBoolUI_<T extends Schema>(p: { widget: Widget_shared<T> }) {
    // if (p.widget.shared.serial.collapsed) return <WidgetWithLabelUI rootKey={p.widget.config.rootKey} widget={p.widget.shared} />
    const { WidgetBlockUI } = WidgetUI(p.widget.shared)
    if (WidgetBlockUI == null) return null
    return <WidgetBlockUI widget={p.widget.shared} />
})
