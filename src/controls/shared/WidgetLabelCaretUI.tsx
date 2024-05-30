import type { BaseWidget } from '../BaseWidget'

import { observer } from 'mobx-react-lite'

export const WidgetLabelCaretUI = observer(function WidgetLabelCaretUI_(p: { widget: BaseWidget }) {
    if (!p.widget.isCollapsed && !p.widget.isCollapsible) return null
    return <WidgetLabelCaretAlwaysUI isCollapsed={p.widget.isCollapsed} />
})

export const WidgetLabelCaretAlwaysUI = observer(function WidgetLabelCaretAlways_({ isCollapsed }: { isCollapsed: boolean }) {
    return (
        <span
            tw={[
                'WIDGET-COLLAPSE-BTN COLLAPSE-PASSTHROUGH',
                'material-symbols-outlined',
                'opacity-30 hover:opacity-100 cursor-pointer',
            ]}
        >
            {isCollapsed ? 'chevron_right' : 'expand_more'}
        </span>
    )
})
