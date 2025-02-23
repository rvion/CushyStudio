import type { CushySchemaBuilder } from '../../../controls/CushyBuilder'
import type { FieldId } from '../../../csuite/model/FieldId'

import { simpleShape$, type SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import { layerAIGeneration$ } from './layerAIGeneration$'

export type Layer$ = Z.XGroup<{
   placement: SimpleShape$
   visible: Z.XBool
   name: Z.XString
   content: Z.XChoices<{
      image: Z.XImage
      aiGeneration: Z.XGroup<{
         masks: Z.XSelectMany_<FieldId>
         draftId: Z.XSelectOne<{ id: DraftID; label: string }, DraftID>
         image: Z.XOptional<Z.XImage>
      }>
   }>
}>

export const layer$ = (b: CushySchemaBuilder): Layer$ =>
   b.fields({
      placement: simpleShape$(),
      visible: b.bool(true),
      name: b.string(),
      content: b.choice({
         image: b.image(/* MediaImageL */),
         aiGeneration: layerAIGeneration$(b),
      }),
   })
