import type { RevealProps } from './RevealProps'
import type { CSSProperties, ReactNode } from 'react'

import { makeAutoObservable, observable } from 'mobx'

import { computePlacement } from './RevealPlacement'

export const defaultShowDelay_whenRoot = 100
export const defaultHideDelay_whenRoot = 300

export const defaultShowDelay_whenNested = 0
export const defaultHideDelay_whenNested = 0

const DEBUG_REVEAL = false

/**
 * state wrapper that laziy initializes the actual state when actually required
 * it's important to keep that class lighweight.
 */
export class RevealStateLazy {
    constructor(
        //
        public p: RevealProps,
        public parents: RevealState[],
    ) {
        makeAutoObservable(this, { p: false })
    }
    uistOrNull: RevealState | null = null
    getUist = (): RevealState => {
        if (this.uistOrNull) return this.uistOrNull
        if (DEBUG_REVEAL) console.log(`[💙] init RevealUI`)
        this.uistOrNull = new RevealState({ ...this.p }, this.parents)
        return this.uistOrNull!
    }
}

export class RevealState {
    static nextUID = 1
    static shared: { current: Maybe<RevealState> } = observable({ current: null }, { current: observable.ref })
    uid = RevealState.nextUID++

    onMiddleClick = (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        // this.onLeftClick(ev)
    }
    onRightClick = (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        this.onLeftClick(ev)
    }
    onLeftClick = (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const toc = this.triggerOnClick
        if (!toc) return
        ev.stopPropagation()
        // ev.preventDefault()
        if (this.visible) this.leaveAnchor()
        else this.enterAnchor()
    }

    /**
     * manuall assigned here on init so it can be made observable
     * on its own, without the need to make the entire props observable
     * so we can then hot-reload it nicely and have a nicer dev experience
     */
    contentFn: () => ReactNode

