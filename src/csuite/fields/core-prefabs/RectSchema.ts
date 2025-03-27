import { simpleBuilder } from '../../SimpleFactory'

export type SimpleRect = {
   x: number
   y: number
   width: number
   height: number
}

export const mkRect = (p: Partial<SimpleRect>): SimpleRect$['…value'] => {
   return { x: 0, y: 0, width: 0, height: 0, ...p }
}

export type SimpleRect$ = Z.Group<{
   x: Z.Number
   y: Z.Number
   width: Z.Number
   height: Z.Number
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
