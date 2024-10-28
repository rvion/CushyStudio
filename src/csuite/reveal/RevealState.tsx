import type { NO_PROPS } from '../types/NO_PROPS'
import type { RevealStateLazy } from './RevealStateLazy'
import type { RevealContentProps } from './shells/ShellProps'
import type { CSSProperties, FC, ReactNode } from 'react'

import { makeAutoObservable, observable } from 'mobx'

import { hasMod } from '../accelerators/META_NAME'
import { getUIDForMemoryStructure } from '../utils/getUIDForMemoryStructure'
import { isElemAChildOf } from '../utils/isElemAChildOf'
import { toCssSizeValue } from '../utils/toCssSizeValue'
import { DEBUG_REVEAL } from './DEBUG_REVEAL'
import { RevealCloseEvent } from './RevealCloseEvent'
import { removeFromGlobalRevealStack } from './RevealGlobal'
import { computePlacement, type RevealComputedPosition, type RevealPlacement } from './RevealPlacement'
import {
   type RevealHideReason,
   type RevealHideTriggers,
   type RevealOpenReason,
   type RevealPreset,
   type RevealPresetName,
   revealPresets,
   type RevealProps,
   type RevealShowTriggers,
} from './RevealProps'
import { global_RevealStack } from './RevealStack'

export const defaultShowDelay_whenRoot = 100
export const defaultHideDelay_whenRoot = 300

export const defaultShowDelay_whenNested = 0
export const defaultHideDelay_whenNested = 0

export class RevealState {
   static shared: { current: Maybe<RevealState> } = observable({ current: null }, { current: observable.ref })
   uid: number

   get showBackdrop(): boolean {
      return this.p.showBackdrop ?? true
   }

   onMiddleClickAnchor = (ev: React.MouseEvent<unknown>): void => {
      this.logEv(ev, `anchor.onMiddleClick`)
      // this.onLeftClick(ev)
   }

   onRightClickAnchor = (ev: React.MouseEvent<unknown>): void => {
      this.logEv(ev, `anchor.onRightClick`)
      const closed = !this.isVisible
      if (closed) {
         if (this.shouldShowOnAnchorRightClick) {
            this.open('rightClickAnchor')
            ev.stopPropagation()
            ev.preventDefault()
         }
      } else {
         if (this.shouldHideOnAnchorRightClick) {
            this.close('rightClickAnchor')
            ev.stopPropagation()
            ev.preventDefault()
         }
      }
      // this.onLeftClickAnchor(ev) // 2024-07-31 domi: not sure what the use-case is, but annoying when you want to inspect the element
   }

   onLeftClickAnchor = (ev: React.MouseEvent<unknown>): void => {
      this.logEv(ev, `onLeftClickAnchor (visible: ${this.isVisible ? '🟢' : '🔴'})`)
      const closed = !this.isVisible
      if (closed) {
         if (this.shouldShowOnAnchorClick) {
            this.open('leftClickAnchor')
            ev.stopPropagation()
            ev.preventDefault()
         }
      } else {
         if (this.shouldHideOnAnchorClick) {
            this.close('leftClickAnchor')
            ev.stopPropagation()
            ev.preventDefault()
         }
      }
   }

   onDoubleClickAnchor = (ev: React.MouseEvent<unknown>): void => {
      this.logEv(ev, `onDoubleClickAnchor (visible: ${this.isVisible ? '🟢' : '🔴'})`)
      const closed = !this.isVisible
      if (closed) {
         if (this._EVALBOOL(this.showTriggers.anchorDoubleClick)) {
            this.open('doubleClickAnchor')
            ev.stopPropagation()
            ev.preventDefault()
         }
      }
      // else {
      //    if (this.shouldHideOnAnchorClick) {
      //       this.close('leftClickAnchor')
      //       ev.stopPropagation()
      //       ev.preventDefault()
      //    }
      // }
   }

   // 🧑‍🎤 _mouseDown = false

