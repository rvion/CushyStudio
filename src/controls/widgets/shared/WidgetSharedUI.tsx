import type { Widget_shared } from './WidgetShared'
import type { Spec } from 'src/controls/Prop'

import { observer } from 'mobx-react-lite'

import { WidgetDI } from '../WidgetUI.DI'

export const WidgetShared_LineUI = observer(function WidgetBoolUI_<T extends Spec>(p: { widget: Widget_shared<T> }) {
    // if (p.widget.shared.serial.collapsed) return <WidgetWithLabelUI rootKey={p.widget.config.rootKey} widget={p.widget.shared} />
    const WidgetUI = WidgetDI.WidgetUI
    const { WidgetLineUI } = WidgetUI(p.widget.shared)
    if (WidgetLineUI == null) return null
    return <WidgetLineUI widget={p.widget.shared} />
})

export const WidgetShared_BlockUI = observer(function WidgetBoolUI_<T extends Spec>(p: { widget: Widget_shared<T> }) {
    // if (p.widget.shared.serial.collapsed) return <WidgetWithLabelUI rootKey={p.widget.config.rootKey} widget={p.widget.shared} />
    const WidgetUI = WidgetDI.WidgetUI
    const { WidgetBlockUI } = WidgetUI(p.widget.shared)
    if (WidgetBlockUI == null) return null
    return <WidgetBlockUI widget={p.widget.shared} />
})
