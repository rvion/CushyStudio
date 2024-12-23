export function computePlacement_autoVerticalStartFixedSize(p: {
   anchor: Pick<DOMRect, 'top' | 'height' | 'left'> | null
   shell: Pick<DOMRect, 'width' | 'height'> | null
   window: Pick<Window, 'innerHeight' | 'innerWidth'>
}): {
   left: number
   bottom?: number
   top?: number
} {
   const anchorLeft = p.anchor?.left ?? 0
   const shellWidth = p.shell?.width ?? 0

   const left = Math.max(0, anchorLeft - Math.max(0, anchorLeft + shellWidth - p.window.innerWidth))

   const vPos = computeVerticalPosition({ anchor: p.anchor, shell: p.shell, window: p.window })

   return { left, ...vPos }
}

export function computePlacement_autoVerticalEndFixedSize(p: {
   anchor: Pick<DOMRect, 'top' | 'height' | 'right'> | null
   shell: Pick<DOMRect, 'width' | 'height'> | null
   window: Pick<Window, 'innerHeight' | 'innerWidth'>
}): {
   right: number
   bottom?: number
   top?: number
} {
   const anchorRight = p.anchor?.right ?? 0
   const shellWidth = p.shell?.width ?? 0

   const right = Math.max(0, anchorRight - Math.max(0, anchorRight + shellWidth - p.window.innerWidth))

   const vPos = computeVerticalPosition({ anchor: p.anchor, shell: p.shell, window: p.window })

   return { right, ...vPos }
}

function computeVerticalPosition(p: {
   anchor: Pick<DOMRect, 'top' | 'height'> | null
   shell: Pick<DOMRect, 'height'> | null
   window: Pick<Window, 'innerHeight'>
}): {
   top?: number
   bottom?: number
} {
   const anchorTop = p.anchor?.top ?? 0
   const anchorHeight = p.anchor?.height ?? 0
   const shellHeight = p.shell?.height ?? 0

   const isAnchorOnTheTopHalf = anchorTop + anchorHeight / 2 <= p.window.innerHeight / 2

   const possibleTopPosition = anchorTop + anchorHeight
   const possibleBottomPosition = p.window.innerHeight - anchorTop

   return isAnchorOnTheTopHalf
      ? {
           top: Math.max(
              0,
              possibleTopPosition - Math.max(0, possibleTopPosition + shellHeight - p.window.innerHeight),
           ),
        }
      : {
           bottom:
              possibleBottomPosition -
              Math.max(0, possibleBottomPosition + shellHeight - p.window.innerHeight),
        }
}
