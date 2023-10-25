import { observer } from 'mobx-react-lite'
import { Toggle } from 'rsuite'
import { Widget_bool } from 'src/controls/Widget'

// ----------------------------------------------------------------------

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: {
    //
    req: Widget_bool
}) {
    return (
        <Toggle //
            checked={p.req.state.val}
            onChange={(checked) => (p.req.state.val = checked)}
        />
    )
})
