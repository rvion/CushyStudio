import type { RevealProps } from './RevealProps'
import type { RevealState } from './RevealState'
import type { RevealShellProps } from './shells/ShellProps'
import type { FC, ForwardedRef, ReactPortal } from 'react'

import { observer } from 'mobx-react-lite'
import React, { cloneElement, createElement, forwardRef, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { cls } from '../../widgets/misc/cls'
import { objectAssignTsEfficient_t_t } from '../utils/objectAssignTsEfficient'
import { RevealBackdropUI } from './RevealBackdropUI'
import { whitelistedClonableComponents } from './RevealCloneWhitelist'
import { RevealCtx, useRevealOrNull } from './RevealCtx'
import { RevealStateLazy } from './RevealStateLazy'
import { ShellNoneUI } from './shells/ShellNone'
import { ShellPopoverUI } from './shells/ShellPopover'
import { ShellPopupLGUI, ShellPopupSMUI, ShellPopupUI } from './shells/ShellPopupUI'

export const RevealUI = observer(
    forwardRef(function RevealUI_(p: RevealProps, ref2?: ForwardedRef<RevealStateLazy>) {
        const ref = p.sharedAnchorRef ?? useRef<HTMLDivElement>(null) // 🔴
        const parents: RevealStateLazy[] = useRevealOrNull()?.tower ?? []

        // Eagerly retreiving parents is OK here cause as a children, we expects our parents to exist.
        const lazyState = useMemo(() => new RevealStateLazy(p, parents.map((p) => p.getRevealState())), []) // prettier-ignore
        const { state: uistOrNull } = lazyState
        const nextTower = useMemo(() => ({ tower: [...parents, lazyState] }), [])

        useEffect(() => {
            if (ref2 == null) return
            if (typeof ref2 === 'function') ref2(lazyState)
            else ref2.current = lazyState
        }, [])

        // once updated, make sure to keep props in sync so hot reload work well enough.
        useEffect(() => {
            const revealSt = uistOrNull
            if (revealSt == null) return
            if (p.content !== revealSt.p.content)
                revealSt.contentFn = (): JSX.Element => createElement(p.content, revealSt.revealContentProps)
            if (p.trigger !== revealSt.p.trigger) revealSt.p.trigger = p.trigger
            if (p.placement !== revealSt.p.placement) revealSt.p.placement = p.placement
            if (p.showDelay !== revealSt.p.showDelay) revealSt.p.showDelay = p.showDelay
            if (p.hideDelay !== revealSt.p.hideDelay) revealSt.p.hideDelay = p.hideDelay
        }, [p.content, p.trigger, p.placement, p.showDelay, p.hideDelay])

        useEffect(() => {
            if (p.defaultVisible) lazyState.getRevealState().open()
        }, [p.defaultVisible])

        // update position in case something moved or scrolled
        useEffect(() => {
            if (uistOrNull == null) return
            if (!uistOrNull.isVisible) return

            // find element to attach to
            const element =
                uistOrNull.p.relativeTo == null
                    ? ref.current
                    : // take the id by trimming the leading '#' ('#foo' => 'foo')
                      document.getElementById(uistOrNull.p.relativeTo.slice(1))!

            if (!element) return

            const rect = element.getBoundingClientRect()
            uistOrNull.setPosition(rect)
        }, [uistOrNull?.isVisible])

        // check if we can clone the child element instead of adding a div in the DOM
        // this is a micro-optimisation hack; it's probably worth it long-term, but
        // if having two code paths prooves a bad idea, we may want to revert that decision
        const shouldClone = ((): boolean => {
            if (p.UNSAFE_cloned != null) return p.UNSAFE_cloned
            const children = React.Children.toArray(p.children)
            if (children.length !== 1) return false
            const child0 = children[0]!
            const isValidElement = React.isValidElement(child0)
            if (!isValidElement) return false
            if (whitelistedClonableComponents.has(child0.type)) return true
            return false
        })()

        if (shouldClone) {
            // if (p.style != null) return <>❌ UNSAFE CLONE FAILED (p.style != null)</>
            // if (p.className != null) return <>❌ UNSAFE CLONE FAILED (p.className != null)</>
            if (!React.isValidElement(p.children)) return <>❌ UNSAFE CLONE FAILED (!React.isValidElement(p.children))</>
            // 2024-07-23: trying to remove the outer div
            // mostly working but edge cases (multiple children, forwarding props & ref by children)
            // makes it slightly unsafe / we're not sure what to do with it yet
            const child = p.children
            // prettier-ignore
            const clonedChildren = cloneElement(
                child,
                {
                    // @ts-ignore
                    ref: ref, // 🔴🔴 I guess we're overriding the Frame's ref={s.anchorRef} here?
                    style: objectAssignTsEfficient_t_t(p.style ?? {}, child.props?.style),
                    className: cls(child.props?.className, p.className),
                    onContextMenu: (ev: any) => { lazyState.onContextMenu(ev); child.props?.onContextMenu?.(ev) },
                    onClick: (ev: any)       => { lazyState.onClick(ev)      ; child.props?.onClick?.(ev) },
                    onAuxClick: (ev: any)    => { lazyState.onAuxClick(ev)   ; child.props?.onAuxClick?.(ev) },
                    onMouseEnter: (ev: any)  => { lazyState.onMouseEnter(ev) ; child.props?.onMouseEnter?.(ev) },
                    onMouseLeave: (ev: any)  => { lazyState.onMouseLeave(ev) ; child.props?.onMouseLeave?.(ev) },
                    onMouseDown: (ev: any)   => { lazyState.onMouseDown(ev)  ; child.props?.onMouseDown?.(ev) },
                    onMouseUp: (ev: any)     => { lazyState.onMouseUp(ev)    ; child.props?.onMouseUp?.(ev) },
                    onFocus: (ev: any)       => { lazyState.onFocus(ev)      ; child.props?.onFocus?.(ev) },
                    onBlur: (ev: any)        => { lazyState.onBlur(ev)       ; child.props?.onBlur?.(ev) },
                },
                <>
                    {child.props.children}
                    {mkTooltip(uistOrNull)}
                    {/* // 🔶 add the tooltip at the end of the children list */}
                </>
            )
            return <RevealCtx.Provider value={nextTower}>{clonedChildren}</RevealCtx.Provider>
        }

        // this span could be bypassed by cloning the child element and injecting props,
        // assuming the child will mount them
        return (
            <RevealCtx.Provider value={nextTower}>
                <div //
                    tw={['UI-Reveal', 'inline-flex', uistOrNull?.defaultCursor ?? 'cursor-pointer']}
                    className={p.className}
                    ref={ref}
                    style={p.style}
                    onContextMenu={lazyState.onContextMenu}
                    onClick={lazyState.onClick}
                    onAuxClick={lazyState.onAuxClick}
                    onMouseEnter={lazyState.onMouseEnter}
                    onMouseLeave={lazyState.onMouseLeave}
                    onMouseDown={lazyState.onMouseDown}
                    onMouseUp={lazyState.onMouseUp}
                    onFocus={lazyState.onFocus}
                    onBlur={lazyState.onBlur}
                >
                    {p.children /* anchor */}
                    {mkTooltip(uistOrNull) /* tooltip */}
                </div>
            </RevealCtx.Provider>
        )
    }),
)

const mkTooltip = (uist: RevealState | null): Maybe<ReactPortal> => {
    // ensure uist initialized
    if (uist == null) return null

    // ensure uist visible
    if (!uist?.isVisible) return null

    // find element to attach to
    const element = document.getElementById('tooltip-root')!

    const pos = uist.tooltipPosition
    const p = uist.p
    const hiddenContent = createElement(uist.contentFn)

    const ShellUI: React.FC<RevealShellProps> = ((): FC<RevealShellProps> => {
        const s = p.shell
        if (s === 'popover') return ShellPopoverUI
        if (s === 'none') return ShellNoneUI
        //
        if (s === 'popup') return ShellPopupUI
        if (s === 'popup-xs') return ShellPopupLGUI
        if (s === 'popup-sm') return ShellPopupSMUI
        if (s === 'popup-lg') return ShellPopupLGUI
        if (s === 'popup-xl') return ShellPopupLGUI

        return s ?? ShellPopoverUI

        // 2024-07-24 @domi: we need a shell with a backdrop here, (should probably be transparent though)
        //  | if (s == null && uist.hideTriggers.backdropClick) return RevealBackdropUI
        // 2024-07-25 @rvion: YUP, let's have that for all shells in a generic way instead ?
        //  | I went though a few use-caseds, seems to fit perfectly and solve the issue
    })()

    let revealedContent = (
        <ShellUI pos={pos} reveal={uist}>
            {hiddenContent}
        </ShellUI>
    )

    // wrap with backdrop
    if (uist.hasBackdrop) {
        revealedContent = <RevealBackdropUI reveal={uist}>{revealedContent}</RevealBackdropUI>
    }

    return createPortal(revealedContent, element)
}
