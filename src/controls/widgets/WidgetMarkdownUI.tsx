import { marked } from 'marked'
import { observer } from 'mobx-react-lite'
import { Widget_markdown } from 'src/controls/Widget'

export const WidgetMardownUI = observer(function WidgetMardownUI_(p: { widget: Widget_markdown }) {
    const req = p.widget
    return (
        <div //
            className='_WidgetMardownUI _MD w-full'
            dangerouslySetInnerHTML={{ __html: marked(req.markdown) }}
        ></div>
    )
})
