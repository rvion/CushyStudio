import type { RevealProps } from './RevealProps'

import { makeAutoObservable } from 'mobx'
import React from 'react'

import { createObservableRef, type ObservableRef } from '../utils/observableRef'
import { DEBUG_REVEAL } from './DEBUG_REVEAL'
import { RevealState } from './RevealState'

/**
 * state wrapper that lazily initializes the actual state when actually required
 * it's important to keep that class lighweight.
 */
export class RevealStateLazy {
   static nextUID: number = 1
   uid: number = RevealStateLazy.nextUID++
   childRef = React.createRef<HTMLDivElement>()

   /**
    * stack of RevealStateLazy, from root,
    * including self as last item
    */
   readonly tower: RevealStateLazy[]
   readonly towerContext: { tower: RevealStateLazy[] }

   anchorRef: ObservableRef<HTMLDivElement> = createObservableRef()
   shellRef: ObservableRef<HTMLDivElement> = createObservableRef()
   constructor(
      public p: RevealProps,
      public parentsLazy: RevealStateLazy[],
   ) {
      // if (DEBUG_REVEAL) console.log(`💙 new RevealStateLazy (lazyId: ${this.uid} / props: ${p.placement})`)
      this.tower = [...parentsLazy, this]
      this.towerContext = { tower: this.tower }

      makeAutoObservable(this, {
         p: false,
         anchorRef: false, // 🚨 ref do not work when observables!
         shellRef: false, // 🚨 ref do not work when observables!
      })
   }

   state: RevealState | null = null

   getRevealState = (): RevealState => {
      if (this.state) return this.state
      this.state = new RevealState(this)
      if (DEBUG_REVEAL) this.state.log(`💙 init`)
      return this.state!
   }

   // all of those callbacks are for anchor ----------------------------------------
   onContextMenu = (ev: React.MouseEvent): void => {
      if (this.p.trigger === 'rightClick') {
         this.getRevealState().onRightClickAnchor(ev)
      }

      // lock input on shift+right click
      if (ev.shiftKey) {
         this.getRevealState().toggleLock()
         ev.preventDefault() //  = prevent window on non-electron apps
         ev.stopPropagation()
      }
   }

   onClick = (ev: React.MouseEvent): void => {
      return this.getRevealState().onLeftClickAnchor(ev)
   }
   onDoubleClick = (ev: React.MouseEvent): void => {
      return this.getRevealState().onDoubleClickAnchor(ev)
   }
   // 🧑‍🎤 onMouseDown = (ev: React.MouseEvent<unknown>): void => {
   // 🧑‍🎤     return this.getRevealState().onMouseDownAnchor(ev)
   // 🧑‍🎤 }
   // 🧑‍🎤 onMouseUp = (ev: React.MouseEvent<unknown>): void => {
   // 🧑‍🎤     return this.getRevealState().onMouseUpAnchor(ev)
   // 🧑‍🎤 }
   onAuxClick = (ev: React.MouseEvent): void => {
      if (ev.button === 1) return this.getRevealState().onMiddleClickAnchor(ev)
      if (ev.button === 2) return this.getRevealState().onRightClickAnchor(ev)
   }
   onMouseEnter = (ev: React.MouseEvent): void => {
      return this.getRevealState().onMouseEnterAnchor(ev)
   }
   onMouseLeave = (ev: React.MouseEvent): void => {
      return this.getRevealState().onMouseLeaveAnchor(ev)
   }
   onFocus = (ev: React.FocusEvent): void => {
      return this.getRevealState().onFocusAnchor(ev)
   }
   onBlur = (ev: React.FocusEvent): void => {
      return this.getRevealState().onBlurAnchor(ev)
   }
   onKeyDown = (ev: React.KeyboardEvent): void => {
      return this.getRevealState().onAnchorKeyDown(ev)
   }
}
