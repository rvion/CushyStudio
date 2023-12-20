import { makeAutoObservable, observable, runInAction } from 'mobx'

export const defaultShowDelay = 100
export const defaultHideDelay = 800

export class RevealState {
    static shared: { current: Maybe<RevealState> } = observable({ current: null })

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

    // ------------------------------------------------
    constructor(
        //
        public showDelay = defaultShowDelay,
        public hideDelay = defaultHideDelay,
        public disableHover = false,
    ) {
        makeAutoObservable(this)
    }

    // position --------------------------------------------
    tooltipPosition = { top: 0, left: 0 }
    setPosition = (rect: DOMRect) => {
        this.tooltipPosition = {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        }
    }

    // lock --------------------------------------------
    _lock = false
    toggleLock = () => {
        this._lock = !this._lock
    }

    // UI --------------------------------------------
    get defaultCursor() {
        if (this.disableHover) return 'cursor-pointer'
        return 'cursor-help'
    }

    // anchor --------------------------------------------
    enterAnchorTimeoutId: NodeJS.Timeout | null = null
    leaveAnchorTimeoutId: NodeJS.Timeout | null = null

    onMouseEnterAnchor = () => {
        /* 🔥 */ if (RevealState.shared.current) return this.enterAnchor()
        /* 🔥 */ if (this.disableHover && !this.visible) return
        this._resetAllAnchorTimouts()
        this.enterAnchorTimeoutId = setTimeout(this.enterAnchor, this.showDelay)
    }
    onMouseLeaveAnchor = () => {
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
