/** @todo improve to detect shortkey without order */

import type { Command, CommandContext } from './Command'
import type { KeyboardEvent } from 'react'

import { computed, makeObservable, observable } from 'mobx'

import { META_NAME, MOD_KEY } from '../accelerators/META_NAME'
import { Trigger } from '../trigger/Trigger'
import { isPromise } from '../utils/ManualPromise'

export type CushyShortcut = Tagged<string, 'CushyShortcut'> // 'ctrl+k ctrl+shift+i'

// string wrapper for extra type safety and ensuring we're working with sanitized key names
export type KeyName = Branded<string, { KeyAllowedInShortcut: true }> // ctrl, shift, win, space, ...

// 'ctrl+k'
type InputToken = Branded<string, { InputToken: true }>

// ['ctrl+k', 'ctrl+shift+i']
type InputSequence = InputToken[]

// easy to store in a Map
type KnownCombo = [InputSequence, Command]

export class CommandManager {
    commands: Map<Command['id'], Command> = new Map()
    commandByShortcut: Map<string, Command[]> = new Map()
    contextByName: Map<string, CommandContext> = new Map()
    get knownContexts(): CommandContext[] {
        return Array.from(this.contextByName.values())
    }

    registerCommand = (op: Command) => {
        this.contextByName.set(op.ctx.name, op.ctx)
        this.commands.set(op.id, op)
        const combos: CushyShortcut[] = op.combos == null ? [] : Array.isArray(op.combos) ? op.combos : [op.combos]
        for (const k of combos) {
            const key = normalizeCushyShortcut(k)
            // retrieve prev list
            const list = this.commandByShortcut.get(key) || []
            // remove previous occurence of command with same id if present
            const next = list.filter((o) => o.id !== op.id)
            // insert new version
            next.push(op)
            // store back the updataed list list
            this.commandByShortcut.set(key, next)
        }
    }

    getCommandById = (id: string) => this.commands.get(id)

    inputHistory: InputSequence = []
    // alwaysMatch: Command[] = []
    // watchList: KnownCombo[] = []
    // shortcuts: Command[]

    name: string
    constructor(
        public conf: {
            log?: boolean
            name?: string
        } = {},
    ) {
        makeObservable(this, {
            inputHistory: true,
            contextByName: observable.shallow,
            commandByShortcut: observable.shallow,
            knownContexts: computed,
        })

        this.name = this.conf.name || 'no-name' //shortId()
        // this.shortcuts = shortcuts
        // // 1. unfold shortcuts that have serveral combos and normalize them
        // for (const shortcut of shortcuts) {
        //     for (const combo of shortcut.combos) {
        //         const inputSequence = parseShortcutToInputSequence(combo)
        //         this.watchList.push([inputSequence, shortcut])
        //     }
        // }
        // // 2. sort from longest combo to shortest
        // // so `ctrl+k ctrl-u` must be check before versus `ctrl-u`
        // this.watchList = this.watchList.sort(([ix1], [ix2]) => {
        //     const l1 = ix1.length
        //     const l2 = ix2.length
        //     return l2 - l1
        // })
        // // console.log(this.knownCombos)
        // if (this.conf.log) this.log(`${this.watchList.length} loaded`)
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
        // 2022-xx-xx: why did I write this ?? => because I get "shift+shift" stuff
        // | I could also check just above if (év.ctrlKey && !ev.key==='...')
        // | but I would also need to handle the ctrl<->control case
        // 2024-04-09: blender-like shortcuts means those should be treated normally
        // | todo: uncomment
        // if (['Control', 'Shift', 'Alt', 'Meta'].includes(ev.key)) {
        //     return Trigger.UNMATCHED
        // }

        const input = this.inputToken(ev)
        if (this.conf.log) this.log(input)
        if (this.inputHistory.length > 3) this.inputHistory.shift()
        this.inputHistory.push(input)
        const inInput: boolean = this.evInInput(ev)

        const lastX = this.inputHistory.slice(-5)

        for (let x = 0; x < lastX.length; x++) {
            const shortcut: CushyShortcut = lastX.slice(x).join(' ')
            const matches = this.commandByShortcut.get(shortcut)

            for (const s of matches || []) {
                // 3.1 skip if shortcut is not compatible with input
                if (inInput && !s.validInInput) continue

                if (this.conf.log || s.action == null) this.log(shortcut, `triggered (${s.label})`)

                const done = this.tryToRun(s, ev)
                if (done) return Trigger.Success
            }
        }

        if (this.conf.log) this.log('nothing found')
        return Trigger.UNMATCHED
    }

    tryToRun = (
        //
        s: Command,
        ev: KeyboardEvent<HTMLElement>,
    ): boolean => {
        // if (s.action == null) return // asume terminal
        if (s.action == null) return false // asume continuation
        const res = s.execute()

        // we can't wait to see if promise succedded; let's assum they did
        if (isPromise(res)) {
            return true
        }

        if (this.conf.log) {
            if (res === Trigger.Success) this.log('          -> executed')
            // if (res === RET.Failed) this.log('          -> FAILED')
        }

        // continue
        if (res === Trigger.UNMATCHED) return false
        if (res === Trigger.FAILED) return false
        // if (res === RET.Failed) continue

        // console.log(s)
        if (res === Trigger.Success && s.continueAfterSuccess) return false

        // stop
        if (res === Trigger.Success) {
            ev.stopPropagation()
            ev.preventDefault()
            // if (this.conf.log) this.log('          -> done')
            return true
            // return RET.SUCCESS
        }
        exhaust(res)
        throw new Error(`INVALID CASE`)
    }
}

const exhaust = (_: never): any => _

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

// const globallyAvailableAs = (name: string) => {}

export const commandManager = new CommandManager({})
