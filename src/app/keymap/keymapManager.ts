/*
// Needs to handle all input (mouse, keyboard, etc)
// Read/Write from file(s)

// On input event should roll through every keymap 

- (registered to the region?)
- (using poll()?)

- Add support for timers. It should just create a setTimeout when the keymap entry is registered that calls the operator.

 */

import { RefObject, useEffect } from 'react'
import { STATE } from '../../state/state'
import { Operator } from '../operators/OperatorManager'
import { PanelGallery_RegisterKeymaps } from '../../panels/Panel_Gallery/Panel_Gallery'

type Ctx = STATE

type KeymapEvent = {
    type: EventType
    /** Requires a string for keyboard inputs and a number for mouse inputs */
    value?: string | number
    ctrl: boolean
    alt: boolean
    shift: boolean
}

export type KeymapItem = {
    /** The event to match */
    event: KeymapEvent
    operator: string
    properties: Object // Maybe un-needed? No, this should be the overrides and the operator should hold defaults.
}

export class Keymap {
    id: string
    items: KeymapItem[]
    label?: string

    constructor(id: string, options?: KeymapManagerOptions) {
        this.id = id
        this.items = []

        if (options) {
            if (options.poll) {
                this.poll = options.poll
            }

            if (options.items) {
                this.items = options.items
            }
        }
    }

    public poll?: (ctx: Ctx, ev: Event) => boolean

    public register(keymapItem: KeymapItem) {
        this.items.push(keymapItem)
        console.warn('[🧬] keymapManager - Registered:', keymapItem)
    }
}

type KeymapManagerOptions = {
    poll?: (ctx: Ctx, ev: Event) => boolean
    items?: KeymapItem[]
}

export class KeymapManager {
    readonly keymaps: { [id: string]: Keymap } = {}
    constructor() {
        //
        this.keymaps = {}
    }

    public registerDefaults(st: STATE) {
        this.new('Global')

        PanelGallery_RegisterKeymaps(st)
    }

    new(id: string, options?: KeymapManagerOptions) {
        if (id in this.keymaps) {
            console.warn(`[🧬] Keymap with id "${id}" already exists. Keymap will not be created.`)
            return
        }

        this.keymaps[id] = new Keymap(id, options)
    }

    public findMatch(st: STATE, event: Event): Operator | undefined {
        // console.log('[🧬] - Finding match')
        const type = event instanceof KeyboardEvent ? 'keyboard' : 'mouse'

        for (let k of Object.keys(st.keymaps.keymaps)) {
            let keymap = st.keymaps.keymaps[k]

            if (!keymap) {
                console.warn('[🧬] - Some how there is a keymap without a keymap??')
                continue
            }
            if (keymap.poll && !keymap?.poll(st, event)) {
                continue
            }
            // console.log(`[🧬] - Keymap '${keymap.id}' was allowed`)
            for (let item of keymap.items) {
                // console.warn('[🧬] iterating!', item)
                if (item.event.type == event.type) {
                    // console.log('[🧬] Trying stuff!', item.event, event)
                    if (st.modifiers.alt !== item.event.alt) {
                        console.warn('[🧬] failed alt!', st.modifiers.alt, item.event.alt)
                        continue
                    }

                    if (st.modifiers.shift !== item.event.shift) {
                        console.warn('[🧬] failed shift!', st.modifiers.shift, item.event.shift)
                        continue
                    }

                    if (st.modifiers.ctrl !== item.event.ctrl) {
                        console.warn('[🧬] failed ctrl!', st.modifiers.ctrl, item.event.ctrl)
                        continue
                    }

                    if (type === 'keyboard') {
                        console.log('[🧬] keyboard!')
                        let e: KeyboardEvent = event as KeyboardEvent
                        console.log(e)
                        if (item.event.value == e.key.toLowerCase()) {
                            console.log('[🧬] - FOUND MATCH!!!')
                            return st.operators.operators[item.operator]
                        }
                    }
                    if (type === 'mouse') {
                        console.log('[🧬] mouse!')
                        let e: MouseEvent = event as MouseEvent
                        if (item.event.value == e.button) {
                            console.log('[🧬] - FOUND MATCH!!!')
                            return st.operators.operators[item.operator]
                        }
                    }

                    //TODO: Handle other event cases if we add them to keymap?
                }
            }
        }
    }

    public init = (st: STATE, appRef: RefObject<HTMLDivElement>) => {
        let kmm = this

        function onEvent(event: Event) {
            document.getElementById('input-blocker')?.classList.remove('input-blocker-active')
            if (st.operators.stack.length > 0) {
                st.operators.runModals(st, event)
            }

            if (!event.defaultPrevented) {
                let operator = kmm.findMatch(st, event)
                if (operator !== undefined) {
                    if (operator.invoke) {
                        operator?.invoke(operator, st, event)
                    }
                }
            }
        }
        useEffect(() => {
            for (let e of events) {
                window.addEventListener(e, onEvent)
            }
            return () => {
                for (let e of events) {
                    window.removeEventListener(e, onEvent)
                }
            }
        }, [appRef.current, st])
    }
}

const events = [
    'abort',
    'auxclick',
    'beforeinput',
    'beforeprint',
    'afterprint',
    'copy',
    'cut',
    'paste',
    'pointerlockchange',
    'pointerlockerror',
    'selectstart',
    'selectionchange',
    'wheel',
    'keydown',
    'keyup',
    'keypress',
    'click',
    'contextmenu',
    'dblclick',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'touchstart',
    'touchend',
    'touchmove',
    'touchcancel',
    'drag',
    'dragstart',
    'dragenter',
    'dragover',
    'dragleave',
    'dragend',
    'drop',
    'focus',
    'blur',
    'focusin',
    'focusout',
    'change',
    'input',
    'invalid',
    'submit',
    'reset',
    'search',
    'load',
    'unload',
    'resize',
    'scroll',
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting',
    'animationstart',
    'animationend',
    'animationiteration',
    'transitionstart',
    'transitionend',
    'transitioncancel',
] as const
type EventType = (typeof events)[number]
