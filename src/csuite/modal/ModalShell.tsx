import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'

export type ModalShellSize = 'xs' | 'sm' | 'lg' | 'xl'

export const ModalShellUI = observer(function ModalShellUI_(p: {
   size?: ModalShellSize
   title?: React.ReactNode
   className?: string
   style?: CSSProperties
   children?: React.ReactNode
   footer?: React.ReactNode | undefined
   onClick?: (ev: React.MouseEvent<unknown, MouseEvent>) => void
   close: () => void
}) {
   return (
      <Frame
         border
         style={p.style}
         className={p.className}
         col
         tw={['animate-in fade-in', 'p-2 shadow-xl']}
         onClick={(ev) => p.onClick?.(ev)}
      >
         {/* HEADER */}
         <div tw='flex'>
            <div tw='text-xl'>{p.title}</div>
            <div tw='flex-1'></div>
            <Button
               subtle
               square
               icon='mdiClose'
               onClick={(ev) => {
                  ev.stopPropagation()
                  ev.preventDefault()
                  p.close()
               }}
            />
         </div>
         {/* BODY */}
         <div tw='_ModalBody flex flex-1 flex-col'>{p.children}</div>
         {/* FOOTER */}
         {p.footer && <div tw='_ModalFooter'>{p.footer}</div>}
      </Frame>
   )
})
