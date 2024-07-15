import type { Field } from '../model/Field'

import { isFieldLink, isFieldOptional, isFieldShared } from '../fields/WidgetUI.DI'

/** allow to handle shared and optionals */
export function getActualWidgetToDisplay(originalField: Field): Field {
    if (isFieldOptional(originalField)) return getActualWidgetToDisplay(originalField.child)
    if (isFieldLink(originalField)) return originalField.bField
    if (isFieldShared(originalField)) return originalField.shared ? getActualWidgetToDisplay(originalField.shared) : originalField
    return originalField
}
