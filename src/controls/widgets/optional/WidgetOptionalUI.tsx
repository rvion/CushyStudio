import type { Widget_optional } from './WidgetOptional'
import type { Spec } from 'src/controls/Prop'

import { observer } from 'mobx-react-lite'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetWithLabelUI } from 'src/controls/shared/WidgetWithLabelUI'

export const WidgetOptional_LineUI = observer(function WidgetBoolUI_<T extends Spec>(p: { widget: Widget_optional<T> }) {
    const WidgetUI = WidgetDI.WidgetUI
    if (!p.widget.serial.active) return null
    if (p.widget.child == null) return <>❌ ERROR: optional is active but no widget❓</>
    if (p.widget.child?.serial.collapsed) return <WidgetWithLabelUI rootKey={'_'} widget={p.widget.child} />
    const { WidgetLineUI } = WidgetUI(p.widget.child)
    if (WidgetLineUI == null) return null
    return <WidgetLineUI widget={p.widget.child} />
})

export const WidgetOptional_BlockUI = observer(function WidgetBoolUI_<T extends Spec>(p: { widget: Widget_optional<T> }) {
    const WidgetUI = WidgetDI.WidgetUI
    if (!p.widget.serial.active) return null
    if (p.widget.child == null) return <>❌ ERROR: optional is active but no widget❓</>
    if (p.widget.child?.serial.collapsed) return <WidgetWithLabelUI rootKey={'_'} widget={p.widget.child} />
    const { WidgetBlockUI } = WidgetUI(p.widget.child)
    if (WidgetBlockUI == null) return null
    return <WidgetBlockUI widget={p.widget.child} />
})
