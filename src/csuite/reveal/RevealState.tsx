import type { NO_PROPS } from '../types/NO_PROPS'
import type { RevealHideReason, RevealHideTriggers, RevealProps, RevealShowTrigger } from './RevealProps'
import type { RevealContentProps } from './shells/ShellProps'
import type { CSSProperties, FC, ReactNode } from 'react'

import { makeAutoObservable, observable } from 'mobx'

import { exhaust } from '../utils/exhaust'
import { getUIDForMemoryStructure } from '../utils/getUIDForMemoryStructure'
import { isElemAChildOf } from '../utils/isElemAChildOf'
import { toCssSizeValue } from '../utils/toCssSizeValue'
import { DEBUG_REVEAL } from './DEBUG_REVEAL'
import { computePlacement, type RevealComputedPosition, type RevealPlacement } from './RevealPlacement'
import { global_RevealStack } from './RevealStack'

export const defaultShowDelay_whenRoot = 100
export const defaultHideDelay_whenRoot = 300

export const defaultShowDelay_whenNested = 0
export const defaultHideDelay_whenNested = 0

export class RevealState {
    static nextUID: number = 1

    static shared: { current: Maybe<RevealState> } = observable({ current: null }, { current: observable.ref })

    uid = RevealState.nextUID++

    onMiddleClickAnchor = (ev: React.MouseEvent<unknown>): void => {
        this.logEv(ev, `anchor.onMiddleClick`)
        // this.onLeftClick(ev)
    }

    onRightClickAnchor = (ev: React.MouseEvent<unknown>): void => {
        this.logEv(ev, `anchor.onRightClick`)
        this.onLeftClickAnchor(ev)
    }

    onLeftClickAnchor = (ev: React.MouseEvent<unknown>): void => {
        this.logEv(ev, `onLeftClickAnchor (visible: ${this.isVisible ? '🟢' : '🔴'})`)
        const closed = !this.isVisible
        if (closed) {
            if (this.shouldRevealOnAnchorClick) {
                this.open()
                ev.stopPropagation()
            }
        } else {
            if (this.shouldHideOnAnchorClick) {
                this.close('clickAnchor')
                ev.stopPropagation()
            }
        }
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

    constructor(
        //
        public p: RevealProps,
        public parents: RevealState[],
    ) {
        // see comment above
        this.contentFn = (): ReactNode => p.content({ reveal: this })

        // 💬 2024-03-06 YIKES !!
        // | Reveal UI was causing
        // |
        // | 📈 const stop = spy((ev) => {
        // | 📈     console.log(`[🤠] ev`, ev)
        // | 📈 })
        makeAutoObservable(this, { uid: false, p: false, PREVENT_DOUBLE_OPEN_CLOSE_DELAY: false, delaySinceLastOpenClose: false })
        // | 📈 stop()
    }

    // ------------------------------------------------
    inAnchor = false
    inTooltip = false
    subRevealsCurrentlyVisible = new Set<number>()

    /** how deep in the reveal stack we are */
    get ix(): number {
        return this.parents.length
    }

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

    // ????? -------------------------------------------------------------
    get shouldHideOtherRevealWhenRevealed(): boolean {
        const current = RevealState.shared.current
        if (current == null) return false
        if (current === this) return false
        if (this.parents.includes(current)) return false
        if (current.p.defaultVisible) return false
        return true
    }

    // HIDE triggers ------------------------------------------------------
    get hideTriggers(): RevealHideTriggers {
        if (this.p.hideTriggers) return this.p.hideTriggers
        if (this.revealTrigger === 'none') return { none: true }
        if (this.revealTrigger === 'click') return { clickAnchor: true, backdropClick: true, escapeKey: true }
        if (this.revealTrigger === 'clickAndHover') return { clickAnchor: true, backdropClick: true, escapeKey: true } // prettier-ignore
        if (this.revealTrigger === 'hover') return { mouseOutside: true }
        if (this.revealTrigger === 'pseudofocus') return { clickAnchor: true, backdropClick: true, escapeKey: true }
        exhaust(this.revealTrigger)
    }

    // 🔶 not sure when we need this one?
    // get shouldHideOnTooltipBlur(): boolean {
    //     return false
    // }

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

    // REVEAL triggers ------------------------------------------------------
    get revealTrigger(): RevealShowTrigger {
        return this.p.trigger ?? 'click'
    }

    get shouldRevealOnAnchorFocus(): boolean {
        if (this.revealTrigger == 'none') return false
        if (this.shouldRevealOnAnchorClick) return true
        if (this.revealTrigger === 'pseudofocus') return true
        return false
    }

    get shouldRevealOnKeyboardEnterOrLetterWhenAnchorFocused(): boolean {
        if (this.revealTrigger == 'none') return false
        if (this.revealTrigger === 'pseudofocus') return true
        return false
    }

    get shouldRevealOnAnchorClick(): boolean {
        if (this.revealTrigger == 'none') return false
        return (
            this.revealTrigger == 'pseudofocus' ||
            this.revealTrigger == 'click' || //
            this.revealTrigger == 'clickAndHover'
        )
    }

    get shouldRevealOnAnchorHover(): boolean {
        if (this.revealTrigger == 'none') return false
        return (
            this.revealTrigger == 'hover' || //
            this.revealTrigger == 'clickAndHover'
        )
    }

    // possible triggers ------------------------------------------------------
    get showDelay(): number {
        return this.p.showDelay ?? (this.ix ? defaultShowDelay_whenNested : defaultShowDelay_whenRoot)
    }

    get hideDelay(): number {
        return this.p.hideDelay ?? (this.ix ? defaultHideDelay_whenNested : defaultHideDelay_whenRoot)
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
            overflow: 'auto',
            transform: pos.transform,
        }
        // ⏸️ console.log(`[🤠] posCSS`, JSON.stringify(out, null, 4))
        return out
    }
    tooltipPosition: RevealComputedPosition = { top: 0, left: 0 }
    setPosition = (rect: DOMRect): void => {
        this.tooltipPosition = computePlacement(this.placement, rect)
    }

