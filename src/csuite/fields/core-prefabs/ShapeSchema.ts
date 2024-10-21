import { simpleBuilder } from '../../SimpleFactory'

export type SimpleShape = {
    // pos
    x: number
    y: number
    z: number

    // size
    width: number
    height: number
    depth: number

    // scale
    scaleX?: number
    scaleY?: number
    scaleZ?: number

    // color
    fill?: string

    // rotation
    rotation?: number

    // interraction
    isSelected: boolean
    isDragging: boolean
    isResizing: boolean
}

export const mkPlacement = (p: Partial<SimpleShape>): SimpleShape$['$Value'] => {
    return {
        x: 0,
        y: 0,
        z: 0,
        width: 0,
        height: 0,
        depth: 0,
        rotation: 0,
        fill: 'black',
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        isSelected: false,
        isDragging: false,
        isResizing: false,
        ...p,
    }
}

export type SimpleShape$ = S.SGroup<{
    x: S.SNumber
    y: S.SNumber
    z: S.SNumber
    width: S.SNumber
    height: S.SNumber
    depth: S.SNumber
    scaleX: S.SOptional<S.SNumber>
    scaleY: S.SOptional<S.SNumber>
    scaleZ: S.SOptional<S.SNumber>
    fill: S.SColor
    rotation: S.SOptional<S.SNumber>
    isSelected: S.SBool
    isDragging: S.SBool
    isResizing: S.SBool
}>

export function simpleShape$(def?: Partial<SimpleShape>): SimpleShape$ {
    const b = simpleBuilder
    return b.fields(
        {
            // pos
            x: b.number(),
            y: b.number(),
            z: b.number(),

            // size
            width: b.number(),
            height: b.number(),
            depth: b.number(),

            // scale
            scaleX: b.number().optional(),
            scaleY: b.number().optional(),
            scaleZ: b.number().optional(),

            // color
            fill: b.colorV2(),

            // rotation
            rotation: b.number().optional(),

            // interraction
            isSelected: b.boolean(),
            isDragging: b.boolean(),
            isResizing: b.boolean(),
        },
        {
            default: def,
        },
    )
}
