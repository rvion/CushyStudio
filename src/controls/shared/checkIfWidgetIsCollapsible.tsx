import type { IWidget } from '../IWidget'

export const checkIfWidgetIsCollapsible = (widget: IWidget): boolean => {
    if (widget.config.alwaysExpanded) return false //
    if (!widget.hasBlock) return false

    // 🔶 commenting this check because it should be handled by the widget.hasBlock already
    // 🔶 slightly less safe, but avoid relying on calling WidgetDI.WidgetUI().
    // const { WidgetBlockUI } = WidgetDI.WidgetUI(widget) // WidgetDI.WidgetUI(widget)

    return true
}
