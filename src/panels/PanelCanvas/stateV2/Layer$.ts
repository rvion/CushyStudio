import type { CushySchemaBuilder } from '../../../controls/CushyBuilder'
import type { FieldId } from '../../../csuite/model/FieldId'

import { simpleShape$, type SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import { layerAIGeneration$ } from './layerAIGeneration$'

export type Layer$ = Z.Group<{
   placement: SimpleShape$
   visible: Z.Bool
   name: Z.String
   content: Z.Choices<{
      image: Z.Image
      aiGeneration: Z.Group<{
         masks: Z.XSelectMany_<FieldId>
         draftId: Z.XSelectOne<{ id: DraftID; label: string }, DraftID>
         image: Z.Maybe<Z.Image>
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
