import type { IWidget } from '../IWidget'

import { WidgetDI } from '../widgets/WidgetUI.DI'

/** allow to handle shared and optionals */
export function getActualWidgetToDisplay(originalWidget: IWidget) {
    return originalWidget instanceof WidgetDI.Widget_optional && originalWidget.child //
        ? originalWidget.child
        : originalWidget
}
