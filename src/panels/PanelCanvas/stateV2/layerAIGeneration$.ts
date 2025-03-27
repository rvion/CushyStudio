import type { CushySchemaBuilder } from '../../../controls/CushyBuilder'
import type { FieldId } from '../../../csuite/model/FieldId'

import { masksChannel } from './ucV2'

export type LayerAIGeneration$ = Z.Group<{
   masks: Z.XSelectMany_<FieldId>
   draftId: Z.XSelectOne<{ id: DraftID; label: string }, DraftID>
   image: Z.Maybe<Z.Image>
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
         return self.zReadChannel(masksChannel)?.items.map((t) => t.zUid) ?? []
      }),

      //  => Bridge is just too specifc, let's leave each app include
      // it's own bridge prefab
      draftId: b.draft(/* DraftId */),
      image: b.image().optional(),
   })
}
