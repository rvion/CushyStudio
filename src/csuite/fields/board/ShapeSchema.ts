import type { SimpleBuilder } from '../../simple/SimpleBuilder'

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
    isSelected?: boolean
    isDragging?: boolean
    isResizing?: boolean
}

export type SimpleShapeSchema = S.SGroup<{
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

export function simpleShapeSchema(b: SimpleBuilder): SimpleShapeSchema {
    return b.fields({
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
    })
}
