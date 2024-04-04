import type { IWidget } from '../controls/IWidget'

import { nanoid } from 'nanoid'
import { createElement, type FC, type ReactNode, useMemo } from 'react'

import { RevealUI } from '../rsuite/reveal/RevealUI'
import { Activity, activityManger } from './Activity'
import { BoundCommand } from './Command'
import { MenuUI } from './MenuUI'
import { RET } from './RET'

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
export type MenuEntryWithKey = { entry: MenuEntry; char?: string; charIx?: number }
export type MenuEntry = IWidget | FC<{}> | BoundCommand | BoundMenu

/** supplied menu definition */
export type MenuDef<Props> = {
    /**
     * used to register menu into menu manager so you can open menu by ref
     * required for hot performant / simple hot reload
     */
    id?: string
    title: string
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
    UI = (p: { props: Props }) => {
        const instance = useMemo(() => new MenuInstance(this, p.props), [])
        return createElement(MenuUI, { menu: instance })
    }
    /** bind a menu to give props */
    bind = (props: Props, ui?: BoundMenuOpts): BoundMenu => new BoundMenu(this, props, ui)

    /** push the menu to current activity */
    open(props: Props): RET | Promise<RET> {
        const instance = new MenuInstance(this, props)
        return activityManger.push(instance)
    }
}

export class MenuInstance<Props> implements Activity {
    onStart = (): void => {}

    UI = () => createElement(MenuUI, { menu: this })
    onEvent = (event: Event): RET | null => {
        event.stopImmediatePropagation()
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
    ) {}

    get entries(): MenuEntry[] {
        return this.menu.def.entries(this.props)
    }

    get entriesWithKb(): MenuEntryWithKey[] {
        const allocatedKeys = new Set<string>()
        const out: MenuEntryWithKey[] = []
        for (const entry of this.entries) {
            if (entry instanceof BoundCommand) {
                const res = this.findSuitableKeys(entry.command.label, allocatedKeys)
                if (res == null) continue
                out.push({ entry, char: res.char, charIx: res.pos })
            } else if (entry instanceof BoundMenu) {
                const res = this.findSuitableKeys(entry.menu.title, allocatedKeys)
                if (res == null) continue
                out.push({ entry, char: res.char, charIx: res.pos })
            } else {
                out.push({ entry })
            }
        }
        return out
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
export const menu = <P>(def: MenuDef<P>): Menu<P> => new Menu(def)

// ------------------------------------------------------------------------------------------
// A bound menu; ready to be opened without further params
// great abstraction to handle nested sub-menus and more
export type BoundMenuOpts = { title?: string }
export class BoundMenu<Ctx = any, Props = any> {
    get title() {
        return this.ui?.title ?? this.menu.title
    }
    constructor(
        //
        public menu: Menu<Props>,
        public props: Props,
        public ui?: BoundMenuOpts,
    ) {}
    open = () => this.menu.open(this.props)
    init = () => new MenuInstance(this.menu, this.props)
}