   // 🧑‍🎤 onMouseDownAnchor = (ev: React.MouseEvent<unknown>): void => {
   // 🧑‍🎤     // 🔴 why onMouseDownAnchor,onBlurAnchor and onFocusAnchor
   // 🧑‍🎤     // are called when clicking/blurring/focusing the shell ?!
   // 🧑‍🎤     // https://github.com/facebook/react/issues/19637
   // 🧑‍🎤     // => we don't want that to be triggered here
   // 🧑‍🎤     // if (isChildOf('_RevealUI', ev.target as HTMLElement)) return
   // 🧑‍🎤     // console.log(`   >>> target: `,isChildOf('_RevealUI', ev.target as HTMLElement), ev.target)
   // 🧑‍🎤     // console.log(`   >>> currentTarget: `,isChildOf('_RevealUI', ev.currentTarget as HTMLElement), ev.currentTarget)
   // 🧑‍🎤     // console.log(`   >>> relatedTarget: `,isChildOf('_RevealUI', ev.relatedTarget as HTMLElement), ev.relatedTarget)
   // 🧑‍🎤     this.logEv(ev, `anchor.onMouseDown ❓`)
   // 🧑‍🎤     this._mouseDown = true
   // 🧑‍🎤 }

   // 🧑‍🎤 onMouseUpAnchor = (ev: React.MouseEvent<unknown>): void => {
   // 🧑‍🎤     this.logEv(ev, `anchor.onMouseUp`)
   // 🧑‍🎤     this._mouseDown = false
   // 🧑‍🎤 }

   /**
    * manuall assigned here on init so it can be made observable
    * on its own, without the need to make the entire props observable
    * so we can then hot-reload it nicely and have a nicer dev experience
    */
   // contentFn: () => ReactNode
   contentFn: FC<NO_PROPS>

   /** props to pass  */
   get revealContentProps(): RevealContentProps {
      return { reveal: this }
   }

   p: RevealProps
   readonly parents: RevealState[]
   anchorRef: React.RefObject<HTMLDivElement> // 🚨 ref do not work when observables!

   constructor(public lazyState: RevealStateLazy) {
      this.p = { ...lazyState.p }
      this.parents = lazyState.parentsLazy.map((lazy) => lazy.getRevealState())
      this.anchorRef = lazyState.anchorRef
      this.uid = lazyState.uid
      // see comment above
      this.contentFn = (): ReactNode => {
         const Component = this.p.content
         if (Component == null) return null
         return <Component reveal={this} />
      }

      // 💬 2024-03-06 YIKES !!
      // | Reveal UI was causing
      // |
      // | 📈 const stop = spy((ev) => {
      // | 📈     console.log(`[🤠] ev`, ev)
      // | 📈 })
      makeAutoObservable(this, {
         uid: false,
         p: false,
         parents: false,
         PREVENT_DOUBLE_OPEN_CLOSE_DELAY: false,
         delaySinceLastOpenClose: false,
         anchorRef: false, // 🚨 ref do not work when observables!
      })

      // | 📈 stop()
   }

   // ------------------------------------------------
   inAnchor = false
   inTooltip = false
   subRevealsCurrentlyVisible = new Set<number>()

   /** how deep in the reveal stack we are */
   get depth(): number {
      return this.parents.length
   }

   // #region DEBUG
   get debugColor(): CSSProperties {
      return {
         borderLeft: this.inAnchor ? `3px solid red` : undefined,
         borderTop: this.inTooltip ? `3px solid cyan` : undefined,
         borderBottom: this.subRevealsCurrentlyVisible.size > 0 ? `3px solid orange` : undefined,
      }
   }

   /** toolip is visible if either inAnchor or inTooltip */
   get isVisible(): boolean {
      if (this._lock) return true
      return this.inAnchor || this.inTooltip || this.subRevealsCurrentlyVisible.size > 0
   }

   // #region PRESETS
   get showTriggers(): RevealShowTriggers {
      return this.p.showTriggers ?? this.preset.show
   }

   get hideTriggers(): RevealHideTriggers {
      return this.p.hideTriggers ?? this.preset.hide
   }

   private get preset(): RevealPreset {
      return this._EVALPRESETS(this.p.trigger ?? 'click')
   }

   private _EVALPRESETS(p: RevealPresetName | RevealPresetName[]): RevealPreset {
      if (Array.isArray(p)) {
         const out: RevealPreset = { show: {}, hide: {} }
         for (const preset of p) {
            const { show, hide } = revealPresets[preset]
            Object.assign(out.show, show)
            Object.assign(out.hide, hide)
         }
         return out
      }
      return revealPresets[p]
   }

   // #region HIDE TRIGGERS
   get shouldHideOnAnchorBlur(): boolean {
      return this.hideTriggers.blurAnchor ?? false
   }

