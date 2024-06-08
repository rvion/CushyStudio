import type { Widget_markdown } from './WidgetMarkdown'

import { observer } from 'mobx-react-lite'

import { MarkdownUI } from '../../../csuite/markdown/MarkdownUI'

export const WidgetMardownUI = observer(function WidgetMardownUI_(p: { widget: Widget_markdown }) {
    const widget = p.widget
    return <MarkdownUI tw='_WidgetMardownUI w-full' markdown={widget.markdown} />
})
