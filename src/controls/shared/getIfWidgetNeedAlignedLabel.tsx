import type { IWidget } from '../IWidget'

export const getIfWidgetNeedAlignedLabel = (widget: IWidget): boolean => {
    if (widget.alignLabel != null) return widget.alignLabel
    if (widget.config.alignLabel != null) return widget.config.alignLabel
    if (widget.BodyUI) return false
    return true
}
