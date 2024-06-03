import type { SchemaDict } from '../../ISpec'
import type { Widget_group } from './WidgetGroup'

import { observer } from 'mobx-react-lite'

import { BoxSubtle } from '../../../rsuite/box/BoxMisc'
import { bang } from '../../../utils/misc/bang'
import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'

// UI
export const WidgetGroup_LineUI = observer(function WidgetGroup_LineUI_(p: {
    //
    widget: Widget_group<any>
}) {
    if (!p.widget.serial.collapsed) return null
    return (
        <BoxSubtle className='COLLAPSE-PASSTHROUGH' tw='line-clamp-1 italic'>
            {p.widget.summary}
        </BoxSubtle>
    )
})

export const WidgetGroup_BlockUI = observer(function WidgetGroup_BlockUI_<T extends SchemaDict>(p: {
    //
    className?: string
    widget: Widget_group<T>
}) {
    const widget = p.widget
    const isTopLevel = widget.config.topLevel
    const groupFields = Object.entries(widget.fields)
    const isHorizontal = widget.config.layout === 'H'

    return (
        <WidgetFieldsContainerUI layout={p.widget.config.layout} tw={[widget.config.className, p.className]}>
            {groupFields.map(([rootKey, sub], ix) => (
                <WidgetWithLabelUI //
                    isTopLevel={isTopLevel}
                    key={rootKey}
                    rootKey={rootKey}
                    alignLabel={isHorizontal ? false : widget.config.alignLabel}
                    widget={bang(sub)}
                />
            ))}
        </WidgetFieldsContainerUI>
    )
})

export const WidgetFieldsContainerUI = observer(function WidgetFieldsContainerUI_(p: {
    layout?: 'H' | 'V'
    className?: string
    children?: React.ReactNode
}) {
    const isHorizontal = p.layout === 'H'

    return (
        <div
            className={p.className}
            tw={[
                //
                isHorizontal ? `flex gap-1 flex-wrap` : `flex gap-1 flex-col`,
                'w-full',
                p.className,
            ]}
        >
            {p.children}
        </div>
    )
})
