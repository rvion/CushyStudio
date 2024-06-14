import type { BaseWidget } from '../BaseWidget'

import { isWidgetOptional, isWidgetShared } from '../widgets/WidgetUI.DI'

/** allow to handle shared and optionals */
export function getActualWidgetToDisplay(originalWidget: BaseWidget): BaseWidget {
    if (isWidgetOptional(originalWidget)) return getActualWidgetToDisplay(originalWidget.child)
    if (isWidgetShared(originalWidget)) return getActualWidgetToDisplay(originalWidget.shared)
    return originalWidget
}
