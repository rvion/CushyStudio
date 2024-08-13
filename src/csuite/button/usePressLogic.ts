let draggedElement: HTMLElement | null = null
let startingState: boolean = false
// let isDragging = false

const isDraggingListener = (ev: MouseEvent) => {
    if (ev.button == 0) {
        // isDragging = false
        draggedElement = null
        window.removeEventListener('mouseup', isDraggingListener, true)
    }
}

export const usePressLogic = (
    p: {
        onMouseDown?: (ev: React.MouseEvent<HTMLDivElement>) => void
        onMouseEnter?: (ev: React.MouseEvent<HTMLDivElement>) => void
        onClick?: (ev: React.MouseEvent<HTMLDivElement>) => void
    },
    value: boolean,
) => {
    // case 1. regular stuff
    if (p.onClick == null)
        return {
            onMouseDown: p.onMouseDown,
            onMouseEnter: p.onMouseEnter,
        }

    // case 2.
    return {
        onMouseDown: (ev: React.MouseEvent<HTMLDivElement>) => {
            if (ev.button == 0) {
                p.onMouseDown?.(ev)
                p.onClick?.(ev)
                draggedElement = ev.currentTarget
                startingState = !value
                // isDragging = true
                window.addEventListener('mouseup', isDraggingListener, true)
            }
        },
        onMouseEnter: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (startingState === value) return
            if (draggedElement != null) p.onClick?.(ev)
        },
    }
}