    // lock --------------------------------------------
    _lock = false
    toggleLock = (): void => {
        this._lock = !this._lock
    }

    // UI --------------------------------------------
    get defaultCursor(): string {
        if (!this.shouldRevealOnAnchorHover) return 'cursor-pointer'
        return 'cursor-help'
    }

    // anchor --------------------------------------------
    enterAnchorTimeoutId: NodeJS.Timeout | null = null
    leaveAnchorTimeoutId: NodeJS.Timeout | null = null

    onMouseEnterAnchor = (ev: React.MouseEvent<unknown>): void => {
        this.logEv(ev, `anchor.onMouseEnter`)
        /* 🔥 */ if (!this.shouldRevealOnAnchorHover) return
        /* 🔥 */ if (this.isVisible) return
        /* 🔥 */ if (RevealState.shared.current) return this.open()
        this._resetAllAnchorTimouts()
        this.enterAnchorTimeoutId = setTimeout(this.open, this.showDelay)
    }

    onMouseLeaveAnchor = (ev: React.MouseEvent<unknown>): void => {
        this.logEv(ev, `anchor.onMouseLeave`)
        if (!this.shouldHideOnAnchorOrTooltipMouseLeave) return
        this._resetAllAnchorTimouts()
        this.leaveAnchorTimeoutId = setTimeout(() => this.close('mouseOutside'), this.hideDelay)
    }

    private _register(): void {
        global_RevealStack.push(this)
    }

    private _unregister(): void {
        const ix = global_RevealStack.indexOf(this)
        if (ix >= 0) global_RevealStack.splice(ix, 1)
    }

    // ---
    open = (): void => {
        if (this.isVisible) return

        this.log(`🚨 open`)
        this._register()
        this.lastOpenClose = Date.now()
        const wasVisible = this.isVisible
        /* 🔥 🔴 */ if (this.shouldHideOtherRevealWhenRevealed) RevealState.shared.current?.close('cascade')
        /* 🔥 */ RevealState.shared.current = this
        this._resetAllAnchorTimouts()
        this.inAnchor = true

        if (!wasVisible) this.p.onRevealed?.()
    }

