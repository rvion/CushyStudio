import type { IWidget } from '../IWidget'
import type { Widget_optional } from '../widgets/optional/WidgetOptional'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../widgets/bool/InputBoolUI'
import { isWidgetOptional } from '../widgets/WidgetUI.DI'

export const Widget_ToggleUI = observer(function Widget_ToggleUI_(p: { widget: IWidget }) {
    // only do something if widget is Optional
    if (!isWidgetOptional(p.widget)) return null
    const widget = p.widget as Widget_optional

    return (
        <InputBoolUI // toggle to activate/deactivate the optional widget
            active={widget.serial.active}
            expand={false}
            onValueChange={(value) => widget.setActive(value)}
        />
    )
})
