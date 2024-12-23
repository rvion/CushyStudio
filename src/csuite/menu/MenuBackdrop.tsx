// TODO: FINISH THIS 🔴🔴
import type { MenuInstance } from './MenuInstance'

import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'

export const MenuBackdropUI = observer(function MenuBackdropUI_(p: {
   //
   menuInst: MenuInstance
   x1: number
   y1: number
   x2: number
   y2: number
}) {
   const onClick = useCallback(() => p.menuInst.close(), [])
   const w = window.innerHeight
   const h = window.innerWidth
   return (
      <>
         {/* top */}
         <div tw='absolute' style={{ top: 0, left: 0, right: 0, bottom: p.y1 }} onClick={onClick}></div>
         {/* left */}
         <div tw='absolute' style={{ top: 0, left: 0, right: p.x1, bottom: 0 }} onClick={onClick}></div>
         {/* right */}
         <div tw='absolute' style={{ top: 0, left: p.x2, right: 0, bottom: 0 }} onClick={onClick}></div>
         {/* bottom */}
         <div tw='absolute' style={{ top: p.y2, left: 0, right: 0, bottom: 0 }} onClick={onClick}></div>
      </>
   )
})
