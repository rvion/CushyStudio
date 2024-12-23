import * as v from 'valibot'

// prettier-ignore
export type LiteGraphGroup = {
   title: string                              //  'Create Mask'
   bounding: [number, number, number, number] //  [1078, -579, 1589, 614]
   color: string                              //  '#3f789e'
   font_size: number                          //  24
   flags: {}                                  //  {}
}

export const LiteGraphGroup_valibot = v.strictObject({
   title: v.string(),
   bounding: v.tuple([v.number(), v.number(), v.number(), v.number()]),
   color: v.string(),
   font_size: v.number(),
   flags: v.strictObject({}),
})
