import type { BaseField } from '../model/BaseField'

import { isWidgetOptional, isWidgetShared } from '../fields/WidgetUI.DI'

/** allow to handle shared and optionals */
export function getActualWidgetToDisplay(originalWidget: BaseField): BaseField {
    if (isWidgetOptional(originalWidget)) return getActualWidgetToDisplay(originalWidget.child)
    if (isWidgetShared(originalWidget)) return getActualWidgetToDisplay(originalWidget.shared)
    return originalWidget
}
