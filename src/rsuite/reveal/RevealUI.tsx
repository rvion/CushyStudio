import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { defaultShowDelay, defaultHideDelay, RevealState } from './RevealState'

export const RevealUI = observer(function Tooltip_(p: {
    //
    children: [React.ReactNode, React.ReactNode]
    tooltipWrapperClassName?: string[]
    disableHover?: boolean
    className?: string
    showDelay?: number
    hideDelay?: number
    enableRightClick?: boolean
    cursor?: string
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
                  tw={[
                      '_RevealUI card card-bordered bg-base-100 shadow-xl pointer-events-auto',
                      ...(p.tooltipWrapperClassName ?? []),
                  ]}
                  onClick={(ev) => {
                      ev.stopPropagation()
                      ev.preventDefault()
                  }}
                  onMouseEnter={uist.onMouseEnterTooltip}
                  onMouseLeave={uist.onMouseLeaveTooltip}
                  onContextMenu={uist.enterAnchor}
                  style={{
                      position: 'absolute',
                      zIndex: 99999999,
                      top: `${uist.tooltipPosition.top}px`,
                      left: `${uist.tooltipPosition.left}px`,
                      // Adjust positioning as needed
                  }}
              >
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
            onContextMenu={uist.toggleLock}
            onMouseEnter={uist.onMouseEnterAnchor}
            onMouseLeave={uist.onMouseLeaveAnchor}
            onClick={(ev) => {
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
