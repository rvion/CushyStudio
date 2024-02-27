import type { IWidget } from '../IWidget'
import type { Widget_optional } from '../widgets/optional/WidgetOptional'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { isWidgetOptional } from '../widgets/WidgetUI.DI'
import { InputBoolUI } from '../widgets/bool/InputBoolUI'

export const Widget_ToggleUI = observer(function Widget_ToggleUI_(p: { widget: IWidget }) {
    if (!isWidgetOptional(p.widget)) return null
    const widget = p.widget as Widget_optional

    return (
        <InputBoolUI
            active={widget.serial.active}
            expand={false}
            onValueChange={(value) => {
                widget.serial.active = value
                widget.UpdateChildCollapsedState()
            }}
        ></InputBoolUI>
    )
})
