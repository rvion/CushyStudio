import { regionMonitor } from '../regions/RegionMonitor'

export type RevealPlacement =
    /** ---------------------------------------------------------------------------
     * @since 2024-07-23
     * will reveal the content around the mouse pointer
     * at the time of the reveal trigger
     */
    | 'mouse'

    /** ---------------------------------------------------------------------------
     * @since 2024-07-23
     * will clamp the revealed content above the dom of the given element.
     */
    | 'above'

    // absolute placement ---------------------------------------------------------
    | 'screen'
    | 'screen-top'
    | 'screen-top-left'
    | 'screen-top-right'
    | 'screen-centered'

    // ----------------------------------------------------------------------------
    // relative to the trigger element
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

export type RevealComputedPosition = {
    top?: number | string
    left?: number | string
    bottom?: number | string
    right?: number | string
    width?: number | string
    height?: number | string
    transform?: string
}

export const computePlacement = (
    //
    placement: RevealPlacement,
    rect: DOMRect,
): RevealComputedPosition => {
    // 🔴🔴 take screen size into account
    // updatePosition = (): void => {
    //     const rect = this.anchorRef.current?.getBoundingClientRect()
    //     if (rect == null) return

    //     /* Default anchoring is to favor bottom-left */
    //     this.tooltipPosition = {
    //         top: rect.bottom + window.scrollY,
    //         left: rect.left + window.scrollX,
    //         right: undefined,
    //         bottom: undefined,
    //     }

    //     /* Which direction has more space? */
    //     const onBottom = window.innerHeight * 0.5 < (rect.top + rect.bottom) * 0.5
    //     const onLeft = window.innerWidth * 0.5 < (rect.left + rect.right) * 0.5

    //     /* Make sure pop-up always fits within screen, but isn't too large */
    //     this.tooltipMaxHeight = (window.innerHeight - rect.bottom) * 0.99

    //     // 2024-03-28 @rvion: not so sure about that use of `window.getComputedStyle(document.body).getPropertyValue('--input-height'))`
    //     // ping 🌶️
    //     const inputHeight = parseInt(window.getComputedStyle(document.body).getPropertyValue('--input-height'))
    //     /* Add 1.25 in case of headers, needs to be done properly by getting if there's a title when moving this to RevealUI. */
    //     const desiredHeight = Math.min(this.options.length * inputHeight * 1.25)
    //     const bottomSpace = window.innerHeight - rect.bottom

    //     /* Make sure pop-up never goes off-screen vertically, preferring to go on the bottom if there is space. */
    //     if (onBottom && desiredHeight > bottomSpace) {
    //         /* This probably doesn't take in to account the fact that the browser's menu bar cuts off the top. */
    //         this.tooltipMaxHeight = rect.top * 0.99

    //         this.tooltipPosition.top = undefined
    //         this.tooltipPosition.bottom = window.innerHeight - rect.top
    //     }

    //     /* Make sure pop-up never goes off-screen horizontally.  */
    //     if (onLeft) {
    //         this.tooltipPosition.left = undefined
    //         this.tooltipPosition.right = window.innerWidth - rect.right
    //     }
    // }

    // MOUSE RELATIVE ==============================================================================
    if (placement === 'mouse') {
        return {
            top: regionMonitor.mouseX,
            left: regionMonitor.mouseY,
        }
    }

    // ABOVE =======================================================================================
    if (placement === 'above') {
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        }
    }

    // ABSOLUTE ====================================================================================
    if (placement === 'screen') return { top: 0, left: 0 }
    if (placement === 'screen-top') return { top: 0, left: '50%', transform: 'translateX(-50%)' }
    if (placement === 'screen-top-left') return { top: 0, left: 0 }
    if (placement === 'screen-top-right') return { top: 0, right: 0 }
    if (placement === 'screen-centered')
        return {
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
        }

    // LEGACY ======================================================================================
    // if (placement === 'popup-xs') return { top: 0, left: 0 }
    // if (placement === 'popup-sm') return { top: 0, left: 0 }
    // if (placement === 'popup-lg') return { top: 0, left: 0 }

    // AUTO ========================================================================================
    if (placement === 'autoHorizontalStart') {
        placement = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'rightStart' : 'leftStart'
    }

    if (placement === 'autoHorizontalEnd') {
        placement = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'rightEnd' : 'leftEnd'
    }

    if (placement === 'autoVerticalStart') {
        placement = rect.top + rect.height / 2 < window.innerHeight / 2 ? 'bottomStart' : 'topStart'
    }

    if (placement === 'autoVerticalEnd') {
        placement = rect.top + rect.height / 2 < window.innerHeight / 2 ? 'bottomEnd' : 'topEnd'
    }

    if (placement === 'auto') {
        placement = ((): RevealPlacement => {
            const top = rect.top
            const bottom = window.innerHeight - rect.bottom
            const left = rect.left
            const right = window.innerWidth - rect.right
            const minX = Math.min(left, right)
            const minY = Math.min(top, bottom)
            return minY == top ? (minX == left ? 'bottomStart' : 'bottomEnd') : minX == left ? 'topStart' : 'topEnd'
        })()
        // const bestHorizontalSide: 'left' | 'right' =  rect.left + rect.width / 2 < window.innerWidth / 2 ? 'right' : 'left'
        // const bestVerticalSide: 'top' | 'bottom' =  rect.top + rect.height / 2 < window.innerHeight / 2 ? 'bottom' : 'top'
        // placement = `${bestHorizontalSide}Start` as Placement
    }
    if (placement == 'bottomStart') return { top: rect.bottom, left: rect.left }
    if (placement == 'bottom') return { top: rect.bottom, left: rect.left + rect.width / 2, transform: 'translate(-50%)' }
    if (placement == 'bottomEnd') return { top: rect.bottom, left: rect.right, transform: 'translate(-100%)' }
    //
    if (placement == 'topStart') return { top: rect.top, left: rect.left, transform: 'translateY(-100%)' }
    if (placement == 'top') return { top: rect.top, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)' }
    if (placement == 'topEnd') return { top: rect.top, left: rect.right, transform: 'translate(-100%, -100%)' }

    if (placement == 'leftStart') return { top: rect.top, left: rect.left, transform: 'translateX(-100%)' }
    if (placement == 'left') return { top: rect.top + rect.height / 2, left: rect.left, transform: 'translate(-100%, -50%)' }
    if (placement == 'leftEnd') return { top: rect.bottom, left: rect.left, transform: 'translate(-100%, -100%)' }

    if (placement == 'rightStart') return { top: rect.top, left: rect.right }
    if (placement == 'right') return { top: rect.top + rect.height / 2, left: rect.right, transform: 'translateY(-50%)' }
    if (placement == 'rightEnd') return { top: rect.bottom, left: rect.right, transform: 'translateY(-100%)' }

    return { top: rect.bottom, left: rect.left }
}
