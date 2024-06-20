import type { BaseField } from '../model/BaseField'

export const getIfWidgetNeedJustifiedLabel = (widget: BaseField): boolean => {
    // return true
    if (widget.config.justifyLabel != null) return widget.config.justifyLabel
    // if (widget.justifyLabel != null) return widget.justifyLabel
    if (widget.DefaultBodyUI) return false // 🔴 <-- probably a mistake here
    return true
}

// this is jsut bad; should just be some kind of simple DSL here
// ['justify', 'col', '.foo', '.bar', ['.baz', '.foo'] ]
