import type { IWidget } from '../IWidget'

export const getIfWidgetNeedAlignedLabel = (widget: IWidget): boolean => {
    if (widget.config.alignLabel != null) return widget.config.alignLabel
    if (widget.alignLabel != null) return widget.alignLabel
    if (widget.DefaultBodyUI) return false // 🔴 <-- probably a mistake here
    return true
}
