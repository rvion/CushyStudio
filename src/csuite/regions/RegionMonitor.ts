import { makeAutoObservable } from 'mobx'
import { useEffect } from 'react'

import { hasMod } from '../accelerators/META_NAME'

export type HoveredRegion = {
    id: string
    type: string
    props: object
}

type HoveredCtx = {
    ctx: React.Context<any>
    value: any
}

export class RegionMonitor {
    constructor() {
        makeAutoObservable(this, { knownRegions: false })
    }

    knownRegions: Map<string, HoveredCtx> = new Map()
    hoveredRegion: Maybe<HoveredRegion> = null
    hoveredPanel: Maybe<string> = null

    mouseX = 0
    mouseY = 0

    get hoveredCtx(): Maybe<HoveredCtx> {
        const id = this.hoveredRegion?.id
        if (id == null) return null
        const fo = this.knownRegions.get(id)
        if (fo == null) return null
        return fo
    }

    isOver<T>(ctx: React.Context<T>): Maybe<T> {
        const hoveredCtx = this.hoveredCtx
        if (hoveredCtx == null) return null
        if (hoveredCtx.ctx === ctx) return hoveredCtx.value
        return null
    }

    ctrl = false
    alt = false
    shift = false
    cmd = false
    mod = false

    get debugMods() {
        let out: string[] = []
        if (this.cmd) out.push('cmd')
        if (this.ctrl) out.push('ctrl')
        if (this.alt) out.push('alt')
        if (this.shift) out.push('shift')
        if (this.mod) out.push('mod')
        return out.join('+')
    }
}

/** singleton instance */
export const regionMonitor = new RegionMonitor()

// FORMAT: `Region-${type}-${id}`
/** watch every single event, and update the state */
export const useRegionMonitor = () => {
    useEffect(() => {
        function handleMouseEvent(event: MouseEvent) {
            const target = event.target
            if (!(target instanceof HTMLElement)) {
                // console.log(`[❌] mouse event target is not HTMLElement`)
                return
            }

            regionMonitor.mouseX = event.clientX
            regionMonitor.mouseY = event.clientY

            // 1. find region ============================================================
            // walk upwards from the target until we find a region
            // TODO @rvion: slightly rewrite later
            let at: HTMLElement | null = target
            let hoveredRegion = undefined
            while (
                //
                hoveredRegion == null &&
                at &&
                !Array.from(at.classList).some((className) => className.includes('Region-'))
            ) {
                at = at.parentElement
                if (at) {
                    let test = Array.from(at.classList).find((className) => className.includes('Region-'))
                    if (test) hoveredRegion = test.split('-')
                }
            }
            // update state.hoveredRegion
            regionMonitor.hoveredRegion = hoveredRegion //
                ? { id: hoveredRegion[2]!, type: hoveredRegion[1]!, props: {} }
                : null

            // 2. find hovered panel ============================================================
            let currentPanel: string | null = null
            at = target
            while (at != null) {
                const pid = at.getAttribute('data-panel-id')
                if (pid != null) {
                    currentPanel = pid
                    break
                }
                at = at.parentElement
            }
            regionMonitor.hoveredPanel = currentPanel
        }

        /* Update our modifiers to make keymap stuff easier, also can use anywhere now instead of just events. */
        function handleKeyEvent(event: KeyboardEvent) {
            regionMonitor.cmd = event.metaKey
            regionMonitor.ctrl = event.ctrlKey
            regionMonitor.shift = event.shiftKey
            regionMonitor.alt = event.altKey
            regionMonitor.mod = hasMod(event)
        }

        window.addEventListener('mousedown', handleMouseEvent)
        window.addEventListener('mouseenter', handleMouseEvent)
        window.addEventListener('mouseleave', handleMouseEvent)
        window.addEventListener('mousemove', handleMouseEvent)
        window.addEventListener('mouseout', handleMouseEvent)
        window.addEventListener('mouseover', handleMouseEvent)
        window.addEventListener('mouseup', handleMouseEvent)

        window.addEventListener('keydown', handleKeyEvent)
        window.addEventListener('keyup', handleKeyEvent)
        window.addEventListener('keypress', handleKeyEvent)
        return () => {
            window.removeEventListener('mousedown', handleMouseEvent)
            window.removeEventListener('mouseenter', handleMouseEvent)
            window.removeEventListener('mouseleave', handleMouseEvent)
            window.removeEventListener('mousemove', handleMouseEvent)
            window.removeEventListener('mouseout', handleMouseEvent)
            window.removeEventListener('mouseover', handleMouseEvent)
            window.removeEventListener('mouseup', handleMouseEvent)

            window.removeEventListener('keydown', handleKeyEvent)
            window.removeEventListener('keyup', handleKeyEvent)
            window.removeEventListener('keypress', handleKeyEvent)
        }
    }, [])
}
