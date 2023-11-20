import { observer } from 'mobx-react-lite'
import { Toggle } from 'src/rsuite/shims'
import { Widget_bool } from 'src/controls/Widget'

// ----------------------------------------------------------------------

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { req: Widget_bool }) {
    return (
        <Toggle //
            checked={p.req.state.val}
            onChange={(ev) => (p.req.state.val = ev.target.checked)}
        />
    )
})
