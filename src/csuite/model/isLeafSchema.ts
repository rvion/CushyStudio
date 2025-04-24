import type { CSchema } from './CSchema'

import { isSchemaOptional } from '../fields/WidgetUI.DI'

export function isLeafSchema(schema: CSchema): boolean {
   const realSchema = isSchemaOptional(schema) ? schema.config.schema : schema
   if (realSchema.type === 'group') return false
   if (realSchema.type === 'choices') return false
   if (realSchema.type === 'list') return false
   // 🚂 if (realSchema.type === 'relationships') return false
   return true
}
