import type { IWidget } from './IWidget'

export const $WidgetSym = Symbol('Widget')

export const isWidget = (x: any): x is IWidget => {
    return (
        x != null && //
        typeof x === 'object' &&
        '$WidgetSym' in x &&
        x.$WidgetSym === $WidgetSym
    )
}
