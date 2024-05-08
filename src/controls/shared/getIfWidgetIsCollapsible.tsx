import type { IWidget } from '../IWidget'

export const getIfWidgetIsCollapsible = (widget: IWidget): boolean => {
    // top level widget is not collapsible; we may want to revisit this decision
    // if (widget.parent == null) return false
    if (widget.config.collapsed != null) return widget.config.collapsed //
    if (widget.collapsible != null) return widget.collapsible
    if (!widget.DefaultBodyUI) return false // 🔴 <-- probably a mistake here
    if (widget.config.label === false) return false

    // 🔶 commenting this check because it should be handled by the widget.hasBlock already
    // 🔶 slightly less safe, but avoid relying on calling WidgetDI.WidgetUI().
    // const { WidgetBlockUI } = WidgetDI.WidgetUI(widget) // WidgetDI.WidgetUI(widget)

    return true
}
