import type { CushySchemaBuilder } from '../../../controls/CushyBuilder'

import { simpleShape$, type SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'

// #region Masks
// gayscale/opacity

export type Masks$ = Z.XList<Mask$>
export type Mask$ = Z.XGroup<{
   name: Z.XString
   placement: SimpleShape$
   visible: Z.XBool
   image: Z.XImage
}>

export const mask$ = (b: CushySchemaBuilder): Mask$ =>
   b.fields({
      name: b.string(),
      placement: simpleShape$(),
      visible: b.bool(true),
      image: b.image(),
   })
