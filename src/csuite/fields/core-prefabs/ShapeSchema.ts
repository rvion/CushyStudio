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
   scaleX?: Maybe<number>
   scaleY?: Maybe<number>
   scaleZ?: Maybe<number>

   // color
   fill: string

   // rotation
   rotation?: Maybe<number>

   // interraction
   isSelected: boolean
   isDragging: boolean
   isResizing: boolean
}

export const mkPlacement = (p: Partial<SimpleShape>): SimpleShape => {
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

export type SimpleShape$ = Z.Record<{
   x: Z.Number
   y: Z.Number
   z: Z.Number
   width: Z.Number
   height: Z.Number
   depth: Z.Number
   scaleX: Z.Optional<Z.Number>
   scaleY: Z.Optional<Z.Number>
   scaleZ: Z.Optional<Z.Number>
   fill: Z.Color
   rotation: Z.Optional<Z.Number>
   isSelected: Z.Bool
   isDragging: Z.Bool
   isResizing: Z.Bool
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
         fill: b.color(),

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
