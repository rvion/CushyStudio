import type { Widget_markdown } from './WidgetMarkdown'

import { observer } from 'mobx-react-lite'

import { MarkdownUI } from '../../../rsuite/MarkdownUI'

export const WidgetMardownUI = observer(function WidgetMardownUI_(p: { widget: Widget_markdown }) {
    const widget = p.widget
    return <MarkdownUI tw={[widget.config.inHeader && 'bg-base-300', '_WidgetMardownUI w-full']} markdown={widget.markdown} />
})
