import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { observer } from 'mobx-react-lite'

import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'
import { WidgetWithLabelUI } from '../../form/WidgetWithLabelUI'
import { WidgetChoices_SelectHeaderUI } from './WidgetChoices_SelectHeaderUI'
import { WidgetChoices_TabHeaderUI } from './WidgetChoices_TabHeaderUI'

// UI
export const WidgetChoices_HeaderUI = observer(function WidgetChoices_LineUI_(p: { field: Field_choices<any> }) {
    if (p.field.config.appearance === 'tab') return <WidgetChoices_TabHeaderUI field={p.field} />
    else return <WidgetChoices_SelectHeaderUI field={p.field} />
})

export const WidgetChoices_BodyUI = observer(function WidgetChoices_BodyUI_<T extends SchemaDict>(p: {
    field: Field_choices<T>
    justify?: boolean
    className?: string
}) {
    const field = p.field
    const activeSubwidgets = Object.entries(field.enabledBranches) //
        .map(([branch, subWidget]) => ({ branch, subWidget }))

    return (
        <ListOfFieldsContainerUI //
            layout={field.config.layout}
            tw={[field.config.className, p.className]}
        >
            {activeSubwidgets.map((val) => {
                const subWidget = val.subWidget
                if (subWidget == null) return <>❌ error</>
                return (
                    <WidgetWithLabelUI //
                        justifyLabel={p.justify}
                        key={val.branch}
                        fieldName={val.branch}
                        field={subWidget}
                        // label={widget.isSingle ? false : undefined}
                    />
                )
            })}
        </ListOfFieldsContainerUI>
    )
})