   get shouldHideOnKeyboardEscape(): boolean {
      return this.hideTriggers.escapeKey ?? false
   }

   get shouldHideOnAnchorClick(): boolean {
      return this.hideTriggers.clickAnchor ?? false
   }

   get shouldHideOnAnchorOrTooltipMouseLeave(): boolean {
      return this.hideTriggers.mouseOutside ?? false
   }

   get shouldHideOnBackdropClick(): boolean {
      return this.hideTriggers.backdropClick ?? false
   }

   get shouldHideOnShellClick(): boolean {
      return this.hideTriggers.shellClick ?? false
   }

   private _EVALBOOL(
      b: boolean | undefined | ((self: RevealState, SELF: typeof RevealState) => boolean | undefined),
   ): boolean {
      if (typeof b === 'function') return b(this, RevealState) ?? false
      return b ?? false
   }

   get shouldHideOnAnchorRightClick(): boolean {
      return this._EVALBOOL(this.showTriggers.anchorRightClick)
   }

   // #region SHOW TRIGGERS
   get shouldShowOnAnchorFocus(): boolean {
      return this._EVALBOOL(this.showTriggers.anchorFocus)
   }

   get shouldShowOnKeyboardEnterOrLetterWhenAnchorFocused(): boolean {
      return this._EVALBOOL(this.showTriggers.keyboardEnterOrLetterWhenAnchorFocused)
   }

   get shouldShowOnAnchorClick(): boolean {
      return this._EVALBOOL(this.showTriggers.anchorClick)
   }

   get shouldShowOnAnchorRightClick(): boolean {
      return this._EVALBOOL(this.showTriggers.anchorRightClick)
   }

   get shouldShowOnAnchorHover(): boolean {
      return this._EVALBOOL(this.showTriggers.anchorHover)
   }

   // #region DELAYS
   // possible triggers ------------------------------------------------------
   get showDelay(): number {
      return this.p.showDelay ?? (this.depth ? defaultShowDelay_whenNested : defaultShowDelay_whenRoot)
   }

   get hideDelay(): number {
      return this.p.hideDelay ?? (this.depth ? defaultHideDelay_whenNested : defaultHideDelay_whenRoot)
   }

   get placement(): RevealPlacement {
      return this.p.placement ?? 'auto'
   }

   // position --------------------------------------------
   /** alias for this.tooltipPosition */
   get pos(): RevealComputedPosition {
      return this.tooltipPosition
   }

   get posCSS(): CSSProperties {
      const pos = this.pos
      // ⏸️ console.log(`[🤠] pos`, JSON.stringify(pos, null, 4))
      const out: CSSProperties = {
         position: 'absolute',
         zIndex: 99999999,
         top: pos.top != null ? toCssSizeValue(pos.top) : undefined,
         left: pos.left != null ? toCssSizeValue(pos.left) : undefined,
         bottom: pos.bottom != null ? toCssSizeValue(pos.bottom) : undefined,
         right: pos.right != null ? toCssSizeValue(pos.right) : undefined,
         width: pos.width != null ? toCssSizeValue(pos.width) : undefined,
         height: pos.height != null ? toCssSizeValue(pos.height) : undefined,
         maxWidth: pos.maxWidth != null ? toCssSizeValue(pos.maxWidth) : undefined,
         maxHeight: pos.maxHeight != null ? toCssSizeValue(pos.maxHeight) : undefined,
         minWidth: pos.minWidth != null ? toCssSizeValue(pos.minWidth) : undefined,
         minHeight: pos.minHeight != null ? toCssSizeValue(pos.minHeight) : undefined,
         overflow: 'auto',
         transform: pos.transform,
      }
      // ⏸️ console.log(`[🤠] posCSS`, JSON.stringify(out, null, 4))
      return out
   }
   tooltipPosition: RevealComputedPosition = { top: 0, left: 0 }
   setPosition = (rect: DOMRect | null): void => {
      this.tooltipPosition = computePlacement(this.placement, rect)
   }

   // lock --------------------------------------------
   _lock = false
   toggleLock = (): void => {
      this._lock = !this._lock
   }

   // UI --------------------------------------------
   get defaultCursor(): string {
      if (!this.shouldShowOnAnchorHover) return 'cursor-pointer'
      return 'cursor-help'
   }

   // anchor --------------------------------------------
   enterAnchorTimeoutId: NodeJS.Timeout | null = null
   leaveAnchorTimeoutId: NodeJS.Timeout | null = null

