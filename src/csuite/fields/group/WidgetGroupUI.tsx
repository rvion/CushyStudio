import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_group } from './FieldGroup'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'
import { WidgetSingleLineSummaryUI } from '../../form/WidgetSingleLineSummaryUI'
import { WidgetWithLabelUI } from '../../form/WidgetWithLabelUI'
import { bang } from '../../utils/bang'

// HEADER
export const WidgetGroup_LineUI = observer(function WidgetGroup_LineUI_(p: {
    //
    field: Field_group<any>
}) {
    if (!p.field.serial.collapsed) {
        return (
            <div tw='ml-auto flex gap-0.5'>
                <Button square subtle borderless icon='mdiUnfoldMoreHorizontal' onClick={() => p.field.expandAllChildren()} />
                <Button square subtle borderless icon='mdiUnfoldLessHorizontal' onClick={() => p.field.collapseAllChildren()} />
            </div>
        )
    }
    return <WidgetSingleLineSummaryUI>{p.field.summary}</WidgetSingleLineSummaryUI>
})

export const WidgetGroup_BlockUI = observer(function WidgetGroup_BlockUI_<T extends SchemaDict>(p: {
    //
    className?: string
    field: Field_group<T>
}) {
    const field = p.field
    const groupFields = Object.entries(field.fields)
    const isHorizontal = field.config.layout === 'H'

    return (
        <ListOfFieldsContainerUI //
            layout={p.field.config.layout}
            tw={[field.config.className, p.className]}
        >
            {groupFields.map(([rootKey, sub], ix) => (
                <WidgetWithLabelUI //
                    key={rootKey}
                    fieldName={rootKey}
                    justifyLabel={isHorizontal ? false : field.config.justifyLabel}
                    field={bang(sub)}
                />
            ))}
        </ListOfFieldsContainerUI>
    )
})
