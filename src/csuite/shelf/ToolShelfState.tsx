import type { ToolShelfProps } from './ToolShelfUI'

import { makeAutoObservable } from 'mobx'

import { window_addEventListener } from '../utils/window_addEventListenerAction'

let startValue: number = 0
export class ToolShelfState {
   constructor(public props: ToolShelfProps) {
      this.size = props.defaultSize ?? 128
      props.panelState.size = this.size
      makeAutoObservable(this)
   }

   size: number
   dragging: boolean = false

   begin = (): void => {
      startValue = this.size = this.props.panelState.size

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
      this.props.panelState.size = startValue
      this.end()
   }

   onMouseMove = (ev: MouseEvent): void => {
      switch (this.props.anchor) {
         case 'left':
            this.size += ev.movementX
            break
         case 'right':
            this.size -= ev.movementX
            break
         case 'bottom':
            this.size += ev.movementY
            break
         case 'top':
            this.size -= ev.movementY
            break
      }

      const iconSize = cushy.preferences.interface.value.toolBarIconSize
      const pState = this.props.panelState
      if (this.size <= iconSize * 0.5) {
         pState.size = 0
         return
      }
      if (this.size <= iconSize * 2) {
         pState.size = Math.round(this.size / iconSize) * iconSize
         return
      }

      this.props.panelState.size = this.size
   }

   end = (): void => {
      this.dragging = false
      window.removeEventListener('mousemove', this.onMouseMove, true)
      window.removeEventListener('pointerup', this.end, true)
      window.removeEventListener('mousedown', this.cancel, true)
      window.removeEventListener('keydown', this.cancel, true)

      const pState = this.props.panelState
      if (pState.size == 0) {
         pState.visible = false
         // Makes sure to regrow to original size on show if the panel was collapsed from a drag by the user instead of hidden by a shortcut
         pState.size = startValue
      }
   }

   isHorizontal = (): boolean => {
      return this.props.anchor == 'left' || this.props.anchor == 'right'
   }

   computeResizeAnchor = (): 'right' | 'left' | 'top' | 'bottom' => {
      switch (this.props.anchor) {
         case 'left':
            return 'right'
         case 'right':
            return 'left'
         case 'bottom':
            return 'top'
         case 'top':
            return 'bottom'
      }
   }

   show = (): void => {
      this.props.panelState.visible = true
   }

   /** Hides the panel, do not adjust the size here as we return to that size when shown. */
   hide = (): void => {
      this.props.panelState.visible = false
   }
}
