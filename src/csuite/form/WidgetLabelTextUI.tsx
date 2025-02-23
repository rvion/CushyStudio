import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'
import { type ReactNode, useState } from 'react'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'

export const WidgetLabelTextUI = observer(function WidgetLabelTextUI_(p: {
   //
   widget: Field
   className?: string
   children: ReactNode
}) {
   const csuite = useCSuite()
   const [isOverflowing, setIsOverflowing] = useState(false)

   return (
      <Frame
         ref={(node) => {
            if (node == null) return
            setIsOverflowing(
               node.scrollHeight > node.clientHeight + 5 || node.scrollWidth > node.clientWidth + 5,
            )
         }}
         tooltip={isOverflowing ? p.widget.labelText : undefined}
         tw={[
            'lh-widget',
            'UI-WidgetLabel minh-widget ABDDE self-start',

            // 1. indicate we can click on the label
            p.widget.isCollapsed || p.widget.isCollapsible ? 'COLLAPSE-PASSTHROUGH cursor-pointer' : null,

            // 3. label wrappign strategy
            // 3.1  alt. 1: disable all wrapping
            // 'whitespace-nowrap',

            // 3.2. alt. 2:
            //  - limit to 2 lines, with ellipsis,
            //  - dense line height to force widget to remain within it's
            //  - original allocated height
            // 'line-clamp-2',

            // 3.3. alt. 3:
            //
            // '[lineHeight:1.3rem] overflow-auto',
            csuite.truncateLabels && 'truncate',

            p.className,
         ]}
      >
         {p.widget.isHidden && '🥷 '}
         {p.children}
      </Frame>
   )
})