   onMouseEnterAnchor = (ev: React.MouseEvent<unknown>): void => {
      this.logEv(ev, `anchor.onMouseEnter`)
      // console.log(`[🔴] ${this.uid}`, this.parents.length, `| curr=${RevealState.shared.current?.uid}`)

      /* 🔥 */ if (this.isVisible) return
      /* 🔥 */ if (!this.shouldShowOnAnchorHover) return
      /* 🔥 */ if (RevealState.shared.current) return this.open('mouse-enter-anchor-(no-parent-open)')
      this._resetAllAnchorTimouts()
      this.enterAnchorTimeoutId = setTimeout(
         () => this.open('mouse-enter-anchor-(with-parent-open)'),
         this.showDelay,
      )
   }

   onMouseLeaveAnchor = (ev: React.MouseEvent<unknown>): void => {
      this.logEv(ev, `anchor.onMouseLeave`)
      if (!this.shouldHideOnAnchorOrTooltipMouseLeave) return
      this._resetAllAnchorTimouts()
      this.leaveAnchorTimeoutId = setTimeout(() => this.close('mouseOutside'), this.hideDelay)
   }

   /** push self in tower stack */
   private _register(): void {
      global_RevealStack.push(this)
   }

   private _unregister(): void {
      const ix = global_RevealStack.indexOf(this)
      if (ix >= 0) global_RevealStack.splice(ix, 1)
   }

   /**
    * direct parent
    */
   get parent(): RevealState | undefined {
      return this.parents[this.parents.length - 1]
   }

   // #region OPEN
   open = (reason: RevealOpenReason): void => {
      if (this.isVisible) return

      // ensure parents are properly opened first
      if (!this.parent?.isVisible) console.warn(`[🔶] INVARIANT VIOLATION IN REVEAL STATE`)
      // 🔴 if (this.parent && !this.parent.isVisible) {
      // 🔴     this.parent.open('child-is-opening-so-as-parent-I-must-open-too')
      // 🔴 }

      this.log(`🚨 open (reason=${reason})`)
      this._register()
      this.lastOpenClose = Date.now()
      const wasVisible = this.isVisible

      // close previous branches from common ancestor
      if (this.shouldCloseOthersonOpen) {
         // 💬 2024-10-09 rvion:
         // | this logic was too simplistic
         // |```
         // | RevealState.shared.current?.close('an-other-reveal-opened')
         // |```
         // sometimes, we jump from some sub-sub menu at depth=5 directly to anchor at depth 2
         // so we need to close all siblings until that depth
         RevealState.shared.current?.closeUpTo(this.depth, 'an-other-reveal-opened')
      }

      /* 🔥 */ RevealState.shared.current = this
      this._resetAllAnchorTimouts()
      this.inAnchor = true

      if (!wasVisible) this.p.onRevealed?.(this)
   }

   get shouldCloseOthersonOpen(): boolean {
      const current = RevealState.shared.current
      if (current == null) return false
      if (current === this) return false
      if (this.parents.includes(current)) return false
      if (current.p.defaultVisible) return false
      return true
   }

   // #region CLOSE
   closeUpTo = (depth: number, reason: RevealHideReason): void => {
      // eslint-disable-next-line consistent-this
      let at: Maybe<RevealState> = this
      while (at != null && at.depth >= depth) {
         at.close(reason)
         at = at.parent
      }
   }

