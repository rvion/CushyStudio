import type { Field } from '../model/Field'

import { isWidgetLink, isWidgetOptional, isWidgetShared } from '../fields/WidgetUI.DI'

/** allow to handle shared and optionals */
export function getActualWidgetToDisplay(originalField: Field): Field {
    if (isWidgetOptional(originalField)) return getActualWidgetToDisplay(originalField.child)
    if (isWidgetLink(originalField)) return originalField.bField
    if (isWidgetShared(originalField))
        return originalField.shared ? getActualWidgetToDisplay(originalField.shared) : originalField
    return originalField
}