    close = (reason?: RevealHideReason): void => {
        this.log(`🚨 close (reason=${reason})`)
        this._unregister()
        this.lastOpenClose = Date.now()
        const wasVisible = this.isVisible
        /* 🔥 */ if (RevealState.shared.current == this) RevealState.shared.current = null
        this._resetAllAnchorTimouts()
        this._resetAllTooltipTimouts()
        this.inAnchor = false
        this.inTooltip = false

        // if we're closing, all our children also are closed.
        // so we can safely clean the state and forget about previous
        this.subRevealsCurrentlyVisible.clear()

        // 🔴 are children closed properly?

        if (wasVisible) this.p.onHidden?.(reason ?? 'unknown')
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
    enterTooltipTimeoutId: NodeJS.Timeout | null = null
    leaveTooltipTimeoutId: NodeJS.Timeout | null = null

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
    enterTooltip = (): void => {
        this._resetAllTooltipTimouts()
        for (const [ix, p] of this.parents.entries()) p.enterChildren(ix)
        this.log(`🔶 enterTooltip`)
        this.inTooltip = true
    }

    leaveTooltip = (): void => {
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
        this.log(`[🤠] entering children (of ${this.ix}) ${depth}`)
        this.subRevealsCurrentlyVisible.add(depth)
    }

    leaveChildren = (depth: number): void => {
        this.log(`[🤠] leaving children (of ${this.ix}) ${depth}`)
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
        return this.hideTriggers.backdropClick ?? false
    }

    onFocusAnchor = (ev: React.FocusEvent<unknown>): void => {
        if (isElemAChildOf(ev.relatedTarget, '._ShellForFocusEvents')) return

        // (mouseDown: ${this._mouseDown})
        this.logEv(ev, `anchor.onFocus (⏳: ${this.delaySinceLastOpenClose})`)

        // 🔶 when we click, we get
        // focus event -> menu opens -> left click event -> visible is already true -> left click goes into the wrong branch
        // so we prevent the conflict by disabling focus triggers when mouse is down
        // 🧑‍🎤 if (this._mouseDown) return

        // 🔶 another loop here: when we focus due to closure, it reopens due to focus...
        if (this.PREVENT_DOUBLE_OPEN_CLOSE_DELAY) return

        if (!this.shouldRevealOnAnchorFocus) return

        // if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) // 🔶 not needed anymore?
        this.open()

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

        if (this.shouldRevealOnKeyboardEnterOrLetterWhenAnchorFocused && !this.isVisible) {
            this.logEv(ev, `AnchorOrShell.onKeyDown: maybe open (visible: ${this.isVisible})`)
            const letterCode = ev.keyCode
            const isLetter = letterCode >= 65 && letterCode <= 90
            const isEnter = ev.key === 'Enter'
            if (isLetter || isEnter) {
                this.open()
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
    }

    onBackdropClick = (ev: React.MouseEvent<unknown>): void => {
        this.logEv(ev, `onBackdropClick`)
        if (this.shouldHideOnBackdropClick) {
            this.close('backdropClick')
            ev.stopPropagation() // 🔴 there should be another props letting us know that the backdrop is transparent to clicks
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
        // this.log(`🎩 ${this.uid} ${evUID(ev)} ${msg}`)
        const evenInfo = `${ev?.type}#${evUID(ev)}`.padStart(15)
        this.log(`[${evenInfo}] ${msg}`)
    }

    log(msg: string): void {
        if (!DEBUG_REVEAL) return
        console.log(`🎩 ${this.ix.toString()} | ${this.uid.toString().padStart(2)}`, msg)
    }
}

function evUID(x: unknown): string {
    return `${getUIDForMemoryStructure(x, 3)}`
}

// 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
// Close pop-up if too far outside
// 💬 2024-02-29 rvion:
// | this code was a good idea; but it's really
// | not pleasant when working mostly with keyboard and using tab to open selects.
// | as soon as the moouse move just one pixel, popup close.
// |  =>  commenting it out until we find a solution confortable in all cases

// window.addEventListener('mousemove', this.MouseMoveTooFar, true)

// selectUI state:
//   - hasMouseEntered: boolean = false
//   - onRootMouseDown: this.hasMouseEntered = true
//   - closeMenu:

// MouseMoveTooFar = (event: MouseEvent): void => {
//     const popup = this.popupRef?.current
//     const anchor = this.anchorRef?.current

//     if (!popup || !anchor || !this.hasMouseEntered) {
//         return
//     }

//     const x = event.clientX
//     const y = event.clientY

//     // XXX: Should probably be scaled by UI scale
//     const maxDistance = 75

//     if (
//         // left
//         popup.offsetLeft - x > maxDistance ||
//         // top
//         popup.offsetTop - y > maxDistance ||
//         // right
//         x - (popup.offsetLeft + popup.offsetWidth) > maxDistance ||
//         // bottom
//         y - (popup.offsetTop + popup.offsetHeight) > maxDistance
//     ) {
//         this.closeMenu()
//     }
// }
