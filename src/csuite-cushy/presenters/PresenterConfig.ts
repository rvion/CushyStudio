import type { Field } from '../../model/Field'
import type { PresenterSlots } from './PresenterSlots'

/**
 * custom UI for each component type or at realtive subFields
 *
 * ```ts
 * if (isFieldBool(field)) return { Header: SwitchHeader } // 👈 to modify every Boolean to use a switch
 * if (field.path === 'foo.bar.items.8') return { Header: MyHeader } // 👈 to modify specific rules at give path (you can copy the field paths from the field menu)
 * if (isFieldList(field.parent) && field.mountKey === '0') return { Header: MyHeader } // 👈 to modify the UI of the first item of a list
 * ...
 * if (...) return null // nothing is displayed
 * if (...) return      // undefined => we defer the rendering the the underlying
 * ```
 */
export type PresenterConfig = {
    shell: (field: Field) => React.FC<{ field: Field } & PresenterSlots> | 'PARENT'
    slots: (field: Field) => PresenterSlots
}
