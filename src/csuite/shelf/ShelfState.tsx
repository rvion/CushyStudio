import type { OwnShelfProps } from './ShelfUI'

import { makeAutoObservable } from 'mobx'

import { window_addEventListener } from '../utils/window_addEventListenerAction'

let startValue: number = 0

export class ShelfState {
   constructor(
      //
      public props: OwnShelfProps,
   ) {
      this.size = props.defaultSize ?? 200
      makeAutoObservable(this)
   }

   // having a function makes it automatically an action
   syncProps(p: Partial<OwnShelfProps>): void {
      Object.assign(this.props, p)
   }

   size: number
   dragging: boolean = false

   begin = (): void => {
      startValue = this.size

      this.dragging = true
      window_addEventListener('mousemove', this.onMouseMove, true)
      window_addEventListener('pointerup', this.end, true)
      window_addEventListener('mousedown', this.cancel, true)
      window_addEventListener('keydown', this.cancel, true)
   }

   cancel = (ev: MouseEvent | KeyboardEvent): void => {
      // Only cancel if right click
      if (ev instanceof MouseEvent && ev.button != 2) {
         return
      }

      if (ev instanceof KeyboardEvent && ev.key != 'Escape') {
         return
      }

      this.size = startValue
      this.end()
   }

   onMouseMove = (ev: MouseEvent): void => {
      // prettier-ignore
      switch (this.props.anchor) {
            case 'left':   return void (this.size += ev.movementX)
            case 'right':  return void (this.size -= ev.movementX)
            case 'bottom': return void (this.size += ev.movementY)
            case 'top':    return void (this.size -= ev.movementY)
        }
   }

   end = (): void => {
      this.dragging = false
      window.removeEventListener('mousemove', this.onMouseMove, true)
      window.removeEventListener('pointerup', this.end, true)
      window.removeEventListener('mousedown', this.cancel, true)
      window.removeEventListener('keydown', this.cancel, true)
   }

   isHorizontal = (): boolean => {
      return this.props.anchor == 'left' || this.props.anchor == 'right'
   }

   computeResizeAnchor = (): 'right' | 'left' | 'top' | 'bottom' => {
      // prettier-ignore
      switch (this.props.anchor) {
            case 'left':   return 'right'
            case 'right':  return 'left'
            case 'bottom': return 'top'
            case 'top':    return 'bottom'
        }
   }
}
