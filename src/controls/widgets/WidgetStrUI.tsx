import { observer } from 'mobx-react-lite'
import { Input } from 'src/rsuite/shims'
import { Widget_str, Widget_strOpt } from 'src/controls/Widget'

export const WidgetStrUI = observer(function WidgetStrUI_(p: { widget: Widget_str | Widget_strOpt }) {
    const req = p.widget
    const val = req.state.val
    if (req.input.textarea) {
        return (
            <textarea
                tw='textarea textarea-bordered textarea-sm w-full'
                placeholder={req.input.placeHolder}
                rows={2}
                value={val}
                onChange={(ev) => {
                    const next = ev.target.value
                    req.state.val = next
                }}
            />
        )
    }
    return (
        <input
            tw='input input-bordered input-sm w-full'
            placeholder={req.input.placeHolder}
            value={val}
            onChange={(ev) => {
                const next = ev.target.value
                req.state.val = next
            }}
        />
    )
})
