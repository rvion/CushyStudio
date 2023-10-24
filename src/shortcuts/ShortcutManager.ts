import type { KeyboardEvent } from 'react'
import type { STATE } from 'src/front/state'
import { Trigger } from './Trigger'

type Ctx = STATE

/** @todo improve to detect shortkey without order */
export type Combo = string // 'ctrl+k ctrl+shift+i'
type InputToken = string // 'ctrl+k'
type InputSequence = InputToken[] // ['ctrl+k', 'ctrl+shift+i']
type KnownCombo<Ctx> = [InputSequence, Shortcut<Ctx>]

export type Shortcut<Ctx> = {
    info?: string
    combos: Combo[] | true
    action?: (ctx: Ctx, ev: KeyboardEvent) => Trigger
    on?: 'keypress' | 'keydown' | 'keyup'
    validInInput?: boolean
    continueAfterSuccess?: boolean
}

export class ShortcutWatcher {
    inputHistory: InputSequence = []
    alwaysMatch: Shortcut<Ctx>[] = []
    watchList: KnownCombo<Ctx>[] = []
    shortcuts: Shortcut<Ctx>[]

    name: string
    constructor(
        //
        shortcuts: Shortcut<Ctx>[],
        public ctx: Ctx,
        public conf: { log?: boolean; name?: string } = {},
    ) {
        this.name = this.conf.name || 'no-name' //shortId()
        this.shortcuts = shortcuts
        // 1. unfold shortcuts that have serveral combos and normalize them
        for (const shortcut of shortcuts) {
            if (shortcut.combos === true) {
                // combo always match
                this.alwaysMatch.push(shortcut)
                continue
            }
            for (const combo of shortcut.combos) {
                const inputSequence = parseInputSequence(combo)
                this.watchList.push([inputSequence, shortcut])
            }
        }
        // 2. sort from longest combo to shortest
        // so `ctrl+k ctrl-u` must be check before versus `ctrl-u`
        this.watchList = this.watchList.sort(([ix1], [ix2]) => {
            const l1 = ix1.length
            const l2 = ix2.length
            return l2 - l1
        })
        // console.log(this.knownCombos)
        if (this.conf.log) this.log(`${this.watchList.length} loaded`)
    }
    log = (...content: any[]) => console.log(`[Shortcut-Watcher #${this.name}`, ...content)

    private evInInput = (ev: KeyboardEvent<HTMLElement>): boolean => {
        const element: HTMLElement = ev.target as HTMLElement
        const inInput: boolean =
            element.tagName === 'INPUT' ||
            element.tagName === 'SELECT' ||
            element.tagName === 'TEXTAREA' ||
            (Boolean(element.contentEditable) && element.contentEditable === 'true')
        return inInput
    }

    private inputToken = (ev: KeyboardEvent<HTMLElement>): string => {
        const inputAccum: string[] = []
        if (ev.ctrlKey) inputAccum.push('ctrl')
        if (ev.shiftKey) inputAccum.push('shift')
        if (ev.altKey) inputAccum.push('alt')
        if (ev.metaKey) inputAccum.push('meta')

        const key = ev.key

        // if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
        //     return Trigger.UNMATCHED_CONDITIONS
        // }
        //
        if (key) {
            if (key === ' ') {
                inputAccum.push('space')
            } else {
                inputAccum.push(key.toLowerCase())
            }
        }
        const input = inputAccum //
            .sort()
            .join('+')
            .toLowerCase()
        return input
    }
    processKeyDownEvent = (ev: KeyboardEvent<HTMLElement>): Trigger => {
        // doc: why did I write this ?? => because I get "shift+shift" stuff
        // I could also check just above if (év.ctrlKey && !ev.key==='...')
        // but I would also need to handle the ctrl<->control case
        if (['Control', 'Shift', 'Alt', 'Meta'].includes(ev.key)) {
            return Trigger.UNMATCHED_CONDITIONS
        }
        const input = this.inputToken(ev)
        if (this.conf.log) this.log(input)
        if (this.inputHistory.length > 3) this.inputHistory.shift()
        this.inputHistory.push(input)
        const inInput: boolean = this.evInInput(ev)

        // 3. look for matching combo
        for (const [comboInputSequence, s] of this.watchList) {
            // 3.1 skip if shortcut is not compatible with input
            if (inInput && !s.validInInput) continue

            // 3.2 check that all pieces match from last to first
            let match = true
            for (const [ix, comboInput] of comboInputSequence.entries()) {
                const offset = this.inputHistory.length - comboInputSequence.length
                const input = this.inputHistory[offset + ix]
                if (input !== comboInput) {
                    match = false
                    break
                }
            }
            // 3.3 stop when first combo found (if found)
            if (!match) continue

            if (this.conf.log || s.action == null) this.log(comboInputSequence, `triggered (${s.info})`)

            const done = this.tryToRun(s, ev)
            if (done) return Trigger.Success
        }

        // run "always" shortcuts
        for (const s of this.alwaysMatch) {
            const done = this.tryToRun(s, ev)
            if (done) return Trigger.Success
        }

        if (this.conf.log) this.log('nothing found')
        return Trigger.UNMATCHED_CONDITIONS
    }

    tryToRun = (
        //
        s: Shortcut<Ctx>,
        ev: KeyboardEvent<HTMLElement>,
    ): boolean => {
        // if (s.action == null) return // asume terminal
        if (s.action == null) return false // asume continuation
        const res = s.action(this.ctx, ev)

        if (this.conf.log) {
            if (res === Trigger.Success) this.log('          -> executed')
            // if (res === Trigger.Failed) this.log('          -> FAILED')
        }

        // continue
        if (res === Trigger.UNMATCHED_CONDITIONS) return false
        // if (res === Trigger.Failed) continue

        // console.log(s)
        if (res === Trigger.Success && s.continueAfterSuccess) return false

        // stop
        if (res === Trigger.Success) {
            ev.stopPropagation()
            ev.preventDefault()
            // if (this.conf.log) this.log('          -> done')
            return true
            // return Trigger.Success
        }

        ENSURE_VOID(res)
        throw new Error(`INVALID CASE`)
    }
}

const ENSURE_VOID = (_: never): any => _

export function parseInputSequence(combo: Combo): InputSequence {
    return combo.split(' ').map(normalizeInput)
}

// ctrl+shift+a  => a+ctrl+shift
function normalizeInput(input: InputToken): InputToken {
    return input //
        .split('+')
        .map(normalizeKey)
        .sort()
        .join('+')
        .toLowerCase()
}

function normalizeKey(key: string): string {
    if (key === 'up') return 'ArrowUp'
    if (key === 'down') return 'ArrowDown'
    if (key === 'left') return 'ArrowLeft'
    if (key === 'right') return 'ArrowRight'
    return key
}

// 2. handle esc special case
// if (input === 'Escape' && ev.target instanceof HTMLElement) {
//     // if (inInput) return element.blur()
//     if (inInput) {
//         console.log(element, element.parentElement)
//         if (element.parentElement) {
//             console.log('focusing parent element')
//             return element.parentElement.focus()
//         } else {
//             return element.blur()
//         }
//     }
// }
// console.log('combos', this.combos)
