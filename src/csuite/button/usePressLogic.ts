let draggedElement: HTMLElement | null = null
let startingState: boolean = false
let currentToggleGroup: string | null = null
// let isDragging: boolean = false

const isDraggingListener = (ev: MouseEvent): void => {
   if (ev.button == 0) {
      // isDragging = false
      draggedElement = null
      window.removeEventListener('mouseup', isDraggingListener, true)
   }
}

export const usePressLogic = <T extends Element = HTMLElement>(
   p: {
      onMouseDown?: (ev: React.MouseEvent<T>) => void
      onMouseEnter?: (ev: React.MouseEvent<T>) => void
      onClick?: (ev: React.MouseEvent<T>) => void
   },
   param: { startingState: boolean; toggleGroup: string },
): {
   onMouseDown?: (ev: React.MouseEvent<T>) => void
   onMouseEnter?: (ev: React.MouseEvent<T>) => void
} => {
   // case 1. regular stuff
   if (p.onClick == null)
      return {
         onMouseDown: p.onMouseDown,
         onMouseEnter: p.onMouseEnter,
      }

   // case 2.
   return {
      onMouseDown: (ev: React.MouseEvent<T>): void => {
         if (ev.button == 0) {
            currentToggleGroup = param.toggleGroup
            p.onMouseDown?.(ev)
            p.onClick?.(ev)
            draggedElement = ev.currentTarget as unknown as HTMLElement
            startingState = !param.startingState
            // isDragging = true
            window.addEventListener('mouseup', isDraggingListener, true)
         }
      },
      onMouseEnter: (ev: React.MouseEvent<T, MouseEvent>): void => {
         if (startingState === param.startingState) return
         if (draggedElement != null && currentToggleGroup === param.toggleGroup) p.onClick?.(ev)
      },
   }
}
