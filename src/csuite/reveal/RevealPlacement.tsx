import {
   computePlacement_autoVerticalEndFixedSize,
   computePlacement_autoVerticalStartFixedSize,
} from './compute-placement'

export type RevealPlacement =
   /** ---------------------------------------------------------------------------
    * @since 2024-07-23
    * will clamp the revealed content above the dom of the given element.
    */
   | 'above'
   | 'above-no-clamp'

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
   | 'cover'

   //
   | 'auto'
   | 'autoVerticalStart'
   | 'autoVerticalEnd'
   | 'autoHorizontalStart'
   | 'autoHorizontalEnd'
   | 'autoVerticalStartFixedSize'
   | 'autoVerticalEndFixedSize'

export type RevealComputedPosition = {
   top?: number | string
   left?: number | string
   bottom?: number | string
   right?: number | string
   width?: number | string
   height?: number | string

   // those two properties are inserted as a second pass
   // to clamp reveal to the visible area
   maxWidth?: number | string
   maxHeight?: number | string
   minWidth?: number | string
   minHeight?: number | string

   //
   transform?: string
}

export const computePlacement = (
   //
   placement: RevealPlacement,
   anchor: DOMRect | null,
   shell: DOMRect | null,
): RevealComputedPosition => {
   // 2024-09-06 domi: we could consider something like https://floating-ui.com/docs/tutorial
   // it seems to exclusively handle the positioning
   // may do that well and integrate with our custom reveal

   // ABSOLUTE ====================================================================================
   if (placement === 'screen')
      return {
         top: 0,
         left: 0,
         maxWidth: '100vw',
         maxHeight: '98vh',
      }

   if (placement === 'screen-top')
      return {
         top: 0,
         left: '50%',
         transform: 'translateX(-50%)',
         maxWidth: '100vw',
         maxHeight: '98vh',
      }

   if (placement === 'screen-top-left')
      return {
         top: 0,
         left: 0,
         maxWidth: '100vw',
         maxHeight: '98vh',
      }

   if (placement === 'screen-top-right')
      return {
         top: 0,
         right: 0,
         maxWidth: '100vw',
         maxHeight: '98vh',
      }

   if (placement === 'screen-centered')
      return {
         top: '50%',
         left: '50%',
         transform: 'translateX(-50%) translateY(-50%)',
         maxWidth: '100vw',
         maxHeight: '98vh',
      }

   if (anchor == null) {
      return {
         top: 0,
         left: 0,
      }
   }

   // ABOVE =======================================================================================
   if (placement === 'above') {
      return {
         top: anchor.top,
         left: anchor.left,
         width: anchor.width,
         height: anchor.height,
         maxWidth: anchor.width, // do we need do double the information ?
         maxHeight: anchor.height, // do we need do double the information ?
         // TODO: review those two lines below:
         minWidth: anchor.width,
         minHeight: anchor.height,
      }
   }

   if (placement === 'above-no-clamp') {
      return {
         top: anchor.top,
         left: anchor.left,
         // TODO: review those two lines below:
         minWidth: anchor.width,
         minHeight: anchor.height,
      }
   }
   // AUTO ========================================================================================
   if (placement === 'autoHorizontalStart') {
      placement =
         anchor.left + anchor.width / 2 < window.innerWidth / 2 //
            ? 'rightStart'
            : 'leftStart'
   }

   if (placement === 'autoHorizontalEnd') {
      placement =
         anchor.left + anchor.width / 2 < window.innerWidth / 2 //
            ? 'rightEnd'
            : 'leftEnd'
   }

   if (placement === 'autoVerticalStart') {
      placement =
         anchor.top + anchor.height / 2 < window.innerHeight / 2 //
            ? 'bottomStart'
            : 'topStart'
   }

   if (placement === 'autoVerticalEnd') {
      placement =
         anchor.top + anchor.height / 2 < window.innerHeight / 2 //
            ? 'bottomEnd'
            : 'topEnd'
   }

   if (placement === 'auto') {
      placement = ((): RevealPlacement => {
         const top = anchor.top
         const bottom = window.innerHeight - anchor.bottom
         const left = anchor.left
         const right = window.innerWidth - anchor.right
         const minX = Math.min(left, right)
         const minY = Math.min(top, bottom)
         return minY == top
            ? minX == left
               ? 'bottomStart'
               : 'bottomEnd'
            : minX == left
              ? 'topStart'
              : 'topEnd'
      })()
      // const bestHorizontalSide: 'left' | 'right' =  rect.left + rect.width / 2 < window.innerWidth / 2 ? 'right' : 'left'
      // const bestVerticalSide: 'top' | 'bottom' =  rect.top + rect.height / 2 < window.innerHeight / 2 ? 'bottom' : 'top'
      // placement = `${bestHorizontalSide}Start` as Placement
   }

   // BOTTOM --------------------------------------------------------------

   // |--------------------|
   // |                    |
   // |      [anchor]      |
   // |      [XXXXXXXXXXXX]|
   // |--------------------|
   if (placement == 'bottomStart')
      return {
         top: anchor.bottom,
         left: anchor.left,
         maxWidth: `calc(100vw - ${anchor.left}px)`,
         maxHeight: `calc(98vh - ${anchor.bottom}px)`,
      }

   // |--------------------|
   // |                    |
   // |      [anchor]      |
   // |   [XXXXXXXXXXXX]   |
   // |--------------------|
   if (placement == 'bottom')
      return {
         top: anchor.bottom,
         left: anchor.left + anchor.width / 2,
         transform: 'translate(-50%)',
         maxWidth: undefined, // '❓',
         maxHeight: `calc(98vh - ${anchor.bottom}px)`,
      }

   // |--------------------|
   // |                    |
   // |      [anchor]      |
   // |[XXXXXXXXXXXX]      |
   // |--------------------|
   if (placement == 'bottomEnd')
      return {
         top: anchor.bottom,
         left: anchor.right,
         transform: 'translate(-100%)',
         maxWidth: `${anchor.right}px`,
         maxHeight: `calc(98vh - ${anchor.bottom}px)`,
      }

   // TOP -----------------------------------------------------------------
   // |--------------------|
   // |      [XXXXXXXXXXXX]|
   // |      [anchor]      |
   // |                    |
   // |--------------------|
   if (placement == 'topStart')
      return {
         top: anchor.top,
         left: anchor.left,
         transform: 'translateY(-100%)',
         maxWidth: `calc(100vw - ${anchor.left}px)`,
         maxHeight: `${anchor.top}px`,
      }

   // |--------------------|
   // |   [XXXXXXXXXXXX]   |
   // |      [anchor]      |
   // |                    |
   // |--------------------|
   if (placement == 'top')
      return {
         top: anchor.top,
         left: anchor.left + anchor.width / 2,
         transform: 'translate(-50%, -100%)',
         maxWidth: undefined, // '❓',
         maxHeight: `${anchor.top}px`,
      }

   // |--------------------|
   // |[XXXXXXXXXXXX]      |
   // |      [anchor]      |
   // |                    |
   // |--------------------|
   if (placement == 'topEnd')
      return {
         top: anchor.top,
         left: anchor.right,
         transform: 'translate(-100%, -100%)',
         maxWidth: `${anchor.right}px`,
         maxHeight: `${anchor.top}px`,
      }

   // LEFT -----------------------------------------------------------------

   // |--------------------|
   // |                    |
   // |[xxxx][anchor]      |
   // |[xxxx]              |
   // |--------------------|
   if (placement == 'leftStart')
      return {
         top: anchor.top,
         left: anchor.left,
         transform: 'translateX(-100%)',
         maxWidth: `${anchor.left}px`,
         maxHeight: `calc(98vh - ${anchor.top}px)`,
      }

   // |--------------------|
   // |[xxxx]              |
   // |[xxxx][anchor]      |
   // |[xxxx]              |
   // |--------------------|
   if (placement == 'left')
      return {
         top: anchor.top + anchor.height / 2,
         left: anchor.left,
         transform: 'translate(-100%, -50%)',
         maxWidth: `${anchor.left}px`,
         maxHeight: undefined, // '❓',
      }

   // |--------------------|
   // |[xxxx]              |
   // |[xxxx][anchor]      |
   // |                    |
   // |--------------------|
   if (placement == 'leftEnd')
      return {
         top: anchor.bottom,
         left: anchor.left,
         transform: 'translate(-100%, -100%)',
         maxWidth: `${anchor.left}px`,
         maxHeight: `${anchor.bottom}px`,
      }

   // RIGHT -----------------------------------------------------------------

   // |--------------------|
   // |                    |
   // |      [anchor][xxxx]|
   // |              [xxxx]|
   // |--------------------|
   if (placement == 'rightStart')
      return {
         top: anchor.top,
         left: anchor.right,
         maxWidth: `calc(100vw - ${anchor.right}px)`,
         maxHeight: `calc(98vh - ${anchor.top}px)`,
      }

   // |--------------------|
   // |              [xxxx]|
   // |      [anchor][xxxx]|
   // |              [xxxx]|
   // |--------------------|
   if (placement == 'right')
      return {
         top: anchor.top + anchor.height / 2,
         left: anchor.right,
         transform: 'translateY(-50%)',
         maxWidth: `calc(100vw - ${anchor.right}px)`,
         maxHeight: undefined /* ❓ 🔴 */,
      }

   // |--------------------|
   // |              [xxxx]|
   // |      [anchor][xxxx]|
   // |                    |
   // |--------------------|
   if (placement == 'rightEnd')
      return {
         top: anchor.bottom,
         left: anchor.right,
         transform: 'translateY(-100%)',
         maxWidth: `calc(100vw - ${anchor.right}px)`,
         maxHeight: `${anchor.bottom}px`,
      }

   // |--------------------|
   // |                    |
   // |      [XXXXXXXXXXXX]|
   // |      [XXXXXXXXXXXX]|
   // |--------------------|
   const WINDOW_PADDING = 5
   if (placement == 'cover')
      return {
         top: anchor.top - 1, // 🔴 -1 due to shell border, does not belongs here though
         left: anchor.left - 1,
         maxWidth: `calc(100vw - ${anchor.left + WINDOW_PADDING}px)`, //
         maxHeight: `calc(98vh - ${anchor.top + WINDOW_PADDING}px)`,
      }

   if (placement == 'autoVerticalStartFixedSize') {
      return computePlacement_autoVerticalStartFixedSize({ anchor, shell, window })
   }

   if (placement == 'autoVerticalEndFixedSize') {
      return computePlacement_autoVerticalEndFixedSize({ anchor, shell, window })
   }

   return {
      top: anchor.bottom,
      left: anchor.left,
   }
}
