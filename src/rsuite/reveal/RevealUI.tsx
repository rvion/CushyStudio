import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { ModalShellUI } from './ModalShell'
import { RevealProps } from './RevealProps'
import { RevealState } from './RevealState'
import { useSt } from 'src/state/stateContext'

export const RevealUI = observer(function Tooltip_(p: RevealProps) {
    const uist = useMemo(() => new RevealState(p), [])
    const st = useSt()
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
              uist.placement.startsWith('#') ? (
                  <div
                      ref={(e) => {
                          if (e == null) return st._popups.filter((p) => p !== uist)
                          st._popups.push(uist)
                      }}
                      onKeyUp={(ev) => {
                          if (ev.key === 'Escape') {
                              uist.close()
                              ev.stopPropagation()
                              ev.preventDefault()
                          }
                      }}
                      onClick={(ev) => {
                          p.onClick?.(ev)
                          uist.close()
                          ev.stopPropagation()
                          ev.preventDefault()
                      }}
                      style={{ zIndex: 99999999, backgroundColor: '#0000003d' }}
                      tw='pointer-events-auto w-full h-full flex items-center justify-center z-50'
                  >
                      {p.children[1]}
                  </div>
              ) : uist.placement.startsWith('popup') ? (
                  <div
                      ref={(e) => {
                          if (e == null) return st._popups.filter((p) => p !== uist)
                          st._popups.push(uist)
                      }}
                      onKeyUp={(ev) => {
                          if (ev.key === 'Escape') {
                              uist.close()
                              ev.stopPropagation()
                              ev.preventDefault()
                          }
                      }}
                      onClick={(ev) => {
                          p.onClick?.(ev)
                          uist.close()
                          ev.stopPropagation()
                          ev.preventDefault()
                      }}
                      style={{ zIndex: 99999999, backgroundColor: '#0000003d' }}
                      tw='pointer-events-auto absolute w-full h-full flex items-center justify-center z-50'
                  >
                      {/* <ModalShellUI>{p.children[1]}</ModalShellUI> */}
                      <ModalShellUI title={p.title}>{p.children[1]}</ModalShellUI>
                  </div>
              ) : (
                  <div
                      className={p.tooltipWrapperClassName}
                      tw={['_RevealUI card card-bordered bg-base-100 shadow-xl pointer-events-auto']}
                      // 👇 ❌ [break the dropdown]
                      // ⏸️   onMouseDown={(ev) => {
                      // ⏸️       p.onClick?.(ev)
                      // ⏸️       uist.close()
                      // ⏸️       ev.stopPropagation()
                      // ⏸️       ev.preventDefault()
                      // ⏸️   }}
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
                      {p.title ? (
                          <div tw='px-2'>
                              <div tw='py-0.5'>{p.title}</div>
                              <div tw='w-full rounded bg-neutral-content' style={{ height: '1px' }}></div>
                          </div>
                      ) : (
                          <></>
                      )}
                      {p.children[1]}
                      {uist._lock ? (
                          <span tw='opacity-50 italic text-sm flex gap-1 items-center justify-center'>
                              <span className='material-symbols-outlined'>lock</span>
                              locked; right-click to unlock
                          </span>
                      ) : null}
                  </div>
              ),
              document.getElementById(
                  p.placement?.startsWith('#') //
                      ? p.placement.slice(1)
                      : 'tooltip-root',
              )!,
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
            // ⏸️ onMouseDown={(ev) => {
            // ⏸️     ev.stopPropagation()
            // ⏸️     ev.preventDefault()
            // ⏸️ }}
            onClick={
                uist.triggerOnClick
                    ? (ev) => {
                          ev.stopPropagation()
                          ev.preventDefault()
                          if (uist.visible) uist.leaveAnchor()
                          else uist.enterAnchor()
                      }
                    : undefined
            }
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
