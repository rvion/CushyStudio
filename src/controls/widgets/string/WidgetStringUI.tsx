import { observer } from 'mobx-react-lite'
import { Widget_string } from './WidgetString'

// UI
export const WidgetStringUI = observer(function WidgetStringUI_(p: { widget: Widget_string }) {
    const widget = p.widget
    const val = widget.value
    if (widget.config.textarea) {
        return (
            <textarea
                tw='textarea textarea-bordered textarea-sm w-full'
                placeholder={widget.config.placeHolder}
                rows={2}
                value={val}
                onChange={(ev) => {
                    const next = ev.target.value
                    widget.serial.val = next
                }}
            />
        )
    }
    return (
        <input
            tw='input input-sm w-full'
            placeholder={widget.config.placeHolder}
            value={val}
            onChange={(ev) => {
                const next = ev.target.value
                widget.serial.val = next
            }}
        />
    )
})
