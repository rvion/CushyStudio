import type { NO_PROPS } from '../types/NO_PROPS'
import type { RevealProps } from './RevealProps'
import type { RevealContentProps } from './shells/ShellProps'
import type { CSSProperties, FC, ReactNode } from 'react'

import { makeAutoObservable, observable } from 'mobx'

import { computePlacement, type RevealComputedPosition, type RevealPlacement } from './RevealPlacement'
import { DEBUG_REVEAL } from './RevealProps'

export const defaultShowDelay_whenRoot = 100
export const defaultHideDelay_whenRoot = 300

export const defaultShowDelay_whenNested = 0
export const defaultHideDelay_whenNested = 0

export class RevealState {
    static nextUID: number = 1

    static shared: { current: Maybe<RevealState> } = observable({ current: null }, { current: observable.ref })

    uid = RevealState.nextUID++

    onMiddleClickAnchor = (ev: React.MouseEvent<unknown> | MouseEvent): void => {
        // this.onLeftClick(ev)
    }

    onRightClickAnchor = (ev: React.MouseEvent<unknown> | MouseEvent): void => {
        this.onLeftClickAnchor(ev)
    }

    onLeftClickAnchor = (ev: React.MouseEvent<unknown> | MouseEvent): void => {
        const toc = this.shouldRevealOnAnchorClick
        if (!toc) return
        ev.stopPropagation()
        // ev.preventDefault()
        if (this.isVisible) this.close()
        else this.open()
    }

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
        makeAutoObservable(this, { uid: false, p: false })
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
    get shouldHideOnTooltipBlur(): boolean {
        return false
    }

    get shouldHideOnAnchorBlur(): boolean {
        return false
    }

    get shouldHideOnKeyboardEscape(): boolean {
        return true
    }

    get shouldHideOnAnchorClick(): boolean {
        return false
    }

    get shouldHideOnAnchorOrTooltipMouseLeave(): boolean {
        return false
    }

    // REVEAL triggers ------------------------------------------------------
    get shouldRevealOnAnchorFocus(): boolean {
        if (this.p.trigger == 'none') return false
        if (this.shouldRevealOnAnchorClick) return true
        if (this.p.trigger === 'pseudofocus') return true
        return false
    }

    get shouldRevealOnKeyboardEnterOrLetterWhenAnchorFocused(): boolean {
        if (this.p.trigger == 'none') return false
        if (this.p.trigger === 'pseudofocus') return true
        return false
    }

    get shouldRevealOnAnchorClick(): boolean {
        if (this.p.trigger == 'none') return false
        return (
            this.p.trigger == null ||
            this.p.trigger == 'click' || //
            this.p.trigger == 'clickAndHover'
        )
    }

    get shouldRevealOnAnchorHover(): boolean {
        if (this.p.trigger == 'none') return false
        return (
            this.p.trigger == 'hover' || //
            this.p.trigger == 'clickAndHover'
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
        return {
            position: 'absolute',
            zIndex: 99999999,
            top: pos.top != null ? toCss(pos.top) : undefined,
            left: pos.left != null ? toCss(pos.left) : undefined,
            bottom: pos.bottom != null ? toCss(pos.bottom) : undefined,
            right: pos.right != null ? toCss(pos.right) : undefined,
            width: pos.width != null ? toCss(pos.width) : undefined,
            height: pos.height != null ? toCss(pos.height) : undefined,
            overflow: 'auto',
            transform: pos.transform,
        }
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

    onMouseEnterAnchor = (): void => {
        /* 🔥 */ if (!this.shouldRevealOnAnchorHover && !this.isVisible) return
        /* 🔥 */ if (RevealState.shared.current) return this.open()
        this._resetAllAnchorTimouts()
        this.enterAnchorTimeoutId = setTimeout(this.open, this.showDelay)
    }

    onMouseLeaveAnchor = (): void => {
        if (!this.shouldHideOnAnchorOrTooltipMouseLeave) return
        this._resetAllAnchorTimouts()
        this.leaveAnchorTimeoutId = setTimeout(this.close, this.hideDelay)
    }

    // ---
    open = (): void => {
        const wasVisible = this.isVisible
        if (DEBUG_REVEAL) console.log(`[🤠] ENTERING anchor ${this.ix}`)
        /* 🔥 🔴 */ if (this.shouldHideOtherRevealWhenRevealed) RevealState.shared.current?.close()
        /* 🔥 */ RevealState.shared.current = this
        this._resetAllAnchorTimouts()
        this.inAnchor = true

        if (!wasVisible) this.p.onRevealed?.()
    }

    close = (): void => {
        if (DEBUG_REVEAL) console.log(`[🔴] CLOSING REVEAL  ${this.ix}`)
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

        if (wasVisible) this.p.onHidden?.()
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

    onMouseEnterTooltip = (): void => {
        this._resetAllTooltipTimouts()
        this.enterTooltipTimeoutId = setTimeout(this.enterTooltip, this.showDelay)
    }
    onMouseLeaveTooltip = (): void => {
        if (this.shouldRevealOnAnchorClick) return
        this._resetAllTooltipTimouts()
        this.leaveTooltipTimeoutId = setTimeout(this.leaveTooltip, this.hideDelay)
    }

    // ---
    enterTooltip = (): void => {
        this._resetAllTooltipTimouts()
        for (const [ix, p] of this.parents.entries()) p.enterChildren(ix)
        if (DEBUG_REVEAL) console.log(`[🤠] enter tooltip of ${this.ix}`)
        this.inTooltip = true
    }

    leaveTooltip = (): void => {
        this._resetAllTooltipTimouts()
        for (const [ix, p] of this.parents.entries()) p.leaveChildren(ix)
        if (DEBUG_REVEAL) console.log(`[🤠] leaving tooltip of ${this.ix}`)
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
        if (DEBUG_REVEAL) console.log(`[🤠] entering children (of ${this.ix}) ${depth}`)
        this.subRevealsCurrentlyVisible.add(depth)
    }

    leaveChildren = (depth: number): void => {
        if (DEBUG_REVEAL) console.log(`[🤠] leaving children (of ${this.ix}) ${depth}`)
        // this._resetAllChildrenTimouts()
        this.subRevealsCurrentlyVisible.delete(depth)
    }

    onFocusAnchor = (ev: React.FocusEvent<unknown>): void => {
        if (!this.shouldRevealOnAnchorFocus) return
        console.log(`[🔴] SelectUI > onFocus`)
        if (ev.relatedTarget != null && !(ev.relatedTarget instanceof Window)) {
            this.open()
        }
    }

    onBlurAnchor = (): void => {
        if (!this.shouldRevealOnAnchorFocus) return
        // this.close()
    }

    onAnchorKeyUp = (ev: React.KeyboardEvent): void => {
        if (!this.shouldRevealOnKeyboardEnterOrLetterWhenAnchorFocused && !this.isVisible) {
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

        // 🔴
        if (ev.key === 'Escape' && this.isVisible) {
            this.close()
            // this.anchorRef.current?.focus()
            ev.preventDefault()
            ev.stopPropagation()
            return
        }
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
}

function toCss(x: number | string): string {
    return typeof x == 'number' ? `${Math.round(x)}px` : x
}
