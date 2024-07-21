import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_group } from './FieldGroup'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { useCSuite } from '../../ctx/useCSuite'
import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'
import { WidgetSingleLineSummaryUI } from '../../form/WidgetSingleLineSummaryUI'
import { WidgetWithLabelUI } from '../../form/WidgetWithLabelUI'
import { bang } from '../../utils/bang'

// HEADER
export const WidgetGroup_LineUI = observer(function WidgetGroup_LineUI_(p: {
    //
    field: Field_group<any>
}) {
    const csuite = useCSuite()
    const field = p.field
    if (p.field.serial.collapsed) return <WidgetSingleLineSummaryUI>{p.field.summary}</WidgetSingleLineSummaryUI>

    const showFoldButtons = csuite.showFoldButtons
    const hasFoldableSubfields = field.hasFoldableSubfields
    if (showFoldButtons && hasFoldableSubfields) {
        return (
            <div tw='ml-auto flex gap-0.5'>
                <Button //
                    square
                    subtle
                    borderless
                    icon='mdiUnfoldMoreHorizontal'
                    disabled={!field.hasFoldableSubfieldsThatAreFolded}
                    onClick={() => p.field.expandAllChildren()}
                />

                <Button //
                    square
                    subtle
                    borderless
                    icon='mdiUnfoldLessHorizontal'
                    disabled={!field.hasFoldableSubfieldsThatAreUnfolded}
                    onClick={() => p.field.collapseAllChildren()}
                />
            </div>
        )
    }
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
