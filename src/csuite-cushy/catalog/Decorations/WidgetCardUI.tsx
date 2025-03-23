import type { Field } from '../../../csuite/model/Field'
import type { FCOrNode } from '../../../csuite/utils/renderFCOrNode'
import type { RenderProps, StandardProps } from '../../presenters/RenderProps'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../../csuite/frame/Frame'

type FF<T> = T extends FCOrNode<infer XXX> ? XXX : Record<never, never>
type XX = FF<RenderProps['Decoration']>

export type WidgetCardProps = StandardProps['Decoration'] & {
   // extra stuff that can be specified for this decoration variant
   hue?: number // (bird_d/legacy) ?
   field: Field
   children: any
   enablePadding?: boolean
   contrast?: number
   roundness?: number
   className?: string
}

// (bird_d): No longer do padding here because we want the widgets to lay themselves out and having a global padding will ruin this. For example say we want a subgroup with a different background contrast, it would also be padded and look bad.

/** Decoration that surrounds widget groups */
export const WidgetCardUI = observer(function WidgetCardUI_(p: WidgetCardProps) {
   const theme = cushy.preferences.theme.value
   const enablePadding = !p.field.isCollapsed
   return (
      <Frame
         // Clipping here fixes border's corners since child content goes outside of this component.
         tw='overflow-clip'
         className={p.className}
         border={theme.groups.border ?? { contrast: 0 }}
         base={p.contrast ?? theme.groups.contrast}
         roundness={p.roundness ?? theme.global.roundness}
         style={
            enablePadding
               ? {
                    //   paddingBottom: `${theme.groups.padding / 2}rem`,
                    //   paddingTop: `${theme.groups.padding / 2}rem`,
                 }
               : {}
         }
      >
         {p.children}
      </Frame>
   )
})
