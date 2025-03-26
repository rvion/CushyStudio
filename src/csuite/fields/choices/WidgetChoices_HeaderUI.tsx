import type { Field_choices } from './FieldChoices'

import { WidgetChoices_HeaderButtonsUI } from './WidgetChoices_HeaderButtonsUI'
import { WidgetChoices_HeaderSelectUI } from './WidgetChoices_HeaderSelectUI'
import { WidgetChoices_HeaderTabBarUI } from './WidgetChoices_HeaderTabBarUI'

// UI
export const WidgetChoices_HeaderUI = obs(function WidgetChoices_LineUI_(p: { field: Field_choices<any> }) {
   if (p.field.config.appearance === 'tab') return <WidgetChoices_HeaderTabBarUI field={p.field} />
   if (p.field.config.appearance === 'tab2') return <WidgetChoices_HeaderButtonsUI field={p.field} />
   else return <WidgetChoices_HeaderSelectUI field={p.field} />
})
