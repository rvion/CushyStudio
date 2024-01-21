import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { RevealState, defaultHideDelay, defaultShowDelay } from './RevealState'

export const RevealUI = observer(function Tooltip_(p: {
    //
    children: [React.ReactNode, React.ReactNode]
    tooltipWrapperClassName?: string
    className?: string
    showDelay?: number
    hideDelay?: number
    enableRightClick?: boolean
    cursor?: string
    disableHover?: boolean
    disableClick?: boolean
    style?: React.CSSProperties
}) {
    const showDelay = p.showDelay ?? defaultShowDelay
    const hideDelay = p.hideDelay ?? defaultHideDelay
    const disableHover = p.disableHover ?? false
    const uist = useMemo(
        () =>
            new RevealState(
                //
                showDelay,
                hideDelay,
                disableHover,
            ),
        [showDelay, hideDelay, disableHover],
    )
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (uist.visible && ref.current) {
            const rect = ref.current.getBoundingClientRect()
            uist.setPosition(rect)
        }
    }, [uist.visible])

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
                  style={{
                      //   borderTop: uist._lock ? '1px dashed yellow' : undefined,
                      position: 'absolute',
                      zIndex: 99999999,
                      top: `${uist.tooltipPosition.top}px`,
                      left: `${uist.tooltipPosition.left}px`,
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
            tw={[p.cursor ?? uist.defaultCursor]}
            className={p.className}
            ref={ref}
            style={p.style}
            onContextMenu={uist.toggleLock}
            onMouseEnter={uist.onMouseEnterAnchor}
            onMouseLeave={uist.onMouseLeaveAnchor}
            onClick={(ev) => {
                if (p.disableClick) return
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
