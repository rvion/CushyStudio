import type { Field_selectOne } from './FieldSelectOne'
import type { SelectKey } from './SelectOneKey'

import { exhaust } from '../../utils/exhaust'
import { WidgetSelectOne_RollUI } from './WidgetSelectOne_RollUI'
import { WidgetSelectOne_SelectUI } from './WidgetSelectOne_SelectUI'
import { WidgetSelectOne_TabUI } from './WidgetSelectOne_TabUI'

export const WidgetSelectOneUI = obs(function WidgetSelectOneUI_<VALUE, KEY extends SelectKey>(p: {
   field: Field_selectOne<VALUE, KEY>
}) {
   const field = p.field
   const skin = field.ϟconfig.appearance ?? 'select'
   if (skin === 'tab') return <WidgetSelectOne_TabUI field={field} />
   if (skin === 'select') return <WidgetSelectOne_SelectUI field={field} />
   if (skin === 'roll') return <WidgetSelectOne_RollUI field={field} />
   exhaust(skin)
   return <>❌ error</>
})
