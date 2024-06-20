import type { SchemaDict } from '../../model/IBlueprint'
import type { Widget_group } from './WidgetGroup'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { WidgetsContainerUI } from '../../form/WidgetsContainerUI'
import { WidgetSingleLineSummaryUI } from '../../form/WidgetSingleLineSummaryUI'
import { WidgetWithLabelUI } from '../../form/WidgetWithLabelUI'
import { bang } from '../../utils/bang'

// HEADER
export const WidgetGroup_LineUI = observer(function WidgetGroup_LineUI_(p: {
    //
    widget: Widget_group<any>
}) {
    if (!p.widget.serial.collapsed) {
        return (
            <div tw='ml-auto flex gap-0.5'>
                <Button square onClick={() => p.widget.expandAllChildren()} subtle icon='mdiUnfoldMoreHorizontal'></Button>
                <Button square onClick={() => p.widget.collapseAllChildren()} subtle icon='mdiUnfoldLessHorizontal'></Button>
            </div>
        )
    }
    return <WidgetSingleLineSummaryUI>{p.widget.summary}</WidgetSingleLineSummaryUI>
})

export const WidgetGroup_BlockUI = observer(function WidgetGroup_BlockUI_<T extends SchemaDict>(p: {
    //
    className?: string
    widget: Widget_group<T>
}) {
    const widget = p.widget
    const groupFields = Object.entries(widget.fields)
    const isHorizontal = widget.config.layout === 'H'

    return (
        <WidgetsContainerUI layout={p.widget.config.layout} tw={[widget.config.className, p.className]}>
            {groupFields.map(([rootKey, sub], ix) => (
                <WidgetWithLabelUI //
                    key={rootKey}
                    fieldName={rootKey}
                    justifyLabel={isHorizontal ? false : widget.config.justifyLabel}
                    widget={bang(sub)}
                />
            ))}
        </WidgetsContainerUI>
    )
})
