import { simpleBuilder } from '../../SimpleFactory'

export type SimpleRect = {
    x: number
    y: number
    width: number
    height: number
}

export const mkRect = (p: Partial<SimpleRect>): SimpleRect$['$Value'] => {
    return { x: 0, y: 0, width: 0, height: 0, ...p }
}

export type SimpleRect$ = S.SGroup<{
    x: S.SNumber
    y: S.SNumber
    width: S.SNumber
    height: S.SNumber
}>

export function simpleRect$(def?: Partial<SimpleRect>): SimpleRect$ {
    const b = simpleBuilder
    return b.fields(
        {
            x: b.number(),
            y: b.number(),
            width: b.number(),
            height: b.number(),
        },
        {
            default: def,
        },
    )
}
