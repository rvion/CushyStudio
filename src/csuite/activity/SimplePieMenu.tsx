import type { Menu } from '../menu/Menu'
import type { Activity } from './Activity'
import type { Routine } from './Routine'
import type { FC, KeyboardEvent, MouseEvent } from 'react'

import { MenuPieUI } from '../menu/MenuPieUI'

export class CPie implements Activity {
   constructor(public menu: Menu) {}

   /** WILL BE Re-INITALIZED in onStart() */

   startX: number = 0
   startY: number = 0

   lastX: number = 0
   lastY: number = 0

   get width(): number {
      return this.lastX - this.startX
   }
   get height(): number {
      return this.lastY - this.startY
   }

   get x(): number {
      return this.lastX
   }

   get y(): number {
      return this.lastY
   }

   offsetFromStart: number = 0
   offsetFromLast: number = 0
   euclidianDistanceFromStart: number = 0
   shiftKey: boolean = false

   // onKeyUp(ev: KeyboardEvent): void {
   //     // console.log(`[🐭🐭🐭] key up`)
   //     this.p.onKeyUp?.(ev.key, this)
   // }
   onKeyDown(ev: KeyboardEvent, routine: Routine): void {
      console.log(`[💩] SimpleMouseActivity is receiving an activity`)
      // console.log(`[🐭🐭🐭] key up`)
      // this.p.onKeyDown?.(ev.key, this, routine)
   }

   onStart(): void {
      // console.log(`[🐭🐭🐭] start`)
      this.startX = cushy.region.mouseX
      this.startY = cushy.region.mouseY

      this.lastX = cushy.region.mouseX
      this.lastY = cushy.region.mouseY

      // this.p.onStart?.(this)
   }

   private _updateInfo = (event: MouseEvent): void => {
      this.lastX = event.clientX
      this.lastY = event.clientY
      this.offsetFromStart = event.clientX - this.startX
      this.offsetFromLast = event.clientX - this.startX
      this.euclidianDistanceFromStart = Math.sqrt(
         (event.clientX - this.startX) ** 2 + (event.clientY - this.startY) ** 2,
      )
      this.shiftKey = event.shiftKey
   }

   onMouseMove(event: MouseEvent, routine: Routine): void {
      this._updateInfo(event)
      // this.p.onMove?.(this, routine)
   }

   onMouseUp(event: MouseEvent, routine: Routine): void {
      const btn = event.button
      routine.stop()
   }
   UI: FC<{ activity: Activity; routine: Routine; stop: () => void }> | undefined = () => {
      return <MenuPieUI startX={this.startX} startY={this.startY} menu={this.menu.init()} />
   }
}
