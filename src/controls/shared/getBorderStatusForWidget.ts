import type { IWidget } from '../IWidget'

export const getBorderStatusForWidget = (widget: IWidget): boolean => {
    // if app author manually specify they want no border, then we respect that
    if (widget.config.border != null) return widget.config.border
    // if the widget override the default border => we respect that
    if (widget.border != null) return widget.border
    // if the widget do NOT have a body => we do not show the border
    if (widget.BodyUI == null) return false
    // default case when we have a body => we show the border
    return true
}
