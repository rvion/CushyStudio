import { observer } from 'mobx-react-lite'
import { Input } from 'rsuite'
import { Widget_str, Widget_strOpt } from 'src/controls/Widget'

export const WidgetStrUI = observer(function WidgetStrUI_(p: { req: Widget_str | Widget_strOpt }) {
    const req = p.req
    const val = req.state.val
    if (req.input.textarea) {
        return (
            <Input
                placeholder={req.input.placeHolder}
                as='textarea'
                rows={2}
                value={val}
                onChange={(next) => {
                    req.state.val = next
                }}
            />
        )
    }
    return (
        <Input
            placeholder={req.input.placeHolder}
            size='sm'
            value={val}
            onChange={(next) => {
                req.state.val = next
            }}
        />
    )
})