   close = (reason?: RevealHideReason): void => {
      if (!this.isVisible) return this.log(`🔴 attempting to close BUT already closed ! (reason=${reason})`)
      this.log(`🚨 close (reason=${reason})`)

      if (this.p.onBeforeHide) {
         const event = new RevealCloseEvent(reason || 'unknown')
         this.p.onBeforeHide(event)
         if (event.isDefaultPrevented) return
      }

      // To avoid relying on the render loop to update the global stack
      // we remove the lazy state from the global stack as soon as we know it's closed
      removeFromGlobalRevealStack(this.lazyState)

      this._unregister()
      this.lastOpenClose = Date.now()
      const wasVisible = this.isVisible
      /* 🔥 */ if (RevealState.shared.current == this) {
         if (this.parent?.isVisible) {
            RevealState.shared.current = this.parent
         } else {
            RevealState.shared.current = null
         }
      }
      this._resetAllAnchorTimouts()
      this._resetAllTooltipTimouts()
      this.inAnchor = false
      this.inTooltip = false

      // if we're closing, all our children also are closed.
      // so we can safely clean the state and forget about previous
      this.subRevealsCurrentlyVisible.clear()

      // 🔴 are children closed properly?

      if (wasVisible) {
         this.p.onHidden?.(reason ?? 'unknown')

         // 🔶 when should we focus anchor on close?
         // (ex: escape while in popup should probably focus the anchor?)
         // (ex: clicking outside the popup should probably focus the anchor?)
         // (ex: programmatically or whatever random reason closes the select, should NOT focus the anchor?)
         // (ex: tab should probably go to the next select, NOT focus this anchor? => done in Tab handling)
         if (
            reason === 'programmatic' || //
            reason === 'an-other-reveal-opened'
         )
            return

         // TODO: review that:
         // if we entered via hover, the closure is likely not like a click on
         // the anchor (need clearer implementation though)
         if (this._EVALBOOL(this.p.showTriggers?.anchorHover)) return

         if (this.anchorRef.current == null) console.log('❌ anchorRef is null?!')
         this.anchorRef.current?.focus()
      }
   }

   // ---
   private _resetAllAnchorTimouts = (): void => {
      this._resetAnchorEnterTimeout()
      this._resetAnchorLeaveTimeout()
   }

   private _resetAnchorEnterTimeout = (): void => {
      if (this.enterAnchorTimeoutId) {
         clearTimeout(this.enterAnchorTimeoutId)
         this.enterAnchorTimeoutId = null
      }
   }

   private _resetAnchorLeaveTimeout = (): void => {
      if (this.leaveAnchorTimeoutId) {
         clearTimeout(this.leaveAnchorTimeoutId)
         this.leaveAnchorTimeoutId = null
      }
   }

   // tooltip --------------------------------------------
   private enterTooltipTimeoutId: NodeJS.Timeout | null = null
   private leaveTooltipTimeoutId: NodeJS.Timeout | null = null

   onMouseEnterTooltip = (ev?: React.MouseEvent<unknown, MouseEvent>): void => {
      this.logEv(ev, `onMouseEnterTooltip`)
      this._resetAllTooltipTimouts()
      this.enterTooltipTimeoutId = setTimeout(this.enterTooltip, this.showDelay)
   }

   onMouseLeaveTooltip = (ev?: React.MouseEvent<unknown, MouseEvent>): void => {
      this.logEv(ev, `onMouseLeaveTooltip`)
      if (!this.shouldHideOnAnchorOrTooltipMouseLeave) return
      this._resetAllTooltipTimouts()
      this.leaveTooltipTimeoutId = setTimeout(this.leaveTooltip, this.hideDelay)
   }

   // ---
   private enterTooltip = (): void => {
      this._resetAllTooltipTimouts()
      for (const [ix, p] of this.parents.entries()) p.enterChildren(ix)
      this.log(`🔶 enterTooltip`)
      this.inTooltip = true
   }

   private leaveTooltip = (): void => {
      this._resetAllTooltipTimouts()
      for (const [ix, p] of this.parents.entries()) p.leaveChildren(ix)
      this.log(`🔶 leaveTooltip`)
      this.inTooltip = false
   }

   // ---
   private _resetAllTooltipTimouts = (): void => {
      this._resetTooltipEnterTimeout()
      this._resetTooltipLeaveTimeout()
   }

   private _resetTooltipEnterTimeout = (): void => {
      if (this.enterTooltipTimeoutId) {
         clearTimeout(this.enterTooltipTimeoutId)
         this.enterTooltipTimeoutId = null
      }
   }

   private _resetTooltipLeaveTimeout = (): void => {
      if (this.leaveTooltipTimeoutId) {
         clearTimeout(this.leaveTooltipTimeoutId)
         this.leaveTooltipTimeoutId = null
      }
   }

   // STACK RELATED STUFF --------------------
   enterChildren = (depth: number): void => {
      // this._resetAllChildrenTimouts()
      this.log(`[🤠] entering children (of ${this.depth}) ${depth}`)
      this.subRevealsCurrentlyVisible.add(depth)
   }

   leaveChildren = (depth: number): void => {
      this.log(`[🤠] leaving children (of ${this.depth}) ${depth}`)
      // this._resetAllChildrenTimouts()
      this.subRevealsCurrentlyVisible.delete(depth)
   }

