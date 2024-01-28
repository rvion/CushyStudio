import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { RevealProps } from './RevealProps'
import { RevealState } from './RevealState'

export const RevealUI = observer(function Tooltip_(p: RevealProps) {
    const uist = useMemo(() => new RevealState(p), [])
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (uist.visible && ref.current) {
            const rect = ref.current.getBoundingClientRect()
            uist.setPosition(rect)
        }
    }, [uist.visible])

    const pos = uist.tooltipPosition
    const tooltip = uist.visible
        ? createPortal(
              <div
                  className={p.tooltipWrapperClassName}
                  tw={['_RevealUI card card-bordered bg-base-100 shadow-xl pointer-events-auto']}
                  onClick={(ev) => {
                      ev.stopPropagation()
                      ev.preventDefault()
                  }}
                  onMouseEnter={uist.onMouseEnterTooltip}
                  onMouseLeave={uist.onMouseLeaveTooltip}
                  onContextMenu={uist.enterAnchor}
                  // prettier-ignore
                  style={{
                      //   borderTop: uist._lock ? '1px dashed yellow' : undefined,
                      position: 'absolute',
                      zIndex: 99999999,
                      top:    pos.top    ? `${pos.top}px`    : undefined,
                      bottom: pos.bottom ? `${pos.bottom}px` : undefined,
                      left:   pos.left   ? `${pos.left}px`   : undefined,
                      right:  pos.right  ? `${pos.right}px`  : undefined,
                      transform: pos.transform,
                      // Adjust positioning as needed
                  }}
              >
                  {uist._lock ? <span tw='opacity-50 italic text-sm'>locked; right-click to unlock</span> : null}
                  {p.children[1]}
              </div>,
              document.getElementById('tooltip-root')!,
          )
        : null

    return (
        <span //
            tw={uist.defaultCursor}
            className={p.className}
            ref={ref}
            style={p.style}
            onContextMenu={uist.toggleLock}
            onMouseEnter={uist.onMouseEnterAnchor}
            onMouseLeave={uist.onMouseLeaveAnchor}
            onClick={(ev) => {
                if (!uist.triggerOnClick) return
                ev.stopPropagation()
                ev.preventDefault()
                if (uist.visible) uist.leaveAnchor()
                else uist.enterAnchor()
            }}
        >
            {/* {uist.inAnchor ? '🟢' : '❌'} */}
            {/* {uist.inTooltip ? '🟢' : '❌'} */}
            {/* {uist.enterAnchorTimeoutId ? '🟢1' : ''} */}
            {/* {uist.leaveAnchorTimeoutId ? '❌1' : ''} */}
            {p.children[0]}
            {/* {uist.enterTooltipTimeoutId ? '🟢2' : ''} */}
            {/* {uist.leaveTooltipTimeoutId ? '❌2' : ''} */}
            {tooltip}
        </span>
    )
})
