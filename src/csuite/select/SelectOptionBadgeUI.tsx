import type { BadgeProps } from '../badge/BadgeUI'

import { observer } from 'mobx-react-lite'

import { BadgeUI } from '../badge/BadgeUI'
import { Frame } from '../frame/Frame'

export const SelectDefaultOptionUI = observer(function SelectDefaultOptionUI_({
   // own
   label,
   closeFn,
   link,

   // modified
   autoHue,
   children, // need to to override ?

   // rest
   ...rest
}: {
   /** link to some other page */
   link?: () => string
   label?: string
   closeFn?: () => void
} & BadgeProps) {
   if (label == null && typeof children === 'string') {
      label = children
      children = null
   }
   return (
      <BadgeUI //
         autoHue={autoHue ?? label}
         linkButton={link ? (): void => (window as any).loco.router.goToURL(link()) : undefined}
         {...rest}
      >
         {label}
         {children}
         {closeFn && (
            <Frame
               tw='ml-1 cursor-pointer'
               hover
               onFocus={(ev) => {
                  ev.stopPropagation()
                  ev.preventDefault()
               }}
               onClick={(ev) => {
                  // console.log(`[🤠] UUUU`)
                  closeFn()
                  ev.preventDefault()
                  ev.stopPropagation()
               }}
               icon='mdiClose'
               iconSize='0.8rem'
            />
         )}
      </BadgeUI>
   )
})
