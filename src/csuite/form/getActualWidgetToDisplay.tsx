import type { BaseField } from '../model/BaseField'

import { isWidgetLink, isWidgetOptional, isWidgetShared } from '../fields/WidgetUI.DI'

/** allow to handle shared and optionals */
export function getActualWidgetToDisplay(originalWidget: BaseField): BaseField {
    if (isWidgetOptional(originalWidget)) return getActualWidgetToDisplay(originalWidget.child)
    if (isWidgetLink(originalWidget)) return originalWidget.bField
    if (isWidgetShared(originalWidget))
        return originalWidget.shared ? getActualWidgetToDisplay(originalWidget.shared) : originalWidget
    return originalWidget
}
