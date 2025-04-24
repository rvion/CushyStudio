import type { Field } from '../model/Field'

import { ErrorBoundaryUI } from '../errors/ErrorBoundaryUI'
import { Frame, type FrameProps } from '../frame/Frame'

export type WidgetHeaderContainerProps = {
   field: Field
} & FrameProps

export const WidgetHeaderContainerUI = obs(function WidgetHeaderContainerUI_({
   // own
   field,

   // modified
   triggerOnPress,
   onClick,

   // rest
   ...rest
}: WidgetHeaderContainerProps) {
   const isCollapsed = field.zIsCollapsed
   return (
      <ErrorBoundaryUI>
         <Frame
            tw={[
               'COLLAPSE-PASSTHROUGH',
               'flex min-w-0 flex-1 select-none gap-0.5',

               // 💬 2024-10-10 rvion:
               // 'h-widget',
               // 'UI-WidgetHeaderContainer',

               // 💬 2024-06-03 rvion, changing 'items-center' to 'items-start'
               // as well as adding some `h-input` class to <WidgetLabelContainerUI />
               'items-start',
            ]}
            // hover={2} // 🚂 we prefer to not have this hover
            triggerOnPress={triggerOnPress ?? { startingState: isCollapsed, toggleGroup: 'collapse' }}
            onClick={
               onClick ??
               ((ev): void => {
                  if (ev.button != 0 || !field.zIsCollapsible) return
                  const target = ev.target as HTMLElement
                  if (!target.classList.contains('COLLAPSE-PASSTHROUGH')) return
                  field.zSetCollapsed(!isCollapsed)
               })
            }
            {...rest}
         />
      </ErrorBoundaryUI>
   )
})
