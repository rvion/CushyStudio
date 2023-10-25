import { observer } from 'mobx-react-lite'
import { Widget_color } from 'src/controls/InfoRequest'

export const WidgetColorUI = observer(function WidgetColorUI_(p: { req: Widget_color }) {
    const req = p.req
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
