import type { SchemaDict } from '../../ISpec'
import type { Widget_group } from './WidgetGroup'

import { observer } from 'mobx-react-lite'

import { FrameSubtle } from '../../../csuite/wrappers/FrameSubtle'
import { bang } from '../../../utils/misc/bang'
import { WidgetsContainerUI } from '../../shared/WidgetsContainerUI'
import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'

// UI
export const WidgetGroup_LineUI = observer(function WidgetGroup_LineUI_(p: {
    //
    widget: Widget_group<any>
}) {
    if (!p.widget.serial.collapsed) return null
    return (
        <FrameSubtle className='COLLAPSE-PASSTHROUGH' tw='line-clamp-1 italic'>
            {p.widget.summary}
        </FrameSubtle>
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
        <WidgetsContainerUI layout={p.widget.config.layout} tw={[widget.config.className, p.className]}>
            {groupFields.map(([rootKey, sub], ix) => (
                <WidgetWithLabelUI //
                    isTopLevel={isTopLevel}
                    key={rootKey}
                    rootKey={rootKey}
                    justifyLabel={isHorizontal ? false : widget.config.alignLabel}
                    widget={bang(sub)}
                />
            ))}
        </WidgetsContainerUI>
    )
})
