import { observer } from 'mobx-react-lite'
import { Input } from 'rsuite'
import { Requestable_str, Requestable_strOpt } from 'src/controls/InfoRequest'

export const WidgetStrUI = observer(function WidgetStrUI_(p: { req: Requestable_str | Requestable_strOpt }) {
    const req = p.req
    const val = req.state.val
    if (req.input.textarea) {
        return (
            <Input
                as='textarea'
                rows={5}
                value={val}
                onChange={(next) => {
                    req.state.val = next
                }}
            />
        )
    }
    return (
        <Input
            size='sm'
            value={val}
            onChange={(next) => {
                req.state.val = next
            }}
        />
    )
})
