import { observer } from 'mobx-react-lite'

import { usePanel } from '../../router/usePanel'
import { Button } from '../button/Button'
import { MenuItem } from '../dropdown/MenuItem'
import { Frame, type FrameProps } from '../frame/Frame'
import { RevealUI } from '../reveal/RevealUI'

/**
 * Re-usable Dock-Panel Header, gives a full width bar and a horizontal flex to put widgets in.
 *
 * `NOTE`: It will automatically set the height of any child widgets.
 *
 * Example:
 *
 * ```
 * <PanelHeaderUI>
 *      <Button>Hello World!<Button>
 * </PanelHeaderUI>
 * ```
 */
export const PanelHeaderUI = observer(function PanelHeader({
   // own props ---------------------------------------------------------------------
   /** extensible flag makes the panel header have minh-widget instead of h-widget */
   extensibleHeight,
   title,

   // modified ----------------------------------------------------------------------
   children,

   // rest ---------------------------------------------------------------------------
   ...rest
}: {
   extensibleHeight?: boolean
   title?: string
   //
} & FrameProps) {
   const state = usePanel()

   if (!state.showHeader) {
      return false
   }

   return (
      <RevealUI
         debugName='<Show-Header>'
         trigger='rightClick'
         relativeTo='mouse'
         content={() => (
            <MenuItem //
               label='Show Header'
               icon={state.showHeader ? 'mdiCheck' : 'mdiCheckboxBlank'}
               onClick={() => (state.showHeader = !state.showHeader)}
            />
         )}
      >
         <Frame // Container
            base={{ contrast: 0.08 /* hueShift: 100 */ /* chromaBlend: 2 */ }}
            tw={[
               //
               'sticky top-0 [z-index:999]',
               'px-1',
               extensibleHeight ? 'minh-widget shrink-0' : 'h-widget',
               'UI-PanelHeader',
               'CSHY-panel-header',
               'flex select-none gap-1',
               'overflow-auto',
               'items-center',
               // 'flex-wrap',
            ]}
            onWheel={(event) => {
               event.currentTarget.scrollLeft += event.deltaY
               event.stopPropagation()
            }}
            {...rest}
         >
            {title && <div>{title}</div>}
            {children}
         </Frame>
      </RevealUI>
   )
})
