import type { Widget_markdown } from './WidgetMarkdown'

import { observer } from 'mobx-react-lite'

import { MarkdownUI } from '../../markdown/MarkdownUI'

export const WidgetMardownUI = observer(function WidgetMardownUI_(p: { field: Widget_markdown }) {
    const widget = p.field
    return <MarkdownUI tw='_WidgetMardownUI w-full' markdown={widget.markdown} />
})
