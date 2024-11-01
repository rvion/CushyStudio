import type { CushySchemaBuilder } from '../../../controls/Builder'
import type { FieldId } from '../../../csuite/model/FieldId'

import { masksChannel } from './ucV2'

export type LayerAIGeneration$ = X.XGroup<{
   masks: X.XSelectMany_<FieldId>
   draftId: X.XSelectOne<{ id: DraftID; label: string }, DraftID>
   image: X.XOptional<X.XImage>
}>
export function layerAIGeneration$(b: CushySchemaBuilder): LayerAIGeneration$ {
   return b.fields({
      // when we run a aiGeneration layer,
      // - it adds more candidates (actually, those are just the step output [type=image])
      // - canvas
      //    - it' layer
      //        it's placement
      //    - should be able to access a rasterized version of the stack of layers below it
      // BUT we also need....
      //   - feathering, etc.
      // ⏸️ bridge: b.fields({
      // ⏸️     //
      // ⏸️ }),
      masks: b.selectManyDynamicStrings<FieldId>((self) => {
         return self.consume(masksChannel)?.items.map((t) => t.id) ?? []
      }),

      //  => Bridge is just too specifc, let's leave each app include
      // it's own bridge prefab
      draftId: b.draft(/* DraftId */),
      image: b.image().optional(),
   })
}
