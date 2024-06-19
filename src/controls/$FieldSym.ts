import type { BaseField } from './BaseField'

export const $FieldSym = Symbol('Widget')

export const isWidget = (x: any): x is BaseField => {
    return (
        x != null && //
        typeof x === 'object' &&
        '$FieldSym' in x &&
        x.$FieldSym === $FieldSym
    )
}
