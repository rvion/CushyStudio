import { marked } from 'marked'
import { observer } from 'mobx-react-lite'
import { Widget_markdown } from 'src/controls/InfoRequest'

export const WidgetMardownUI = observer(function WidgetMardownUI_(p: { req: Widget_markdown }) {
    const req = p.req
    return <div>{marked(req.input.markdown)}</div>
})
