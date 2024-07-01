import type { Field_optional } from '../fields/optional/WidgetOptional'
import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../checkbox/InputBoolUI'
import { isWidgetOptional } from '../fields/WidgetUI.DI'

export const WidgetToggleUI = observer(function WidgetToggleUI_(p: { className?: string; widget: Field }) {
    if (!isWidgetOptional(p.widget)) return null
    const widget = p.widget as Field_optional
    return (
        <InputBoolUI // toggle to activate/deactivate the optional widget
            tw='UI-WidgetToggle self-stretch items-center'
            className={p.className}
            value={widget.serial.active}
            expand={false}
            onValueChange={(value) => widget.setActive(value)}
        />
    )
})
