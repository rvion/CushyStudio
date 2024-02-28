import type { Widget_bool } from './WidgetBool'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { InputBoolUI } from './InputBoolUI'

let isDragging = false
let wasEnabled = false

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { widget: Widget_bool }) {
    const widget = p.widget
    let label = widget.config.text ?? widget.config.label2

    if (widget.config.label2) {
        console.warn('label2 is deprecated, please use the text option instead. label2 will be removed in the future')
    }

    return (
        <InputBoolUI //
            active={widget.serial.active}
            display={widget.config.display}
            expand={widget.config.expand}
            icon={widget.config.icon}
            text={label}
            onValueChange={(value) => (widget.serial.active = value)}
        ></InputBoolUI>
    )
})
