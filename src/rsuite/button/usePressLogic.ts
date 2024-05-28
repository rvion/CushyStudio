let isDragging = false
let isDraggingElement: HTMLElement | null = null

const isDraggingListener = (ev: MouseEvent) => {
    if (ev.button == 0) {
        isDragging = false
        isDraggingElement = null
        window.removeEventListener('mouseup', isDraggingListener, true)
    }
}

export const usePressLogic = (p: {
    onMouseDown?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onMouseEnter?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onClick?: (ev: React.MouseEvent<HTMLDivElement>) => void
}) => {
    // case 1. regular stuff
    if (p.onClick == null)
        return {
            onMouseDown: p.onMouseDown,
            onMouseEnter: p.onMouseEnter,
        }

    // case 2.
    return {
        onMouseDown: (ev: React.MouseEvent<HTMLDivElement>) => {
            // console.log(`[🤠] YOLO`)
            if (ev.button == 0) {
                p.onMouseDown?.(ev)
                p.onClick?.(ev)
                isDraggingElement = ev.currentTarget
                isDragging = true
                window.addEventListener('mouseup', isDraggingListener, true)
            }
        },
        onMouseEnter: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (isDraggingElement === ev.currentTarget) return
            if (isDragging) p.onClick?.(ev)
        },
    }
}
