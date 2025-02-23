// 💡 import type { RevealStateLazy } from '../reveal/RevealStateLazy'

import { makeAutoObservable } from 'mobx'
import { useEffect } from 'react'

import { hasMod } from '../accelerators/META_NAME'
import { isElemAChildOf } from '../utils/isElemAChildOf'
import { createObservableRef } from '../utils/observableRef'

export type HoveredRegion = {
   id: string
   type: string
   props: object
}

type HoveredCtx = {
   ctx: React.Context<any>
   value: any
}

export class RegionMonitor {
   // 💡 --------------------
   // 💡 reveals: Map<string, RevealStateLazy> = new Map()
   // 💡 hoveredReveal: Maybe<RevealStateLazy>
   // 💡 registerReveal(rls: RevealStateLazy): void {
   // 💡     if (this.reveals.has(rls.uid)) throw new Error(`[❌] reveal already registered`)
   // 💡     this.reveals.set(rls.uid, rls)
   // 💡 }
   // 💡
   // 💡 unregisterReveal(rls: RevealStateLazy): void {
   // 💡     if (!this.reveals.has(rls.uid)) throw new Error(`[❌] reveal not registered`)
   // 💡     this.reveals.delete(rls.uid)
   // 💡 }
   // 💡 --------------------

   constructor() {
      makeAutoObservable(this, { knownRegions: false })
   }

   currentlyFocused = createObservableRef<HTMLElement>()
   isWithin = (domSelector: string): boolean => {
      if (this.currentlyFocused.current == null) return false
      return isElemAChildOf(this.currentlyFocused.current, domSelector)
   }
   knownRegions: Map<string, HoveredCtx> = new Map()
   hoveredRegion: Maybe<HoveredRegion> = null
   hoveredPanel: Maybe<string> = null

   mouseX: number = 0
   mouseY: number = 0

   get hoveredCtx(): Maybe<HoveredCtx> {
      const id = this.hoveredRegion?.id
      if (id == null) return null
      const fo = this.knownRegions.get(id)
      if (fo == null) return null
      return fo
   }

   isOver<T>(ctx: React.Context<T>): Maybe<T> {
      const hoveredCtx = this.hoveredCtx
      if (hoveredCtx == null) return null
      if (hoveredCtx.ctx === ctx) return hoveredCtx.value
      return null
   }

   ctrl: boolean = false
   alt: boolean = false
   shift: boolean = false
   cmd: boolean = false
   mod: boolean = false

   get debugMods(): string {
      const out: string[] = []
      if (this.cmd) out.push('cmd')
      if (this.ctrl) out.push('ctrl')
      if (this.alt) out.push('alt')
      if (this.shift) out.push('shift')
      if (this.mod) out.push('mod')
      return out.join('+')
   }
}

/** singleton instance */
export const regionMonitor = new RegionMonitor()

