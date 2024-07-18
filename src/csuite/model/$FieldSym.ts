import type { Field } from './Field'

export const $FieldSym = Symbol('Widget')

export const isWidget = (x: any): x is Field => {
    return (
        x != null && //
        typeof x === 'object' &&
        '$FieldSym' in x &&
        x.$FieldSym === $FieldSym
    )
}
