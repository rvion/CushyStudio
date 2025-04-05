import type { Field_selectOne } from './FieldSelectOne'
import type { SelectKey } from './SelectOneKey'

import { BadgeUI } from '../../badge/BadgeUI'
import { hashPrimitiveToNumber } from '../../hashUtils/hash'
import { RevealUI } from '../../reveal/RevealUI'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'
import { useMemo } from 'react'

export const WidgetSelectOne_CellUI = obs(function WidgetSelectOne_TabUI_<VALUE, KEY extends SelectKey>(p: {
   field: Field_selectOne<VALUE, KEY>
   opts?: { reveal?: boolean }
}) {
   // case unset
   const val = p.field.selectedOption_unchecked
   if (val == null) return p.field.zConfig.placeholder ?? ''

   // compute colors
   const hue = val.hue ?? hashPrimitiveToNumber(val.id)
   const badgeColorProps = useMemo(
      () => ({
         noColorStuff: hue === false,
         hue: hue === false ? undefined : hue,
         autoHue: hue === false ? false : undefined,
      }),
      [hue],
   )

   // render when reveal
   if (p.opts?.reveal)
      return (
         <RevealUI content={() => val.label ?? val.id} trigger={'hover'} placement='right' tw='gap-1'>
            <BadgeUI icon={val.icon} {...badgeColorProps}>
               {makeLabelFromPrimitiveValue(val.id)}
            </BadgeUI>
         </RevealUI>
      )

   // render when no reveal
   return (
      <BadgeUI icon={val.icon} {...badgeColorProps} tw='gap-1'>
         {val.label ?? val.id}
      </BadgeUI>
   )
})
