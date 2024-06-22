import type { Activity } from '../activity/Activity'
import type { BoundCommand } from '../commands/Command'
import type { IconName } from '../icons/icons'
import type { BaseField } from '../model/BaseField'
import type { NO_PROPS } from '../types/NO_PROPS'
import type { SimpleMenuModal } from './SimpleMenuModal'

import { nanoid } from 'nanoid'
import { createElement, type FC, type UIEvent, useMemo } from 'react'

import { activityManager } from '../activity/ActivityManager'
import { Command } from '../commands/Command'
import { BoundMenuSym } from '../introspect/_isBoundMenu'
import { Trigger } from '../trigger/Trigger'
import { MenuRootUI, MenuUI } from './MenuUI'
import { SimpleMenuAction } from './SimpleMenuAction'

// ------------------------------------------------------------------------------------------
// COMMAND MANAGER Centralize every single command
class MenuManager {
    operators: Menu<any>[] = []
    registerMenu = (menu: Menu<any>) => this.operators.push(menu)
    getMenuById = (id: string) => this.operators.find((op) => op.def.id === id)
}
const menuManager = new MenuManager()

// ------------------------------------------------------------------------------------------
// ACTIVITY STACK
export type MenuEntryWithKey = {
    entry: MenuEntry
    /** local key bound to that menu entry */
    char?: string
    /**
     * char index within the string;
     * (value kept around to speed up later processing to add underline at the right position)
     * */
    charIx?: number
}

// prettier-ignore
export type MenuEntry =
    /** inline subform  */
    | BaseField
    /** custom component  */
    | FC<{}>
    /** a command */
    | Command /* command may be passed unbound: in that case, they retrieve their context from their provider */
    | BoundCommand
    | BoundMenu
    /** simple MenuEntry */
    | SimpleMenuAction
    | SimpleMenuModal

/** supplied menu definition */
export type MenuDef<Props> = {
    /**
     * used to register menu into menu manager so you can open menu by ref
     * required for hot performant / simple hot reload
     */
    id?: string
    title: string
    icon?: Maybe<IconName>
    entries: (props: Props) => MenuEntry[]
}

export type MenuID = Tagged<string, 'MenuID'>

export class Menu<Props> {
    id: MenuID
    get title() { return this.def.title } // prettier-ignore
    constructor(public def: MenuDef<Props>) {
        this.id = def.id ?? nanoid()
        menuManager.registerMenu(this)
    }
    UI = (p: { props: Props }): JSX.Element => createElement(MenuUI, { menu: useMemo(() => new MenuInstance(this, p.props), []) })
    DropDownUI = (p: { props: Props }): JSX.Element => createElement(MenuRootUI, { menu: useMemo(() => new MenuInstance(this, p.props), []) }) // prettier-ignore

    /** bind a menu to give props */
    bind = (props: Props, ui?: BoundMenuOpts): BoundMenu => new BoundMenu(this, props, ui)

    /** push the menu to current activity */
    open(props: Props): Trigger | Promise<Trigger> {
        const instance = new MenuInstance(this, props)
        activityManager.start(instance)
        return Trigger.Success
    }
}

export class MenuWithoutProps {
    id: MenuID
    get title() { return this.def.title } // prettier-ignore
    constructor(public def: MenuDef<NO_PROPS>) {
        this.id = def.id ?? nanoid()
        menuManager.registerMenu(this)
    }
    // 🔴
    UI = (): JSX.Element => createElement(MenuRootUI, { menu: useMemo(() => new MenuInstance(this, {}), []) })
    DropDownUI = (): JSX.Element => createElement(MenuRootUI, { menu: useMemo(() => new MenuInstance(this, {}), []) })

    /** bind a menu to give props */
    bind = (ui?: BoundMenuOpts): BoundMenu => new BoundMenu(this, {}, ui)

    /** push the menu to current activity */
    open(): Trigger | Promise<Trigger> {
        const instance = new MenuInstance(this, {})
        activityManager.start(instance)
        return Trigger.Success
    }
}

export class MenuInstance<Props> implements Activity {
    onStart = (): void => {}

    UI = () => createElement(MenuUI, { menu: this })
    onEvent = (event: UIEvent): Trigger | null => {
        // event.stopImmediatePropagation()
        event.stopPropagation()
        event.preventDefault()
        return null
    }
    onStop = (): void => {}
    uid = nanoid()
    constructor(
        //
        public menu: Menu<Props>,
        public props: Props,
        public keysTaken: Set<string> = new Set(),
    ) {}

    get entries(): MenuEntry[] {
        return this.menu.def.entries(this.props)
    }

    get entriesWithKb(): MenuEntryWithKey[] {
        return this.acceleratedEntries.out
    }

    get allocatedKeys(): Set<string> {
        return this.acceleratedEntries.allocatedKeys
    }

    private get acceleratedEntries() {
        const allocatedKeys = new Set<string>([...this.keysTaken])
        const out: MenuEntryWithKey[] = []
        for (const entry of this.entries) {
            if (entry instanceof SimpleMenuAction) {
                const res = this.findSuitableKeys(entry.opts.label, allocatedKeys)
                // 2024-06-22 rvion: we don't want to skip entries,
                // | we want to show them with no key if we can't find letter
                // | for them
                // | ⏸️ if (res == null) continue
                out.push({ entry, char: res?.char, charIx: res?.pos })
            } else if (entry instanceof Command) {
                const res = this.findSuitableKeys(entry.label, allocatedKeys)
                // ⏸️ if (res == null) continue
                out.push({ entry, char: res?.char, charIx: res?.pos })
            } else if (entry instanceof BoundMenu) {
                const res = this.findSuitableKeys(entry.menu.title, allocatedKeys)
                // ⏸️ if (res == null) continue
                out.push({ entry, char: res?.char, charIx: res?.pos })
            } else {
                out.push({ entry })
            }
        }
        return { out, allocatedKeys }
    }

    findSuitableKeys = (
        //
        label: string,
        allocatedKeys: Set<string>,
    ): Maybe<{ char: string; pos: number }> => {
        let ix = 0
        for (const char of [...label]) {
            const key = char.toLowerCase()
            if (!allocatedKeys.has(key)) {
                allocatedKeys.add(key)
                return { char: key, pos: ix }
            }
            ix++
        }
    }
}
export const menuWithProps = <P>(def: MenuDef<P>): Menu<P> => new Menu(def)
export const menuWithoutProps = (def: MenuDef<NO_PROPS>): MenuWithoutProps => new MenuWithoutProps(def)

// ------------------------------------------------------------------------------------------
// A bound menu; ready to be opened without further params
// great abstraction to handle nested sub-menus and more
export type BoundMenuOpts = { title?: string }
export class BoundMenu<Ctx = any, Props = any> {
    $SYM = BoundMenuSym
    get title(): string {
        return this.ui?.title ?? this.menu.title
    }
    get icon(): Maybe<IconName> {
        return this.menu.def.icon
    }
    constructor(
        //
        public menu: Menu<Props>,
        public props: Props,
        public ui?: BoundMenuOpts,
    ) {}
    open = () => this.menu.open(this.props)
    init = (keysTaken?: Set<string>) => new MenuInstance(this.menu, this.props, keysTaken)
}
