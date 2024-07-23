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
    static nextUID = 1

    static shared: { current: Maybe<RevealState> } = observable({ current: null }, { current: observable.ref })

    uid = RevealState.nextUID++

    onMiddleClickAnchor = (ev: React.MouseEvent<unknown> | MouseEvent): void => {
        // this.onLeftClick(ev)
    }

    onRightClickAnchor = (ev: React.MouseEvent<unknown> | MouseEvent): void => {
        this.onLeftClickAnchor(ev)
    }

    onLeftClickAnchor = (ev: React.MouseEvent<unknown> | MouseEvent): void => {
        const toc = this.triggerOnClick
        if (!toc) return
        ev.stopPropagation()
        // ev.preventDefault()
        if (this.visible) this.leaveAnchor()
        else this.enterAnchor()
    }

    onFocusAnchor = (): void => {
        if (!this.triggerOnFocus) return
        this.enterAnchor()
    }

    onBlurAnchor = (): void => {
        if (!this.triggerOnFocus) return
        this.leaveAnchor()
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
    inChildren = new Set<number>()

    /** how deep in the reveal stack we are */
    get ix(): number {
        return this.parents.length
    }

    get debugColor(): CSSProperties {
        return {
            borderLeft: this.inAnchor ? `3px solid red` : undefined,
            borderTop: this.inTooltip ? `3px solid cyan` : undefined,
            borderBottom: this.inChildren.size > 0 ? `3px solid orange` : undefined,
        }
    }

    /** toolip is visible if either inAnchor or inTooltip */
    get visible(): boolean {
        if (this._lock) return true
        return this.inAnchor || this.inTooltip || this.inChildren.size > 0
    }

    close(): void {
        this._resetAllAnchorTimouts()
        this._resetAllTooltipTimouts()
        this.inAnchor = false
        this.inTooltip = false
        this.inChildren.clear()
    }

    get triggerOnFocus(): boolean {
        return true // 🔴 maybe some orthogonal props or more trigger options?
        // eg should not trigger for popups
    }

    get triggerOnClick(): boolean {
        return (
            this.p.trigger == null ||
            this.p.trigger == 'click' || //
            this.p.trigger == 'clickAndHover'
        )
    }

    get triggerOnHover(): boolean {
        return (
            this.p.trigger == 'hover' || //
            this.p.trigger == 'clickAndHover'
        )
    }

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
            top: pos.top ? toCss(pos.top) : undefined,
            left: pos.left ? toCss(pos.left) : undefined,
            bottom: pos.bottom ? toCss(pos.bottom) : undefined,
            right: pos.right ? toCss(pos.right) : undefined,
            width: pos.width ? toCss(pos.width) : undefined,
            height: pos.height ? toCss(pos.height) : undefined,
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
        if (!this.triggerOnHover) return 'cursor-pointer'
        return 'cursor-help'
    }

    // anchor --------------------------------------------
    enterAnchorTimeoutId: NodeJS.Timeout | null = null
    leaveAnchorTimeoutId: NodeJS.Timeout | null = null

    onMouseEnterAnchor = (): void => {
        /* 🔥 */ if (!this.triggerOnHover && !this.visible) return
        /* 🔥 */ if (RevealState.shared.current) return this.enterAnchor()
        this._resetAllAnchorTimouts()
        this.enterAnchorTimeoutId = setTimeout(this.enterAnchor, this.showDelay)
    }
    onMouseLeaveAnchor = (): void => {
        if (this.triggerOnClick) return
        this._resetAllAnchorTimouts()
        this.leaveAnchorTimeoutId = setTimeout(this.leaveAnchor, this.hideDelay)
    }

    get shouldCloseCurrentOnEnter(): boolean {
        const current = RevealState.shared.current
        if (current == null) return false
        if (current === this) return false
        if (this.parents.includes(current)) return false
        if (current.p.defaultVisible) return false
        return true
    }
    // ---
    enterAnchor = (): void => {
        if (DEBUG_REVEAL) console.log(`[🤠] ENTERING anchor ${this.ix}`)
        /* 🔥 🔴 */ if (this.shouldCloseCurrentOnEnter) RevealState.shared.current?.close()
        /* 🔥 */ RevealState.shared.current = this
        this._resetAllAnchorTimouts()
        this.inAnchor = true
    }

    leaveAnchor = (): void => {
        if (DEBUG_REVEAL) console.log(`[🤠] LEAVING anchor  ${this.ix}`)
        /* 🔥 */ if (RevealState.shared.current == this) RevealState.shared.current = null
        this._resetAllAnchorTimouts()
        this.inAnchor = false
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
        if (this.triggerOnClick) return
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
        this.inChildren.add(depth)
    }

    leaveChildren = (depth: number): void => {
        if (DEBUG_REVEAL) console.log(`[🤠] leaving children (of ${this.ix}) ${depth}`)
        // this._resetAllChildrenTimouts()
        this.inChildren.delete(depth)
    }
}

function toCss(x: number | string): string {
    return typeof x == 'number' ? `${Math.round(x)}px` : x
}
