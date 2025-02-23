import { useCallback } from 'react'

/**
 * from https://github.com/react-dnd/react-dnd/issues/3655#issuecomment-2578808024
 * Returns a callback ref that calls `drag(element)` when the DOM node is attached.
 */
export function useDragDropRefForReact19(
   drag: (el: HTMLDivElement) => void,
): (element: HTMLDivElement | null) => void {
   return useCallback(
      (element: HTMLDivElement | null) => {
         if (element) drag(element)
      },
      [drag],
   )
}
