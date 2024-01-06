import { observer } from 'mobx-react-lite'
import { Widget_color } from 'src/controls/Widget'

export const WidgetColorUI = observer(function WidgetColorUI_(p: { widget: Widget_color }) {
    const widget = p.widget
    return (
        <div>
            <input //
                value={widget.state.val}
                type='color'
                onChange={(ev) => (widget.state.val = ev.target.value)}
            />
        </div>
    )
})
