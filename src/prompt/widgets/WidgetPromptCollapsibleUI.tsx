import type { Field_prompt } from '../FieldPrompt'

import { observer } from 'mobx-react-lite'

import { PluginToggleBarUI } from './PluginToggleBarUI'
import { WidgetPrompt_LineUI } from './WidgetPrompt_LineUI'

export const WidgetPromptCollapsibleUI = observer(function WidgetPromptCollapsibleUI_({
   field,
}: {
   field: Field_prompt
}) {
   if (field.isCollapsed) return <WidgetPrompt_LineUI field={field} />
   // return <WidgetPromptUI field={field} />
   return <PluginToggleBarUI />
})
