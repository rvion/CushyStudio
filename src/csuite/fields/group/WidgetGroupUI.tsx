import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_group } from './FieldGroup'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { UI } from '../../components/UI'
import { useCSuite } from '../../ctx/useCSuite'
import { FieldPresenter_Cushy } from '../../form/ShellCushy'
import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'
import { WidgetSingleLineSummaryUI } from '../../form/WidgetSingleLineSummaryUI'
import { bang } from '../../utils/bang'

// HEADER
export const WidgetGroup_LineUI = observer(function WidgetGroup_LineUI_(p: {
    //
    field: Field_group<any>
}) {
    const csuite = useCSuite()
    const field = p.field
    if (p.field.serial.collapsed) return <WidgetSingleLineSummaryUI>{p.field.summary}</WidgetSingleLineSummaryUI>

    const presets = field.config.presets
    const presetCount = presets?.length ?? 0
    const out: ReactNode[] = []
    const showFoldButtons = csuite.showFoldButtons
    const hasFoldableSubfields = field.hasFoldableSubfields
    if (presets?.length && field.config.presetButtons) {
        out.push(
            ...presets.map((preset, ix) => (
                <UI.Button //
                    key={preset.label + ix}
                    // square
                    // subtle
                    icon={preset.icon}
                    onClick={(ev) => {
                        preset.apply(field)
                        ev.stopPropagation()
                    }}
                    children={preset.label}
                />
            )),
        )
    }
    if (showFoldButtons && hasFoldableSubfields) {
        out.push(
            <div tw='ml-auto flex gap-0.5' key='lShd8JZuFZ'>
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
            </div>,
        )
    }
    if (out.length == 0) return null
    return out
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
                // sub.render()
                <FieldPresenter_Cushy //
                    key={rootKey}
                    showWidgetIndent={p.field.config.layout === 'H' ? ix === 0 : true}
                    fieldName={rootKey}
                    justifyLabel={isHorizontal ? false : field.config.justifyLabel}
                    field={bang(sub)}
                />
            ))}
        </ListOfFieldsContainerUI>
    )
})
