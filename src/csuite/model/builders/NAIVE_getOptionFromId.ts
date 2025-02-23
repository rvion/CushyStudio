import type { SelectKey } from '../../fields/selectOne/SelectOneKey'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'

type NaiveOption<KEY> = { id: KEY; label: string; value: KEY }

export function NAIVE_getOptionFromId<KEY extends SelectKey>(id: KEY): NaiveOption<KEY> {
   return {
      id,
      label: makeLabelFromPrimitiveValue(id),
      value: id,
   }
}

export function NAIVE_getOptionFromId2<KEY extends SelectKey>(id: KEY): NaiveOption<KEY> {
   return {
      id,
      label: id != null ? makeLabelFromPrimitiveValue(id) : '--',
      value: id,
   }
}
