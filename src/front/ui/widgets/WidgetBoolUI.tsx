import { observer } from 'mobx-react-lite'
import { Toggle } from 'rsuite'
import { Requestable_bool } from 'src/controls/InfoRequest'

// ----------------------------------------------------------------------

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: {
    //
    req: Requestable_bool
}) {
    return (
        <Toggle //
            checked={p.req.state.val}
            onChange={(checked) => (p.req.state.val = checked)}
        />
    )
})
