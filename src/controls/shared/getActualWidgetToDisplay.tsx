import type { IWidget } from '../IWidget'

import { isWidgetOptional, isWidgetShared } from '../widgets/WidgetUI.DI'

/** allow to handle shared and optionals */
export function getActualWidgetToDisplay(originalWidget: IWidget): IWidget {
    if (isWidgetOptional(originalWidget)) return getActualWidgetToDisplay(originalWidget.child)
    if (isWidgetShared(originalWidget)) return getActualWidgetToDisplay(originalWidget.shared)
    return originalWidget
}
