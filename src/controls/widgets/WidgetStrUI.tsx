import { observer } from 'mobx-react-lite'
import { Widget_str, Widget_strOpt } from 'src/controls/Widget'

export const WidgetStrUI = observer(function WidgetStrUI_(p: { widget: Widget_str | Widget_strOpt }) {
    const widget = p.widget
    const val = widget.state.val
    if (widget.input.textarea) {
        return (
            <textarea
                tw='textarea textarea-bordered textarea-sm w-full'
                placeholder={widget.input.placeHolder}
                rows={2}
                value={val}
                onChange={(ev) => {
                    const next = ev.target.value
                    widget.state.val = next
                }}
            />
        )
    }
    return (
        <input
            tw='input input-bordered input-sm w-full'
            placeholder={widget.input.placeHolder}
            value={val}
            onChange={(ev) => {
                const next = ev.target.value
                widget.state.val = next
            }}
        />
    )
})
