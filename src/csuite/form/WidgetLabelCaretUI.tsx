import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../csuite/icons/iconHelpers'

export const LabelCaretWidth = '1rem'

export const WidgetLabelCaretPlaceholderUI = observer(function WidgetLabelCaretPlaceholderUI_(p: { className?: string }) {
    return (
        <Ikon._
            className={p.className}
            tw={[
                //
                'UI-WidgetLabelCaret self-start minh-widget ABDDE',
                'COLLAPSE-PASSTHROUGH shrink-0',
            ]}
        />
    )
})

export const WidgetLabelCaretUI = observer(function WidgetLabelCaretUI_(p: {
    //
    className?: string
    /** @default true */
    placeholder?: boolean
    field: Field
}) {
    if (!p.field.isCollapsed && !p.field.isCollapsible) {
        const showPlaceholder = p.placeholder ?? true
        if (showPlaceholder) return <WidgetLabelCaretPlaceholderUI className={p.className} />
        return null
    }
    return (
        <WidgetLabelCaretAlwaysUI //
            className={p.className}
            isCollapsed={p.field.isCollapsed}
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
            <Ikon.mdiChevronRight //
                className={className}
                tw={[
                    //
                    'UI-WidgetLabelCaret self-start minh-widget ABDDE',
                    'COLLAPSE-PASSTHROUGH shrink-0',
                ]}
            />
        )
    return (
        <Ikon.mdiChevronDown
            //
            className={className}
            tw={[
                //
                'UI-WidgetLabelCaret self-start minh-widget ABDDE',
                'COLLAPSE-PASSTHROUGH shrink-0 opacity-35',
            ]}
        />
    )
    // return (
    //     <div
    //         icon={isCollapsed ? 'mdiChevronRight' : 'mdiChevronDown'}
    //         tw={['WIDGET-COLLAPSE-BTN COLLAPSE-PASSTHROUGH', 'opacity-30 hover:opacity-100 cursor-pointer']}
    //     />
    // )
})
