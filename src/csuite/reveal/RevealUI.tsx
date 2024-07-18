import type { RevealProps } from './RevealProps'

import { observer } from 'mobx-react-lite'
import { createElement, type ReactNode, type ReactPortal, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Frame } from '../frame/Frame'
import { ModalShellUI } from '../modal/ModalShell'
import { RevealCtx, useRevealOrNull } from './RevealCtx'
import { global_RevealStack } from './RevealStack'
import { RevealState, RevealStateLazy } from './RevealState'

export const RevealUI = observer(function RevealUI_(p: RevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const parents: RevealStateLazy[] = useRevealOrNull()?.tower ?? []

    // Eagerly retreiving parents is OK here cause as a children, we expects our parents to exist.
    const SELF = useMemo(() => new RevealStateLazy(p, parents.map((p) => p.getUist())), []) // prettier-ignore
    const { uistOrNull, getUist: uist2 } = SELF
    const nextTower = useMemo(() => ({ tower: [...parents, SELF] }), [])

    // once updated, make sure to keep props in sync so hot reload work well enough.
    useEffect(() => {
        const x = uistOrNull
        if (x == null) return
        if (p.content !== x.p.content) x.contentFn = (): ReactNode => p.content(x)
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

    const anchor = p.children
    const tooltip = mkTooltip(uistOrNull)

    // this span could be bypassed by cloning the child element and injecting props, assuming the child will mount them
    return (
        <RevealCtx.Provider value={nextTower}>
            <div //
                tw={['inline-flex', uistOrNull?.defaultCursor ?? 'cursor-pointer']}
                className={p.className}
                ref={ref}
                style={p.style}
                // lock input on shift+right click
                onContextMenu={(ev) => {
                    if (ev.shiftKey) {
                        uist2().toggleLock()
                        ev.preventDefault() //  = prevent window on non-electron apps
                        ev.stopPropagation() // = right click is consumed
                    }
                }}
                onClick={(ev) => uist2().onLeftClick(ev)}
                onAuxClick={(ev) => {
                    if (ev.button === 1) return uist2().onMiddleClick(ev)
                    if (ev.button === 2) return uist2().onRightClick(ev)
                }}
                onMouseEnter={() => uist2().onMouseEnterAnchor()}
                onMouseLeave={() => uist2().onMouseLeaveAnchor()}
            >
                {anchor}
                {tooltip}
            </div>
        </RevealCtx.Provider>
    )
})

const mkTooltip = (uist: RevealState | null): Maybe<ReactPortal> => {
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
    const hiddenContent = createElement(uist.contentFn)
    const revealedContent =
        // VIA PORTAL --------------------------------------------------------------------------------
        uist.placement.startsWith('#') ? (
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
        ) : // VIA POPUP --------------------------------------------------------------------------------
        uist.placement.startsWith('popup') ? (
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
                    // ev.preventDefault()
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
            // VIA POPOVER --------------------------------------------------------------------------------
            <Frame
                // border
                // base={0}
                shadow
                className={p.tooltipWrapperClassName}
                tw={['_RevealUI pointer-events-auto']}
                onClick={(ev) => ev.stopPropagation()}
                onMouseEnter={uist.onMouseEnterTooltip}
                onMouseLeave={uist.onMouseLeaveTooltip}
                onContextMenu={uist.enterAnchor}
                // prettier-ignore
                style={{
                  position: 'absolute',
                  zIndex: 99999999,
                  top:    pos.top    ? `${pos.top}px`    : undefined,
                  bottom: pos.bottom ? `${pos.bottom}px` : undefined,
                  left:   pos.left   ? `${pos.left}px`   : undefined,
                  right:  pos.right  ? `${pos.right}px`  : undefined,
                  transform: pos.transform,
              }}
            >
                {p.title != null && (
                    <div tw='px-2'>
                        <div tw='py-0.5'>{p.title}</div>
                        <Frame tw='w-full rounded' base={{ contrast: 0.2 }} style={{ height: '1px' }}></Frame>
                    </div>
                )}
                {hiddenContent}

                {/* LOCK */}
                {
                    uist._lock ? (
                        <Frame icon='mdiLock' text={{ contrast: 0.3 }} tw='italic text-sm flex gap-1 items-center justify-center'>
                            shift+right-click to unlock
                        </Frame>
                    ) : null
                    // <span tw='opacity-50 italic text-sm flex gap-1 items-center justify-center'>
                    //     <Ikon.mdiLockOffOutline />
                    //     shift+right-click to lock
                    // </span>
                }
            </Frame>
        )

    return createPortal(revealedContent, element)
}
