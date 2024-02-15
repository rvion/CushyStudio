import { observer } from 'mobx-react-lite'
import { Widget_markdown } from 'src/controls/Widget'
import { MarkdownUI } from 'src/rsuite/MarkdownUI'

export const WidgetMardownUI = observer(function WidgetMardownUI_(p: { widget: Widget_markdown }) {
    const widget = p.widget
    return <MarkdownUI tw='_WidgetMardownUI w-full' markdown={widget.markdown} />
})
