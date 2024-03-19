export type RevealPlacement =
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

export const computePlacement = (
    //
    placement: RevealPlacement,
    rect: DOMRect,
): {
    top: number
    left: number
    transform?: string
} => {
    if (placement == 'popup-xs') return { top: 0, left: 0 }
    if (placement == 'popup-sm') return { top: 0, left: 0 }
    if (placement == 'popup-lg') return { top: 0, left: 0 }

    if (placement == 'auto') {
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
