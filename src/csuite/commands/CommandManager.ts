import type { Command, CommandContext } from './Command'
import type { KeyboardEvent } from 'react'

import { computed, makeObservable, observable } from 'mobx'

import { META_NAME, MOD_KEY } from '../accelerators/META_NAME'
import { Trigger } from '../trigger/Trigger'
import { isPromise } from '../utils/ManualPromise'

export type CushyShortcut = Tagged<string, 'CushyShortcut'> // 'ctrl+k ctrl+shift+i'

/** string wrapper for extra type safety and ensuring we're working with sanitized key names */
export type KeyName = Branded<string, { KeyAllowedInShortcut: true }> // ctrl, shift, win, space, ...

/** e.g. '⌃k' */
type InputToken = Branded<string, { InputToken: true }>

/** e.g. ['⌃k', '⌃⇧i'] */
type InputSequence = InputToken[]

export class CommandManager {
    /** index of all commands, by their ID */
    commands: Map<Command['id'], Command> = new Map()

    /** index of all commands, by their shortcut */
    commandByShortcut: Map<string, Command[]> = new Map()

    /** index of all commands, by their context */
    commandByContext: Map<CommandContext, Command[]> = new Map()

    /** index of all known contexts */
    contextByName: Map<string, CommandContext> = new Map()

    inputHistory: InputSequence = []
    name: string

    /** return the list of all known context seen through registered commands */
    get knownContexts(): CommandContext[] {
        return Array.from(this.contextByName.values())
    }

    registerCommand = (op: Command): void => {
        this.contextByName.set(op.ctx.name, op.ctx)
        this.commands.set(op.id, op)
        const combos: CushyShortcut[] = op.combos == null ? [] : Array.isArray(op.combos) ? op.combos : [op.combos]

        // index command in context
        op.ctx.commands.add(op)

        // store
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

    /** retrieve a command by its id */
    getCommandById(id: string): Command<any> | undefined {
        return this.commands.get(id)
    }

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
    }
    log = (...content: any[]): void => console.log(`[Shortcut-Watcher #${this.name}`, ...content)

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
        // console.log(`[🤠] input > ev.key`, ev.key)
        const keyLower = ev.key.toLowerCase()
        const inputAccum: string[] = []
        if (ev.ctrlKey && keyLower !== 'ctrl') inputAccum.push('ctrl' /* as KeyName */)
        if (ev.shiftKey && keyLower !== 'shift') inputAccum.push('shift' /* as KeyName */)
        if (ev.altKey && keyLower !== 'alt') inputAccum.push('alt' /* as KeyName */)
        if (ev.metaKey && keyLower !== 'meta') inputAccum.push(META_NAME)

        // const key = ev.key
        const key = ev.key != 'Unidentified' ? ev.key : ev.code

        if (key) {
            if (key === ' ') inputAccum.push('space' /* as KeyName */)
            else inputAccum.push(key /* .toLowerCase() as KeyName */)
        }
        const input = inputAccum //
            .map(normalizeKey)
            .sort(sortKeyNamesFn)
            .join('') as InputToken
        // .toLowerCase()
        // console.log(`[🤠] input`, inputAccum, input)
        return input as InputToken
    }

    processKeyDownEvent = (ev: KeyboardEvent<HTMLElement>): Trigger => {
        // 2022-xx-xx: why did I write this ?? => because I get "shift+shift" stuff
        // | I could also check just above if (év.ctrlKey && !ev.key==='...')
        // | but I would also need to handle the ctrl<->control case
        // 💬 2024-04-09: blender-like shortcuts means those should be treated normally
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
        .join('') as InputToken
    // .toLowerCase() as InputToken
}

function normalizeKey(key_: string): KeyName {
    const key = key_.toLowerCase()
    // https://www.fileformat.info/info/unicode/char/search.htm?q=shift
    if (key === 'shift') return '⇧' as KeyName
    if (key === 'alt') return '⌥' as KeyName
    if (key === 'ctrl') return '⌃' as KeyName
    if (key === 'cmd') return '⌘' as KeyName
    // https://www.w3schools.com/charsets/ref_utf_arrows.asp
    if (key === 'up' || key === 'arrowup') return '↑' as KeyName
    if (key === 'down' || key === 'arrowdown') return '↓' as KeyName
    if (key === 'left' || key === 'arrowleft') return '←' as KeyName
    if (key === 'right' || key === 'arrowright') return '→' as KeyName
    if (key === 'mod') return _replace(MOD_KEY)
    if (key === 'meta') return _replace(META_NAME)
    return key as KeyName
}

const sortKeyNamesFn = (a: KeyName, b: KeyName): number => {
    const a1 = _keyPriorityWhenSorting(a)
    const b1 = _keyPriorityWhenSorting(b)
    return a1.localeCompare(b1)
}
const _keyPriorityWhenSorting = (key: KeyName): string => {
    if (key === '⌃') return '__1ctrl'
    if (key === 'win') return '__1win'
    if (key === '⌘') return '__1cmd'
    if (key === '⇧') return '__2shift'
    if (key === '⌥') return '__3alt'
    return key
}

// const globallyAvailableAs = (name: string) => {}

export const commandManager = new CommandManager({})

function _replace(str: 'cmd' | 'ctrl' | 'shift' | 'alt' | 'win'): KeyName {
    if (str === 'cmd') return '⌘' as KeyName // command ⌘
    if (str === 'shift') return '⇧' as KeyName // shift ⇧
    if (str === 'alt') return '⌥' as KeyName // option ⌥
    if (str === 'ctrl') return '⌃' as KeyName // control ⌃
    if (str === 'win') return 'win' as KeyName // windows key
    return str
}
