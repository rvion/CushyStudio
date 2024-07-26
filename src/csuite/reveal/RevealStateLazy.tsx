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
    ) {
        makeAutoObservable(this, { p: false })
    }

    state: RevealState | null = null

    getRevealState = (): RevealState => {
        if (this.state) return this.state
        if (DEBUG_REVEAL) console.log(`[💙] init RevealUI`)
        this.state = new RevealState({ ...this.p }, this.parents)
        return this.state!
    }
    onContextMenu = (ev: React.MouseEvent<unknown>): void => {
        // lock input on shift+right click
        if (ev.shiftKey) {
            this.getRevealState().toggleLock()
            ev.preventDefault() //  = prevent window on non-electron apps
            ev.stopPropagation()
        }
    }
    onClick = (ev: React.MouseEvent<unknown>): void => this.getRevealState().onLeftClickAnchor(ev)
    onMouseDown = (ev: React.MouseEvent<unknown>): void => this.getRevealState().onMouseDownAnchor(ev)
    onMouseUp = (ev: React.MouseEvent<unknown>): void => this.getRevealState().onMouseUpAnchor(ev)
    onAuxClick = (ev: React.MouseEvent<unknown>): void => {
        if (ev.button === 1) return this.getRevealState().onMiddleClickAnchor(ev)
        if (ev.button === 2) return this.getRevealState().onRightClickAnchor(ev)
    }
    onMouseEnter = (ev: React.MouseEvent<unknown>): void => this.getRevealState().onMouseEnterAnchor(ev)
    onMouseLeave = (ev: React.MouseEvent<unknown>): void => this.getRevealState().onMouseLeaveAnchor(ev)
    onFocus = (ev: React.FocusEvent<unknown>): void => this.getRevealState().onFocusAnchor(ev)
    onBlur = (ev: React.FocusEvent<unknown>): void => this.getRevealState().onBlurAnchor(ev)
}