// FORMAT: `Region-${type}-${id}`
/** watch every single event, and update the state */
export const useRegionMonitor = (): void => {
   useEffect(() => {
      function handleFocusEvent(event: FocusEvent): void {
         const elem = event.target
         // console.log(`[🔴] focus moved to`, elem)
         if (!(elem instanceof HTMLElement)) return
         regionMonitor.currentlyFocused.current = elem
      }

      function handleMouseEvent(event: MouseEvent): void {
         const target = event.target
         if (!(target instanceof HTMLElement)) {
            // console.log(`[❌] mouse event target is not HTMLElement`)
            return
         }

         regionMonitor.mouseX = event.clientX
         regionMonitor.mouseY = event.clientY

         // 1. find region ============================================================
         // walk upwards from the target until we find a region
         // TODO @rvion: slightly rewrite later
         let at: HTMLElement | null = target
         let hoveredRegion = undefined
         while (
            //
            hoveredRegion == null &&
            at &&
            !Array.from(at.classList).some((className) => className.includes('Region-'))
         ) {
            at = at.parentElement
            if (at) {
               const test = Array.from(at.classList).find((className) => className.includes('Region-'))
               if (test) hoveredRegion = test.split('-')
            }
         }
         // update state.hoveredRegion
         regionMonitor.hoveredRegion = hoveredRegion //
            ? { id: hoveredRegion[2]!, type: hoveredRegion[1]!, props: {} }
            : null

         // 2. find hovered panel ============================================================
         let currentPanel: string | null = null
         at = target
         while (at != null) {
            const pid = at.getAttribute('data-panel-id')
            if (pid != null) {
               currentPanel = pid
               break
            }
            at = at.parentElement
         }
         regionMonitor.hoveredPanel = currentPanel

         // 💡 2. find deepest reveal ============================================================
         // 💡 let currentRevealID: string | null = null
         // 💡 at = target
         // 💡 while (at != null) {
         // 💡     const pid = at.getAttribute('data-reveal-id')
         // 💡     if (pid != null) {
         // 💡         currentRevealID = pid
         // 💡         break
         // 💡     }
         // 💡     at = at.parentElement
         // 💡 }
         // 💡 if (currentRevealID) {
         // 💡     const currentReveal = regionMonitor.reveals.get(currentRevealID)
         // 💡     regionMonitor.hoveredReveal = currentReveal
         // 💡     if (currentReveal) {
         // 💡         // console.log(`[🤠]`, regionMonitor.hoveredReveal?.uid, event.type)
         // 💡         const type = event.type
         // 💡         // if (type === 'mousedown') currentReveal.onMouseDown(event)
         // 💡         // if (type === 'mouseup') currentReveal.onMouseUp(event)
         // 💡         if (type === 'mouseenter') currentReveal.onMouseEnter(event as any)
         // 💡         if (type === 'mouseleave') currentReveal.onMouseLeave(event as any)
         // 💡         if (type === 'click') currentReveal.onClick(event as any)
         // 💡         // if (type === 'mousemove') currentReveal.onMouseMove(event as any)
         // 💡         if (type === 'auxclick') currentReveal.onAuxClick(event as any)
         // 💡         if (type === 'contextmenu') currentReveal.onContextMenu(event as any)
         // 💡     }
         // 💡     // onContextMenu
         // 💡     // onClick
         // 💡     // onAuxClick
         // 💡     // onMouseEnter
         // 💡     // onMouseLeave
         // 💡 }
      }

      /* Update our modifiers to make keymap stuff easier, also can use anywhere now instead of just events. */
      function handleKeyEvent(event: KeyboardEvent): void {
         regionMonitor.cmd = event.metaKey
         regionMonitor.ctrl = event.ctrlKey
         regionMonitor.shift = event.shiftKey
         regionMonitor.alt = event.altKey
         regionMonitor.mod = hasMod(event)
      }

      window.addEventListener('mousedown', handleMouseEvent)
      window.addEventListener('mouseenter', handleMouseEvent)
      window.addEventListener('mouseleave', handleMouseEvent)
      window.addEventListener('mousemove', handleMouseEvent)
      window.addEventListener('mouseout', handleMouseEvent)
      window.addEventListener('mouseover', handleMouseEvent)
      window.addEventListener('mouseup', handleMouseEvent)
      // 💡 window.addEventListener('click', handleMouseEvent)
      // 💡 window.addEventListener('auxclick', handleMouseEvent)
      // 💡 window.addEventListener('contextmenu', handleMouseEvent)

      window.addEventListener('keydown', handleKeyEvent)
      window.addEventListener('keyup', handleKeyEvent)
      window.addEventListener('keypress', handleKeyEvent)

      window.addEventListener('focusin', handleFocusEvent)
      // window.addEventListener('focus', handleFocusEvent)
      // window.addEventListener('focusout', handleFocusEvent)

      return (): void => {
         window.removeEventListener('mousedown', handleMouseEvent)
         window.removeEventListener('mouseenter', handleMouseEvent)
         window.removeEventListener('mouseleave', handleMouseEvent)
         window.removeEventListener('mousemove', handleMouseEvent)
         window.removeEventListener('mouseout', handleMouseEvent)
         window.removeEventListener('mouseover', handleMouseEvent)
         window.removeEventListener('mouseup', handleMouseEvent)

         window.removeEventListener('keydown', handleKeyEvent)
         window.removeEventListener('keyup', handleKeyEvent)
         window.removeEventListener('keypress', handleKeyEvent)

         window.removeEventListener('focusin', handleFocusEvent)
         // window.removeEventListener('focus', handleFocusEvent)
         // window.removeEventListener('focusout', handleFocusEvent)
      }
   }, [])
}
