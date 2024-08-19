import type { RevealProps } from './RevealProps'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import React from 'react'

import { DEBUG_REVEAL } from './DEBUG_REVEAL'
import { RevealState } from './RevealState'

/**
 * state wrapper that lazily initializes the actual state when actually required
 * it's important to keep that class lighweight.
 */
export class RevealStateLazy {
    uid = nanoid()
    childRef = React.createRef<HTMLDivElement>()
    constructor(
        //
        public p: RevealProps,
        public parents: RevealState[],
        public anchorRef: React.RefObject<HTMLDivElement>,
    ) {
        if (DEBUG_REVEAL) console.log(`💙 new RevealStateLazy (lazyId: ${this.uid} / props: ${p.placement})`)
        makeAutoObservable(this, {
            p: false,
            anchorRef: false, // 🚨 ref do not work when observables!
        })
    }

    state: RevealState | null = null

    getRevealState = (): RevealState => {
        if (this.state) return this.state
        this.state = new RevealState({ ...this.p }, this.parents, this.anchorRef)
        if (DEBUG_REVEAL) this.state.log(`💙 init`)
        return this.state!
    }

    // all of those callbacks are for anchor ----------------------------------------
    onContextMenu = (ev: React.MouseEvent<unknown>): void => {
        // lock input on shift+right click
        if (ev.shiftKey) {
            this.getRevealState().toggleLock()
            ev.preventDefault() //  = prevent window on non-electron apps
            ev.stopPropagation()
        }
    }

    onClick = (ev: React.MouseEvent<unknown>): void => {
        return this.getRevealState().onLeftClickAnchor(ev)
    }
    // 🧑‍🎤 onMouseDown = (ev: React.MouseEvent<unknown>): void => {
    // 🧑‍🎤     return this.getRevealState().onMouseDownAnchor(ev)
    // 🧑‍🎤 }
    // 🧑‍🎤 onMouseUp = (ev: React.MouseEvent<unknown>): void => {
    // 🧑‍🎤     return this.getRevealState().onMouseUpAnchor(ev)
    // 🧑‍🎤 }
    onAuxClick = (ev: React.MouseEvent<unknown>): void => {
        if (ev.button === 1) return this.getRevealState().onMiddleClickAnchor(ev)
        if (ev.button === 2) return this.getRevealState().onRightClickAnchor(ev)
    }
    onMouseEnter = (ev: React.MouseEvent<unknown>): void => {
        return this.getRevealState().onMouseEnterAnchor(ev)
    }
    onMouseLeave = (ev: React.MouseEvent<unknown>): void => {
        return this.getRevealState().onMouseLeaveAnchor(ev)
    }
    onFocus = (ev: React.FocusEvent<unknown>): void => {
        return this.getRevealState().onFocusAnchor(ev)
    }
    onBlur = (ev: React.FocusEvent<unknown>): void => {
        return this.getRevealState().onBlurAnchor(ev)
    }
    onKeyDown = (ev: React.KeyboardEvent<Element>): void => {
        return this.getRevealState().onAnchorKeyDown(ev)
    }
}
