import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'

export const WidgetHeaderContainerUI = observer(function WidgetHeaderContainerUI_(p: {
   field: Field
   children?: React.ReactNode
}) {
   const field = p.field
   const isCollapsed = field.isCollapsed

   const csuite = useCSuite()

   return (
      <Frame
         // hover={2} // 🚂 we prefer to not have this hover
         className='UI-WidgetHeaderContainer COLLAPSE-PASSTHROUGH'
         tw={[
            'flex select-none gap-0.5',
            // 💬 2024-06-03 rvion, changing 'items-center' to 'items-start'
            // as well as adding some `h-input` class to <WidgetLabelContainerUI />
            'items-start',
         ]}
         triggerOnPress={
            csuite.enableRollingClick !== false
               ? { startingState: isCollapsed, toggleGroup: field._uid }
               : undefined
         }
         onClick={(ev) => {
            if (ev.button != 0 || !field.isCollapsible) return
            const target = ev.target as HTMLElement
            if (!target.classList.contains('COLLAPSE-PASSTHROUGH')) return
            field.setCollapsed(!isCollapsed)
         }}
      >
         {p.children}
      </Frame>
   )
})
