import type { IWidget } from '../IWidget'

import { WidgetDI } from '../widgets/WidgetUI.DI'

/** allow to handle shared and optionals */
export function getActualWidgetToDisplay(originalWidget: IWidget) {
    if (originalWidget instanceof WidgetDI.Widget_optional) return originalWidget.child
    if (originalWidget instanceof WidgetDI.Widget_shared) return originalWidget.shared
    return originalWidget
}
