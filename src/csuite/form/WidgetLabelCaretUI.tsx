import type { BaseField } from '../model/BaseField'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../csuite/icons/iconHelpers'

export const WidgetLabelCaretUI = observer(function WidgetLabelCaretUI_(p: { widget: BaseField }) {
    if (!p.widget.isCollapsed && !p.widget.isCollapsible) return null
    return <WidgetLabelCaretAlwaysUI isCollapsed={p.widget.isCollapsed} />
})

export const WidgetLabelCaretAlwaysUI = observer(function WidgetLabelCaretAlways_({ isCollapsed }: { isCollapsed: boolean }) {
    // 🔴 TODO: caret
    if (isCollapsed) return <Ikon.mdiChevronRight tw='COLLAPSE-PASSTHROUGH' />
    return <Ikon.mdiChevronDown tw='COLLAPSE-PASSTHROUGH' />
    // return (
    //     <div
    //         icon={isCollapsed ? 'mdiChevronRight' : 'mdiChevronDown'}
    //         tw={['WIDGET-COLLAPSE-BTN COLLAPSE-PASSTHROUGH', 'opacity-30 hover:opacity-100 cursor-pointer']}
    //     />
    // )
})
