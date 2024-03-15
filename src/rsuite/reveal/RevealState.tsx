import { makeAutoObservable, observable } from 'mobx'

import { computePlacement } from './RevealPlacement'
import { RevealProps } from './RevealProps'

export const defaultShowDelay = 100
export const defaultHideDelay = 300

export class RevealState {
    static nextUID = 1
    static shared: { current: Maybe<RevealState> } = observable({ current: null }, { current: observable.ref })
    uid = RevealState.nextUID++

    constructor(public p: RevealProps) {
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

    /** toolip is visible if either inAnchor or inTooltip */
    get visible() {
        if (this._lock) return true
        return this.inAnchor || this.inTooltip
    }

    close() {
        this._resetAllAnchorTimouts()
        this._resetAllTooltipTimouts()
        this.inAnchor = false
        this.inTooltip = false
    }

    get triggerOnClick() {
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
    get showDelay() { return this.p.showDelay ?? defaultShowDelay } // prettier-ignore
    get hideDelay() { return this.p.hideDelay ?? defaultHideDelay } // prettier-ignore
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
        /* 🔥 🔴 */ if (RevealState.shared.current != this) RevealState.shared.current?.close()
        /* 🔥 */ RevealState.shared.current = this
        this._resetAllAnchorTimouts()
        this.inAnchor = true
    }

    leaveAnchor = () => {
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
        // cancer enter
        this._resetAllTooltipTimouts()
        this.leaveTooltipTimeoutId = setTimeout(this.leaveTooltip, this.hideDelay)
    }

    // ---
    enterTooltip = () => {
        this._resetAllTooltipTimouts()
        this.inTooltip = true
    }

    leaveTooltip = () => {
        this._resetAllTooltipTimouts()
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
}
