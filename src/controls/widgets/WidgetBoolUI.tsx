import { observer } from 'mobx-react-lite'
import { Widget_bool } from 'src/controls/Widget'

// ----------------------------------------------------------------------

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { req: Widget_bool }) {
    return null // fieldWithUI toogle should handle that alreadly
    // return (
    //     <Toggle //
    //         checked={p.req.state.val}
    //         onChange={(ev) => {
    //             p.req.state.val = ev.target.checked
    //             // p.req.state.active = ev.target.checked
    //         }}
    //     />
    // )
})
