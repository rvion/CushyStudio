import type { Field_enum } from './FieldEnum'

import { exhaust } from '../../utils/exhaust'
import { WidgetEnum_SelectUI } from './WidgetEnum_SelectUI'
import { WidgetEnum_TabUI } from './WidgetEnum_TabUI'

// UI

export const WidgetEnumUI = obs(function WidgetEnumUI_(p: { field: Field_enum<any> }) {
   const field = p.field
   const skin = field.config.appearance ?? 'select'
   if (skin === 'select') return <WidgetEnum_SelectUI field={field} />
   if (skin === 'tab') return <WidgetEnum_TabUI field={field} />
   exhaust(skin)
   return <>❌ error</>
})
