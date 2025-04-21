import type { FieldConfig_CommonProperties } from '../model/FieldConfig'

export interface Selectorable<ITEM> {
   zMountKey: string
   zParent: ITEM | null
   zAncestors: ITEM[]
   zDescendants: ITEM[]
   zChildrenActive: ITEM[]
   zChildrenAll: ITEM[]
   zType: CATALOG.AllFieldTypes
   zPath: string
   zUid: string
   zConfig: FieldConfig_CommonProperties<any>
}
