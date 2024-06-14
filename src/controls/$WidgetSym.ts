import type { BaseWidget } from './BaseWidget'

export const $WidgetSym = Symbol('Widget')

export const isWidget = (x: any): x is BaseWidget => {
    return (
        x != null && //
        typeof x === 'object' &&
        '$WidgetSym' in x &&
        x.$WidgetSym === $WidgetSym
    )
}
