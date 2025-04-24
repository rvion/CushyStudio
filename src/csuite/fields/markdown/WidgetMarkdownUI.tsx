import type { Field_markdown } from './FieldMarkdown'

import { MarkdownUI } from '../../markdown/MarkdownUI'

export const WidgetMardownUI = obs(function WidgetMardownUI_(p: { field: Field_markdown }) {
   const field = p.field
   return <MarkdownUI tw='_WidgetMardownUI w-full' markdown={field.markdown} />
})
