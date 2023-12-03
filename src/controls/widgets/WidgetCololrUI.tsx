import { observer } from 'mobx-react-lite'
import { Widget_color } from 'src/controls/Widget'

export const WidgetColorUI = observer(function WidgetColorUI_(p: { widget: Widget_color }) {
    const req = p.widget
    return (
        <div>
            <input //
                value={req.state.val}
                type='color'
                onChange={(ev) => (req.state.val = ev.target.value)}
            />
        </div>
    )
})
