import type { CushySchemaBuilder } from '../../../controls/Builder'

import { simpleShape$, type SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'

// #region Masks
// gayscale/opacity

export type Masks$ = X.XList<Mask$>
export type Mask$ = X.XGroup<{
   name: X.XString
   placement: SimpleShape$
   visible: X.XBool
   image: X.XImage
}>

export const mask$ = (b: CushySchemaBuilder): Mask$ =>
   b.fields({
      name: b.string(),
      placement: simpleShape$(),
      visible: b.bool(true),
      image: b.image(),
   })