   lastOpenClose = 0
   get delaySinceLastOpenClose(): number {
      return Date.now() - this.lastOpenClose
   }

   get PREVENT_DOUBLE_OPEN_CLOSE_DELAY(): boolean {
      return this.delaySinceLastOpenClose < 50
   }

   get hasBackdrop(): boolean {
      // 🔴
      return this.p.hasBackdrop ?? this.hideTriggers.backdropClick ?? false
   }

   onFocusAnchor = (ev: React.FocusEvent<unknown>): void => {
      if (isElemAChildOf(ev.relatedTarget, '._ShellForFocusEvents')) return

      /**
       * 💬 2024-10-14 domi: if we put a button inside the anchor,
       * it won't be clickable by default, because anchor focus is
       * triggered on mouse down, ie. the reveal will open before
       * the button is clicked.
       * So if the target is the button, we do not open the reveal.
       *
       * 💬 2024-10-26 rvion:
       * | at first, it seems (naively) the wrong place to do that to me
       * | "why not just prevenDefault/stopPropagation in the nested onFocus ?""
       * | but the `ev.target !== ev.currentTarget` indeed actually makes it pretty handy
       * | in most cases (Let's see if a counter-example ever arise).
       */
      if (
         ev.target instanceof HTMLButtonElement &&
         // if the anchor itself is the clicked button, we don't want to skip!
         ev.target !== ev.currentTarget
      )
         return

      // (mouseDown: ${this._mouseDown})
      this.logEv(ev, `anchor.onFocus (⏳: ${this.delaySinceLastOpenClose})`)

      // 🔶 when we click, we get
      // focus event -> menu opens -> left click event -> visible is already true -> left click goes into the wrong branch
      // so we prevent the conflict by disabling focus triggers when mouse is down
      // 🧑‍🎤 if (this._mouseDown) return

      // 🔶 another loop here: when we focus due to closure, it reopens due to focus...
      if (this.PREVENT_DOUBLE_OPEN_CLOSE_DELAY) return

      if (!this.shouldShowOnAnchorFocus) return

      // if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) // 🔶 not needed anymore?
      this.open('focus-anchor')

      ev.stopPropagation()
      ev.preventDefault()
   }

   onBlurAnchor = (ev: React.FocusEvent<unknown>): void => {
      // if the element getting focus is in shell
      // reveal should not be closed
      if (isElemAChildOf(ev.relatedTarget, '._ShellForFocusEvents')) return

      this.logEv(ev, `anchor.onBlur`)
      if (!this.shouldHideOnAnchorBlur) return

      this.close('blurAnchor')
   }

   onAnchorKeyDown = (ev: React.KeyboardEvent): void => {
      this.logEv(ev, `AnchorOrShell.onKeyDown (⏳: ${this.delaySinceLastOpenClose})`)

      // 🔶 without delay: press 'Enter' in option list => toggle => close popup => calls onAnchorKeyDown 'Enter' with visible now false => re-opens :(
      if (this.PREVENT_DOUBLE_OPEN_CLOSE_DELAY) return

      if (this.shouldShowOnKeyboardEnterOrLetterWhenAnchorFocused && !this.isVisible) {
         this.logEv(ev, `AnchorOrShell.onKeyDown: maybe open (visible: ${this.isVisible})`)
         const letterCode = ev.keyCode
         const isLetter = letterCode >= 65 && letterCode <= 90
         const isEnter = ev.key === 'Enter'
         if ((isLetter && !hasMod(ev)) || isEnter) {
            this.open('KeyboardEnterOrLetterWhenAnchorFocused')
            ev.preventDefault()
            ev.stopPropagation()
            return
         }
      }

      if (ev.key === 'Escape' && this.isVisible && this.shouldHideOnKeyboardEscape) {
         this.logEv(ev, `onAnchorOrShellKeyDown: close via Escape (visible: ${this.isVisible})`)
         this.close('escapeKey')
         // this.anchorRef.current?.focus()
         ev.preventDefault()
         ev.stopPropagation()
         return
      }

      if (ev.key === 'Tab' && this.isVisible) {
         // this.log(`🔶 input - onKeyDown TAB (closes and focus anchor)`)
         const reason = ev.shiftKey ? 'shiftTabKey' : 'tabKey'
         if (
            this.placement === 'screen' ||
            this.placement === 'screen-centered' ||
            this.placement === 'screen-top' ||
            this.placement === 'screen-top-left' ||
            this.placement === 'screen-top-right'
         )
            return // 🔶 tab should not close popups

         // 🔶 todo: proper "if shouldHideOnTab"...
         this.close(reason)
         // 🔴 if in grid context, do not stop propagation and do not focusNextElement so the grid focus the next cell (which have tabIndex=-1) itself
         // (or maybe call .selectCell ourselves to keep the grid selection in sync with our own?)
         // see ev.preventGridDefault() in https://github.com/adazzle/react-data-grid/blob/main/website/demos/CellNavigation.tsx#L136
         //     and gridUI.tsx => onCellKeyDown
         // (maybe we are also able to focus the reveal inside the cell on cell selection)
         // 🔴 also, maybe hide official cell focus because it's currently wrong?
         // 🔴 if not, this is useful
         if (reason === 'tabKey') focusNextElement('next')
         if (reason === 'shiftTabKey') focusNextElement('prev')
         ev.stopPropagation()
         ev.preventDefault()
         return
      }
   }

