import type { Field } from '../../model/Field'

import { mkPlacement, type SimpleShape } from '../core-prefabs/ShapeSchema'

export type BoardSize = {
   width: number
   height: number
   depth?: number
   fill?: string // color
}

export const boardDefaultItemShape: SimpleShape = mkPlacement({
   x: 50,
   y: 50,
   z: 0,
   width: 50,
   height: 50,
   depth: 0,
})

export type WithPosition<T extends Field> = {
   widget: T
   position: SimpleShape
}
