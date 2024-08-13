import type { SimpleBuilder } from '../../simple/SimpleBuilder'

// CUBE ------------------------------------------------

export type ShapeSchema = S.SGroup<{
    x: S.SNumber
    y: S.SNumber
    z: S.SNumber
    width: S.SNumber
    height: S.SNumber
    depth: S.SNumber
    scaleX: S.SOptional<S.SNumber>
    scaleY: S.SOptional<S.SNumber>
    scaleZ: S.SOptional<S.SNumber>
    fill: S.SString
    rotation: S.SOptional<S.SNumber>
    isSelected: S.SBool
    isDragging: S.SBool
    isResizing: S.SBool
}>

export function mkShapeSchema(b: SimpleBuilder): ShapeSchema {
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