    constructor(
        //
        public p: RevealProps,
        public parents: RevealState[],
    ) {
        // see comment above
        this.contentFn = (): ReactNode => p.content(this)

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

    get triggerOnClick(): boolean {
        return (
            this.p.trigger == null ||
            this.p.trigger == 'click' || //
            this.p.trigger == 'clickAndHover'
        )
    }
    get triggerOnHover() {
        return (
            this.p.trigger == 'hover' || //
            this.p.trigger == 'clickAndHover'
        )
    }

    get showDelay() {
        return this.p.showDelay ?? (this.ix ? defaultShowDelay_whenNested : defaultShowDelay_whenRoot)
    }
    get hideDelay() {
        return this.p.hideDelay ?? (this.ix ? defaultHideDelay_whenNested : defaultHideDelay_whenRoot)
    }
    get placement() { return this.p.placement ?? 'auto' } // prettier-ignore

    // position --------------------------------------------
    tooltipPosition: any = { top: 0, left: 0 }
    setPosition = (rect: DOMRect) => {
        this.tooltipPosition = computePlacement(this.placement, rect)
    }

    // lock --------------------------------------------
    _lock = false
    toggleLock = () => {
        this._lock = !this._lock
    }

    // UI --------------------------------------------
    get defaultCursor() {
        if (!this.triggerOnHover) return 'cursor-pointer'
        return 'cursor-help'
    }

    // anchor --------------------------------------------
    enterAnchorTimeoutId: NodeJS.Timeout | null = null
    leaveAnchorTimeoutId: NodeJS.Timeout | null = null

    onMouseEnterAnchor = () => {
        /* 🔥 */ if (!this.triggerOnHover && !this.visible) return
        /* 🔥 */ if (RevealState.shared.current) return this.enterAnchor()
        this._resetAllAnchorTimouts()
        this.enterAnchorTimeoutId = setTimeout(this.enterAnchor, this.showDelay)
    }
    onMouseLeaveAnchor = () => {
        if (this.placement.startsWith('popup')) return
        this._resetAllAnchorTimouts()
        this.leaveAnchorTimeoutId = setTimeout(this.leaveAnchor, this.hideDelay)
    }

    // ---
    enterAnchor = () => {
        if (DEBUG_REVEAL) console.log(`[🤠] ENTERING anchor ${this.ix}`)
        /* 🔥 🔴 */ if (RevealState.shared.current != this && !this.parents.includes(RevealState.shared.current!))
            RevealState.shared.current?.close()
        /* 🔥 */ RevealState.shared.current = this
        this._resetAllAnchorTimouts()
        this.inAnchor = true
    }

    leaveAnchor = () => {
        if (DEBUG_REVEAL) console.log(`[🤠] LEAVING anchor  ${this.ix}`)
        /* 🔥 */ if (RevealState.shared.current == this) RevealState.shared.current = null
        this._resetAllAnchorTimouts()
        this.inAnchor = false
    }

    // ---
    private _resetAllAnchorTimouts = () => {
        this._resetAnchorEnterTimeout()
        this._resetAnchorLeaveTimeout()
    }
    private _resetAnchorEnterTimeout = () => {
        if (this.enterAnchorTimeoutId) {
            clearTimeout(this.enterAnchorTimeoutId)
            this.enterAnchorTimeoutId = null
        }
    }
    private _resetAnchorLeaveTimeout = () => {
        if (this.leaveAnchorTimeoutId) {
            clearTimeout(this.leaveAnchorTimeoutId)
            this.leaveAnchorTimeoutId = null
        }
    }

    // tooltip --------------------------------------------
    enterTooltipTimeoutId: NodeJS.Timeout | null = null
    leaveTooltipTimeoutId: NodeJS.Timeout | null = null

    onMouseEnterTooltip = () => {
        this._resetAllTooltipTimouts()
        this.enterTooltipTimeoutId = setTimeout(this.enterTooltip, this.showDelay)
    }
    onMouseLeaveTooltip = () => {
        if (this.placement.startsWith('popup')) return
        this._resetAllTooltipTimouts()
        this.leaveTooltipTimeoutId = setTimeout(this.leaveTooltip, this.hideDelay)
    }

    // ---
    enterTooltip = () => {
        this._resetAllTooltipTimouts()
        for (const [ix, p] of this.parents.entries()) p.enterChildren(ix)
        if (DEBUG_REVEAL) console.log(`[🤠] enter tooltip of ${this.ix}`)
        this.inTooltip = true
    }

    leaveTooltip = () => {
        this._resetAllTooltipTimouts()
        for (const [ix, p] of this.parents.entries()) p.leaveChildren(ix)
        if (DEBUG_REVEAL) console.log(`[🤠] leaving tooltip of ${this.ix}`)
        this.inTooltip = false
    }

    // ---
    private _resetAllTooltipTimouts = () => {
        this._resetTooltipEnterTimeout()
        this._resetTooltipLeaveTimeout()
    }
    private _resetTooltipEnterTimeout = () => {
        if (this.enterTooltipTimeoutId) {
            clearTimeout(this.enterTooltipTimeoutId)
            this.enterTooltipTimeoutId = null
        }
    }
    private _resetTooltipLeaveTimeout = () => {
        if (this.leaveTooltipTimeoutId) {
            clearTimeout(this.leaveTooltipTimeoutId)
            this.leaveTooltipTimeoutId = null
        }
    }
    // --------------------

    enterChildren = (depth: number) => {
        // this._resetAllChildrenTimouts()
        if (DEBUG_REVEAL) console.log(`[🤠] entering children (of ${this.ix}) ${depth}`)
        this.inChildren.add(depth)
    }

    leaveChildren = (depth: number) => {
        if (DEBUG_REVEAL) console.log(`[🤠] leaving children (of ${this.ix}) ${depth}`)
        // this._resetAllChildrenTimouts()
        this.inChildren.delete(depth)
    }
}
