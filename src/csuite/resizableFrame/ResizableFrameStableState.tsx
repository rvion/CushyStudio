import { makeAutoObservable } from 'mobx'
import { createRef } from 'react'

import { clamp } from '../utils/clamp'
import { window_addEventListener } from '../utils/window_addEventListenerAction'
import { type ResizableFrameProps } from './resizableFrameUI'

/* Used once per widget since they should not conflict. */
let startValue: number = 0
let offset: number = 0

const defaultHeight: 200 /* px */ = 200
const defaultWidth: 200 /* px */ = 200

export class ResizableFrameStableState {
   showFooter?: boolean
   containerRef = createRef<HTMLDivElement>()

   constructor(public props: ResizableFrameProps) {
      this.height = props.currentSize ?? props.startHeight ?? defaultHeight
      this.width = props.currentSize ?? props.startWidth ?? defaultWidth
      this.showFooter = props.showFooter
      makeAutoObservable(this)
   }

   // #region HEIGHT
   height: number
   startResizingHeight = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      startValue = this.height
      offset = 0
      window_addEventListener('mousemove', this.resizeHeight, true)
      window_addEventListener('pointerup', this.stopResizingHeight, true)
      e.preventDefault()
      e.stopPropagation()
   }

   stopResizingHeight = (e: MouseEvent): void => {
      window.removeEventListener('mousemove', this.resizeHeight, true)
      window.removeEventListener('pointerup', this.stopResizingHeight, true)
      // Make sure to resize on stop to container, else the dragged value could be not in sync and the user will have to drag down a lot to fix.
      const ref = this.containerRef
      if (ref.current) this.height = ref.current.clientHeight
      e.preventDefault()
      e.stopPropagation()
   }

   resizeHeight = (e: MouseEvent): void => {
      e.preventDefault()
      e.stopPropagation()
      if (this.props.relative) return this.props.onResize?.(e.movementY)
      offset += e.movementY
      let next = startValue + offset
      if (this.props.snap != null && this.props.snap > 0)
         next = Math.round(next / this.props.snap) * this.props.snap
      next = clamp(next, 100, Number.MAX_SAFE_INTEGER)
      this.props.onResize?.(next)
      this.height = next
   }
   // #region WIDTH
   width: number
   startResizingWidth = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      startValue = this.width
      offset = 0
      window_addEventListener('mousemove', this.resizeWidth, true)
      window_addEventListener('pointerup', this.stopResizingWidth, true)
      e.preventDefault()
      e.stopPropagation()
   }

   stopResizingWidth = (e: MouseEvent): void => {
      window.removeEventListener('mousemove', this.resizeWidth, true)
      window.removeEventListener('pointerup', this.stopResizingWidth, true)
      // Make sure to resize on stop to container, else the dragged value could be not in sync and the user will have to drag down a lot to fix.
      const ref = this.containerRef
      if (ref.current) this.width = ref.current.clientWidth
      e.preventDefault()
      e.stopPropagation()
   }

   resizeWidth = (e: MouseEvent): void => {
      e.preventDefault()
      e.stopPropagation()
      if (this.props.relative) return this.props.onResize?.(e.movementX)
      offset += e.movementX
      let next = startValue + offset
      if (this.props.snap != null && this.props.snap > 0)
         next = Math.round(next / this.props.snap) * this.props.snap
      next = clamp(next, 100, Number.MAX_SAFE_INTEGER)
      this.props.onResize?.(next)
      this.width = next
   }
}
