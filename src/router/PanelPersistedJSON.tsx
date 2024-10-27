import type { Json } from '../csuite/types/Json'

// 💬 2024-07-28 rvion:
// | should it be `extends Json` (src/csuite/types/Json.ts)
// | instead of extends any to make sure we alwyas store stuff that can be serialized to json ?

export type PanelPersistedJSON<PROPS extends any = any> = {
   // 💬 2024-08-13 rvion:
   // | this is not necessary, since we can always retrieve the
   // | panelName using `tabNode.getComponent()`
   // |    VVVVVVVVVV
   // | ❌ $panelName: string

   $props: PROPS

   /** persisted in panel json, remain when cushy is closed/re-opened */
   $store?: { [storeName: string]: Json }

   /** volative store; not persisted in json, lost when cushy quit */
   $temp?: { [storeName: string]: Json }
}
