import type { BaseField } from './BaseField'

export const $WidgetSym = Symbol('Widget')

export const isWidget = (x: any): x is BaseField => {
    return (
        x != null && //
        typeof x === 'object' &&
        '$WidgetSym' in x &&
        x.$WidgetSym === $WidgetSym
    )
}
