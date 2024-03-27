import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { ModalShellUI } from './ModalShell'
import { RevealProps } from './RevealProps'
import { RevealState } from './RevealState'

// RevealUI is a bit perf-sensitive,
// so we use a lazy memo to avoid creating the state object
// until it's absolutely needed
export const useMemoLazy = <T extends any>(fn: () => T): { uist: T | null; uist2(): T } =>
    useMemo(() => {
        let x = observable({
            uist: null as T | null,
            uist2: () => {
                if (x.uist) return x.uist
                console.log(`[💙] init RevealUI`)
                x.uist = fn()
                return x.uist
            },
        })
        return x
    }, [])

export const RevealUI = observer(function RevealUI_(p: RevealProps) {
    const { uist, uist2 } = useMemoLazy(() => new RevealState(p))
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (uist?.visible && ref.current) {
            const rect = ref.current.getBoundingClientRect()
            uist.setPosition(rect)
        }
    }, [uist?.visible])
    const content = p.children
    const tooltip = mkTooltip(uist)
    return (
        <span //
            tw={uist?.defaultCursor}
            className={p.className}
            ref={ref}
            style={p.style}
            onContextMenu={() => uist2().toggleLock()}
            onMouseEnter={() => uist2().onMouseEnterAnchor()}
            onMouseLeave={() => uist2().onMouseLeaveAnchor()}
            onClick={(ev) => {
                const uist = uist2()
                const toc = uist.triggerOnClick
                if (!toc) return
                ev.stopPropagation()
                ev.preventDefault()
                if (uist.visible) uist.leaveAnchor()
                else uist.enterAnchor()
            }}
        >
            {content}
            {tooltip}
        </span>
    )
})

const mkTooltip = (uist: RevealState | null) => {
    // ensure uist initialized
    if (uist == null) return null

    // ensure uist visible
    if (!uist?.visible) return null

    // find element to attach to
    const element = document.getElementById(
        uist.p.placement?.startsWith('#') //
            ? uist.p.placement.slice(1)
            : 'tooltip-root',
    )!

    const pos = uist.tooltipPosition
    const p = uist.p

    const hiddenContent = p.content()

    const revealedContent = uist.placement.startsWith('#') ? (
        <div
            ref={(e) => {
                if (e == null) return cushy._popups.filter((p) => p !== uist)
                cushy._popups.push(uist)
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
            {hiddenContent}
        </div>
    ) : uist.placement.startsWith('popup') ? (
        <div
            ref={(e) => {
                if (e == null) return cushy._popups.filter((p) => p !== uist)
                cushy._popups.push(uist)
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
            <ModalShellUI title={p.title}>{hiddenContent}</ModalShellUI>
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
            {hiddenContent}
            {uist._lock ? (
                <span tw='opacity-50 italic text-sm flex gap-1 items-center justify-center'>
                    <span className='material-symbols-outlined'>lock</span>
                    locked; right-click to unlock
                </span>
            ) : null}
        </div>
    )
    return createPortal(revealedContent, element)
}
