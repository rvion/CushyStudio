import type { Field } from '../../../csuite/model/Field'

import { Frame } from '../../../csuite/frame/Frame'
import { hashStringToNumber } from '../../../csuite/hashUtils/hash'

export type WidgetCardProps = {
   hue?: number
   field: Field
   children: any
}

export const WidgetCardUI = (p: WidgetCardProps): JSX.Element => (
   <Frame //
      // style={{ transform: 'rotate(0deg)' }}
      border
      base={{
         contrast: 0.0777,
         // hue: p.hue ?? hashStringToNumber(p.field.path), // 0,
         // chroma: 0.3,
      }}
      // tw='mb-2'
      // tw='py-2 ml-1 my-1'
   >
      {p.children}
   </Frame>
)
