import type { KeyboardEvent } from 'react'
import type { STATE } from 'src/state/state'

import { META_NAME, MOD_KEY } from './META_NAME'
import { Trigger } from './Trigger'

type Ctx = STATE

/** @todo improve to detect shortkey without order */
export type CushyShortcut = Tagged<string, 'CushyShortcut'> // 'ctrl+k ctrl+shift+i'
export type KeyName = Branded<string, { KeyAllowedInShortcut: true }> // ctrl, shift, win, space, ...
type InputToken = Branded<string, { InputToken: true }> // 'ctrl+k'
type InputSequence = InputToken[] // ['ctrl+k', 'ctrl+shift+i']
type KnownCombo<Ctx> = [InputSequence, Command<Ctx>]

export type Command<Ctx> = {
    combos: CushyShortcut[] // | true
    info: string
    /** upward context required; nearest takes precedence */
    when?: string
    action?: (ctx: Ctx, ev: KeyboardEvent) => Trigger
    // on?: 'keypress' | 'keydown' | 'keyup'
    validInInput?: boolean
    continueAfterSuccess?: boolean
}

export class ShortcutWatcher {
    inputHistory: InputSequence = []
    alwaysMatch: Command<Ctx>[] = []
    watchList: KnownCombo<Ctx>[] = []
    shortcuts: Command<Ctx>[]

    name: string
    constructor(
        //
        shortcuts: Command<Ctx>[],
        public ctx: Ctx,
        public conf: {
            log?: boolean
            name?: string
        },
    ) {
        this.name = this.conf.name || 'no-name' //shortId()
        this.shortcuts = shortcuts
        // 1. unfold shortcuts that have serveral combos and normalize them
        for (const shortcut of shortcuts) {
            // ⏸️ if (shortcut.combos === true) {
            // ⏸️     // combo always match
            // ⏸️     this.alwaysMatch.push(shortcut)
            // ⏸️     continue
            // ⏸️ }
            for (const combo of shortcut.combos) {
                const inputSequence = parseShortcutToInputSequence(combo)
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

    private inputToken = (ev: KeyboardEvent<HTMLElement>): InputToken => {
        const inputAccum: KeyName[] = []
        if (ev.ctrlKey) inputAccum.push('ctrl' as KeyName)
        if (ev.shiftKey) inputAccum.push('shift' as KeyName)
        if (ev.altKey) inputAccum.push('alt' as KeyName)
        if (ev.metaKey) inputAccum.push(META_NAME)

        const key = ev.key

        if (key) {
            if (key === ' ') inputAccum.push('space' as KeyName)
            else inputAccum.push(key.toLowerCase() as KeyName)
        }
        const input = inputAccum //
            .sort(sortKeyNamesFn)
            .join('+')
            .toLowerCase()
        return input as InputToken
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
        s: Command<Ctx>,
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

export function parseShortcutToInputSequence(combo: CushyShortcut): InputSequence {
    return combo.split(' ').map(normalizeInputToken)
}

export const normalizeCushyShortcut = (combo: CushyShortcut): CushyShortcut => {
    return combo.split(' ').map(normalizeInputToken).join(' ')
}
// ctrl+shift+a => a+ctrl+shift
function normalizeInputToken(input: string): InputToken {
    if (input.includes(' ')) throw new Error(`invalid raw input token: "${input}"`)
    return input //
        .split('+')
        .map(normalizeKey)
        .sort(sortKeyNamesFn)
        .join('+')
        .toLowerCase() as InputToken
}

function normalizeKey(key: string): KeyName {
    if (key === 'up') return 'ArrowUp' as KeyName
    if (key === 'down') return 'ArrowDown' as KeyName
    if (key === 'left') return 'ArrowLeft' as KeyName
    if (key === 'right') return 'ArrowRight' as KeyName
    if (key === 'mod') return MOD_KEY
    if (key === 'meta') return META_NAME
    return key as KeyName
}

const keyPriorityWhenSorting = (key: KeyName) => {
    if (key === 'ctrl') return '__1ctrl'
    if (key === 'win') return '__1win'
    if (key === 'cmd') return '__1cmd'
    if (key === 'shift') return '__2shift'
    if (key === 'alt') return '__3alt'
    return key
}

const sortKeyNamesFn = (a: KeyName, b: KeyName): number => {
    const a1 = keyPriorityWhenSorting(a)
    const b1 = keyPriorityWhenSorting(b)
    return a1.localeCompare(b1)
}