   onBackdropClick = (ev: React.MouseEvent<unknown>): void => {
      this.logEv(ev, `onBackdropClick`)
      if (this.shouldHideOnBackdropClick) {
         this.close('backdropClick')
         ev.stopPropagation() // 🔴 there should be another props letting us know that the backdrop is transparent to clicks
         ev.preventDefault()
      }
   }

   /**
    * called when a click even bubble upward and reach the shell
    * if you don't want this to trigger, you should stop propagation
    */
   onShellClick = (ev: React.MouseEvent<unknown>): void => {
      this.logEv(ev, `onShellClick (shouldHideOnShellClick=${this.shouldHideOnShellClick})`)
      if (this.shouldHideOnShellClick) this.close('shellClick')
      ev.stopPropagation()

      // 💬 2024-10-16 domi:
      // | @ghusse je ne pense pas qu'il faille empêcher le default dans ce cas là,
      // | on est dans un clic à l'interieur du shell, on ne veut juste pas qu'il en sorte?
      // ev.preventDefault()
   }

   // prettier-ignore
   logEv(
        ev: Maybe<
                | React.MouseEvent<unknown>
                | React.FocusEvent<unknown>
                | React.KeyboardEvent<unknown>
            >,
        msg: string,
    ): void {
        return
        if (!DEBUG_REVEAL) return
        // this.log(`🎩 ${this.uid} ${evUID(ev)} ${msg}`)
        const evenInfo = `${ev?.type}#${evUID(ev)}`.padStart(15)
        this.log(`[${evenInfo}] ${msg}`)
    }

   log(msg: string): void {
      if (!DEBUG_REVEAL) return
      console.log(`🎩 ${'    '.repeat(this.depth)} | uid=${this.uid.toString().padStart(2)}`, msg)
      // console.log(`🎩 ${'    '.repeat(this.ix)} depth=${this.ix.toString()} | uid=${this.uid.toString().padStart(2)}`, msg)
   }

   get backdropColor(): string | undefined {
      if (this.p.backdropColor != null) return this.p.backdropColor

      // popups are darker
      if (this.p.placement === 'screen') return '#00000022'
      if (this.p.placement === 'screen-centered') return '#00000022'
      if (this.p.placement === 'screen-top') return '#00000022'
      if (this.p.placement === 'screen-top-left') return '#00000022'
      if (this.p.placement === 'screen-top-right') return '#00000022'

      // popovers are transparent? we need better semantics than "placement" though
      return // '#00000011'
   }
}

function evUID(x: unknown): string {
   return `${getUIDForMemoryStructure(x, 3)}`
}

function focusNextElement(dir: 'next' | 'prev'): void {
   const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
   const elements = Array.from(document.querySelectorAll(focusableElements)).filter(
      (e) =>
         (e as any).tabIndex >= 0 && // 🔴 the selector needs to be refined: a button with tabindex=-1 will match!
         e.tagName !== 'link', // exlude <link href="https://..." rel="stylesheet">
      // => we might look at elements content to see other common patterns that need exclusion
   ) as HTMLElement[]

   const currentFocusIndex = elements.indexOf(document.activeElement as HTMLElement)
   const nextIndex = (currentFocusIndex + (dir === 'next' ? 1 : -1)) % elements.length

   elements[nextIndex]?.focus()
}
