import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../csuite/icons/iconHelpers'

export const WidgetLabelCaretUI = observer(function WidgetLabelCaretUI_(p: {
    //
    className?: string
    widget: Field
}) {
    if (!p.widget.isCollapsed && !p.widget.isCollapsible)
        return (
            <Ikon._
                //
                className={p.className}
                tw='COLLAPSE-PASSTHROUGH shrink-0'
            />
        )
    return (
        <WidgetLabelCaretAlwaysUI //
            className={p.className}
            isCollapsed={p.widget.isCollapsed}
        />
    )
})

export const WidgetLabelCaretAlwaysUI = observer(function WidgetLabelCaretAlways_({
    isCollapsed,
    className,
}: {
    className?: string
    isCollapsed: boolean
}) {
    // 🔴 TODO: caret
    if (isCollapsed)
        return (
            <Ikon.mdiChevronRight
                //
                className={className}
                tw='COLLAPSE-PASSTHROUGH shrink-0'
            />
        )
    return (
        <Ikon.mdiChevronDown
            //
            className={className}
            tw='COLLAPSE-PASSTHROUGH shrink-0 opacity-35'
        />
    )
    // return (
    //     <div
    //         icon={isCollapsed ? 'mdiChevronRight' : 'mdiChevronDown'}
    //         tw={['WIDGET-COLLAPSE-BTN COLLAPSE-PASSTHROUGH', 'opacity-30 hover:opacity-100 cursor-pointer']}
    //     />
    // )
})
