import type { Widget_bool } from './WidgetBool'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { widget: Widget_bool }) {
    const widget = p.widget
    const isActive = widget.serial.active
    const toggle = () => runInAction(widget.toggle)
    const checkbox = (
        <input
            type='checkbox'
            checked={isActive}
            tw={['checkbox checkbox-primary']}
            tabIndex={-1}
            onClick={(ev) => {
                ev.stopPropagation()
                toggle()
            }}
        />
    )
    return widget.config.label2 == null ? (
        checkbox
    ) : (
        <div tw='flex gap-2'>
            {checkbox}
            <div tw='text-primary'>{widget.config.label2}</div>
        </div>
    )
})
