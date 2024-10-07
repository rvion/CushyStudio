let draggedElement: HTMLElement | null = null
let startingState: boolean = false
let currentToggleGroup: SharedClickAndSlideKey | null = null

// let isDragging = false

type MouseEvCallback = (ev: React.MouseEvent<HTMLDivElement>) => void

export type SharedClickAndSlideKey = string
export type ClickAndSlideConf = {
    startingState: boolean
    toggleGroup: SharedClickAndSlideKey
}

const mouseUpHandler = (ev: MouseEvent): void => {
    if (ev.button == 0) {
        // isDragging = false
        draggedElement = null
        window.removeEventListener('mouseup', mouseUpHandler, true)
    }
}

export const usePressLogic = (
    handlers: {
        onMouseDown?: MouseEvCallback
        onMouseEnter?: MouseEvCallback
        onClick?: MouseEvCallback
    },
    conf: ClickAndSlideConf,
): {
    onMouseDown: MouseEvCallback | undefined
    onMouseEnter: MouseEvCallback | undefined
} => {
    // case 1. regular stuff
    if (handlers.onClick == null)
        return {
            onMouseDown: handlers.onMouseDown,
            onMouseEnter: handlers.onMouseEnter,
        }

    // case 2.
    return {
        onMouseDown: (ev: React.MouseEvent<HTMLDivElement>): void => {
            if (ev.button == 0) {
                currentToggleGroup = conf.toggleGroup
                handlers.onMouseDown?.(ev)
                handlers.onClick?.(ev)
                draggedElement = ev.currentTarget
                startingState = !conf.startingState
                // isDragging = true
                window.addEventListener('mouseup', mouseUpHandler, true)
            }
        },
        onMouseEnter: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
            if (startingState === conf.startingState) return
            if (draggedElement != null && currentToggleGroup === conf.toggleGroup) handlers.onClick?.(ev)
        },
    }
}
