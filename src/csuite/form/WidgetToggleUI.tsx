import type { Field_optional } from '../fields/optional/WidgetOptional'
import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../checkbox/InputBoolUI'
import { isWidgetOptional } from '../fields/WidgetUI.DI'

export const WidgetToggleUI = observer(function WidgetToggleUI_(p: { className?: string; field: Field }) {
    if (!isWidgetOptional(p.field)) return null
    const field = p.field as Field_optional
    return (
        <InputBoolUI // toggle to activate/deactivate the optional widget
            tw='UI-WidgetToggle self-stretch items-center'
            className={p.className}
            value={field.serial.active}
            expand={false}
            onValueChange={(value) => field.setActive(value)}
        />
    )
})