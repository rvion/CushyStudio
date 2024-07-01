import type { SchemaDict } from '../../model/ISchema'
import type { Field_choices } from './WidgetChoices'

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
    const widget = p.field
    const activeSubwidgets = Object.entries(widget.children) //
        .map(([branch, subWidget]) => ({ branch, subWidget }))

    return (
        <ListOfFieldsContainerUI //
            layout={widget.config.layout}
            tw={[widget.config.className, p.className]}
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
