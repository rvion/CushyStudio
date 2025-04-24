import type { CushySchemaBuilder } from '../../../controls/CushyBuilder'

import { simpleShape$, type SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'

// #region Masks
// gayscale/opacity

export type Masks$ = Z.List<Mask$>
export type Mask$ = Z.Group<{
   name: Z.String
   placement: SimpleShape$
   visible: Z.Bool
   image: Z.Image
}>

export const mask$ = (b: CushySchemaBuilder): Mask$ =>
   b.fields({
      name: b.string(),
      placement: simpleShape$(),
      visible: b.bool(true),
      image: b.image(),
   })
