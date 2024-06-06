import type { IWidget } from '../IWidget'

export const getIfWidgetNeedAlignedLabel = (widget: IWidget): boolean => {
    // return true
    if (widget.config.alignLabel != null) return widget.config.alignLabel
    if (widget.alignLabel != null) return widget.alignLabel
    if (widget.DefaultBodyUI) return false // 🔴 <-- probably a mistake here
    return true
}

// this is jsut bad; should just be some kind of simple DSL here
// ['justify', 'col', '.foo', '.bar', ['.baz', '.foo'] ]
