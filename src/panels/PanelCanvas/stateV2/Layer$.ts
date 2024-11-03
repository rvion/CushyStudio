import type { CushySchemaBuilder } from '../../../controls/Builder'
import type { FieldId } from '../../../csuite/model/FieldId'

import { simpleShape$, type SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import { layerAIGeneration$ } from './layerAIGeneration$'

export type Layer$ = X.XGroup<{
   placement: SimpleShape$
   visible: X.XBool
   name: X.XString
   content: X.XChoices<{
      image: X.XImage
      aiGeneration: X.XGroup<{
         masks: X.XSelectMany_<FieldId>
         draftId: X.XSelectOne<{ id: DraftID; label: string }, DraftID>
         image: X.XOptional<X.XImage>
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
