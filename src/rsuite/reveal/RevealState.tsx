import { makeAutoObservable, observable, runInAction } from 'mobx'
import { RevealProps } from './RevealProps'

export const defaultShowDelay = 100
export const defaultHideDelay = 300

export type Placement =
    //
    | 'popup-sm'
    | 'popup-xs'
    | 'popup-lg'
    //
    | 'top'
    | 'bottom'
    | 'right'
    | 'left'
    | 'bottomStart'
    | 'bottomEnd'
    | 'topStart'
    | 'topEnd'
    | 'leftStart'
    | 'leftEnd'
    | 'rightStart'
    | 'rightEnd'
    //
    | 'auto'
    | 'autoVerticalStart'
    | 'autoVerticalEnd'
    | 'autoHorizontalStart'
    | 'autoHorizontalEnd'
    //
    | `#${string}`

export class RevealState {
    static nextUID = 1
    static shared: { current: Maybe<RevealState> } = observable({ current: null })
    uid = RevealState.nextUID++
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
    // ------------------------------------------------
    constructor(public p: RevealProps) {
        makeAutoObservable(this)
    }

    // position --------------------------------------------
    tooltipPosition: any = { top: 0, left: 0 }
    setPosition = (rect: DOMRect) => {
        // prettier-ignore
        this.tooltipPosition = (() => {
            let placement = this.placement

            if (placement == 'popup-xs') return { top: 0, left: 0 }
            if (placement == 'popup-sm') return { top: 0, left: 0 }
            if (placement == 'popup-lg') return { top: 0, left: 0 }


            if (this.placement == 'auto') {
                placement = (():Placement => {
                    const top = rect.top
                    const bottom = window.innerHeight - rect.bottom
                    const left = rect.left
                    const right = window.innerWidth - rect.right
                    const minX = Math.min(left, right)
                    const minY = Math.min(top, bottom)
                    return (minY == top)
                        ? (minX == left)  ? 'bottomStart' : 'bottomEnd'
                        : (minX == left)  ? 'topStart'    : 'topEnd'
                })()
                // const bestHorizontalSide: 'left' | 'right' =  rect.left + rect.width / 2 < window.innerWidth / 2 ? 'right' : 'left'
                // const bestVerticalSide: 'top' | 'bottom' =  rect.top + rect.height / 2 < window.innerHeight / 2 ? 'bottom' : 'top'
                // placement = `${bestHorizontalSide}Start` as Placement
            }
            if (placement == 'bottomStart') return { top: rect.bottom, left: rect.left }
            if (placement == 'bottom')      return { top: rect.bottom, left: rect.left + rect.width / 2, transform: 'translate(-50%)' }
            if (placement == 'bottomEnd')   return { top: rect.bottom, left: rect.right, transform: 'translate(-100%)'  }
            //
            if (placement == 'topStart')    return { top: rect.top, left: rect.left, transform: 'translateY(-100%)' }
            if (placement == 'top')         return { top: rect.top, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)' }
            if (placement == 'topEnd')      return { top: rect.top, left: rect.right, transform: 'translate(-100%, -100%)'  }

            if (placement == 'leftStart')   return { top: rect.top, left: rect.left, transform: 'translateX(-100%)' }
            if (placement == 'left')        return { top: rect.top + rect.height / 2, left: rect.left, transform: 'translate(-100%, -50%)' }
            if (placement == 'leftEnd')     return { top: rect.bottom, left: rect.left, transform: 'translate(-100%, -100%)' }

            if (placement == 'rightStart')  return { top: rect.top, left: rect.right,  }
            if (placement == 'right')       return { top: rect.top + rect.height / 2, left: rect.right, transform: 'translateY(-50%)' }
            if (placement == 'rightEnd')    return { top: rect.bottom, left: rect.right, transform: 'translateY(-100%)' }

            return { top: rect.bottom, left: rect.left }
        })()
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
