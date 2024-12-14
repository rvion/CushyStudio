import type { Field } from '../../../csuite/model/Field'

import { Frame } from '../../../csuite/frame/Frame'

export type WidgetCardProps = {
   hue?: number // (bird_d/legacy) ?
   field: Field
   children: any
}

// (bird_d): No longer do padding here because we want the widgets to lay themselves out and having a global padding will ruin this. For example say we want a subgroup with a different background contrast, it would also be padded and look bad.

/** Decoration that surrounds widget groups */
export const WidgetCardUI = (p: WidgetCardProps): JSX.Element => {
   const theme = cushy.preferences.theme.value
   return (
      <Frame
         // Clipping here fixes border's corners since child content goes outside of this component.
         tw='overflow-clip'
         base={{
            contrast: 0.0777,
         }}
         roundness={theme.inputRoundness}
      >
         {p.children}
      </Frame>
   )
}
