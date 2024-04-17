import type { RevealProps } from './RevealProps'

import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { ModalShellUI } from './ModalShell'
import { RevealCtx, useRevealOrNull } from './RevealCtx'
import { global_RevealStack } from './RevealStack'
import { RevealState, RevealStateLazy } from './RevealState'

export const RevealUI = observer(function RevealUI_(p: RevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const parents: RevealStateLazy[] = useRevealOrNull()?.tower ?? []

    // Eagerly retreiving parents is OK here cause as a children, we expects our parents to exist.
    const self = useMemo(() => new RevealStateLazy(p, parents.map((p) => p.getUist())), []) // prettier-ignore
    const { uistOrNull, getUist: uist2 } = self
    const nextTower = useMemo(() => ({ tower: [...parents, self] }), [])

    // once updated, make sure to keep props in sync so hot reload work well enough.
    useEffect(() => {
        const x = uistOrNull
        if (x == null) return
        if (p.content !== x.p.content) x.contentFn = p.content
        if (p.trigger !== x.p.trigger) x.p.trigger = p.trigger
        if (p.placement !== x.p.placement) x.p.placement = p.placement
        if (p.showDelay !== x.p.showDelay) x.p.showDelay = p.showDelay
        if (p.hideDelay !== x.p.hideDelay) x.p.hideDelay = p.hideDelay
    }, [p.content, p.trigger, p.placement, p.showDelay, p.hideDelay])

    // update position in case something moved or scrolled
    useEffect(() => {
        if (uistOrNull?.visible && ref.current) {
            const rect = ref.current.getBoundingClientRect()
            uistOrNull.setPosition(rect)
        }
    }, [uistOrNull?.visible])

    const content = p.children
    const tooltip = mkTooltip(uistOrNull)

    // this span could be bypassed by cloning the child element and injecting props, assuming the child will mount them
    const anchor = (
        <span //
            tw={['inline-block ui-reveal-anchor', uistOrNull?.defaultCursor ?? 'cursor-pointer']}
            className={p.className}
            ref={ref}
            style={p.style}
            // style={{ ...p.style, ...uistOrNull?.debugColor }}
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
    return <RevealCtx.Provider value={nextTower}>{anchor}</RevealCtx.Provider>
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

    const hiddenContent = uist.contentFn()

    const revealedContent = uist.placement.startsWith('#') ? (
        <div
            ref={(e) => {
                if (e == null) return global_RevealStack.filter((p) => p !== uist)
                global_RevealStack.push(uist)
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
                if (e == null) return global_RevealStack.filter((p) => p !== uist)
                global_RevealStack.push(uist)
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
            <ModalShellUI
                close={() => {
                    uist.close()
                }}
                title={p.title}
            >
                {hiddenContent}
            </ModalShellUI>
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

// -----------------------------------------------------------------------------
// 🔵 TODO: add some global way to force-open any reveal by UID
// const knownReveals = new WeakMap<string>(...)
// export const triggerReveal_UNSAFE = (p: RevealID) => {
// ...
// }
// -----------------------------------------------------------------------------
