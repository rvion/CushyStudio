import type { IconName } from '../icons/icons'
import type { RevealStateLazy } from '../reveal/RevealStateLazy'
import type { NO_PROPS } from '../types/NO_PROPS'
import type { MenuBuilder } from './MenuBuilder'
import type { MenuEntry } from './MenuEntry'

import { nanoid } from 'nanoid'
import { createElement, useMemo } from 'react'

import { activityManager } from '../activity/ActivityManager'
import { Trigger } from '../trigger/Trigger'
import { BoundMenu, BoundMenuOpts } from './BoundMenuOpts'
import { MenuBarUI } from './MenuBarUI'
import { MenuInstance } from './MenuInstance'
import { menuManager } from './menuManager'
import { MenuRootUI } from './MenuRootUI'
import { MenuUI } from './MenuUI'

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
    ref?: React.RefObject<RevealStateLazy>
}

/** supplied menu definition */
export type MenuDef<Props> = {
    title: string
    /**
     * used to register menu into menu manager so you can open menu by ref
     * required for hot performant / simple hot reload
     */
    id?: string
    icon?: Maybe<IconName>
    entries: (props: Props, builder: MenuBuilder<any>) => MenuEntry[]
}

export type MenuID = Tagged<string, 'MenuID'>

export class Menu<Props> {
    id: MenuID
    constructor(public def: MenuDef<Props>) {
        this.id = def.id ?? nanoid()
        menuManager.registerMenu(this)
    }

    get title(): string {
        return this.def.title
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

    get title(): string {
        return this.def.title
    }

    constructor(public def: MenuDef<NO_PROPS>) {
        this.id = def.id ?? nanoid()
        menuManager.registerMenu(this)
    }
    // 🔴
    UI = (): JSX.Element => createElement(MenuRootUI, { menu: useMemo(() => new MenuInstance(this, {}), []) })
    DropDownUI = (): JSX.Element => createElement(MenuRootUI, { menu: useMemo(() => new MenuInstance(this, {}), []) })
    MenuBarUI = (): JSX.Element => createElement(MenuBarUI, { menu: useMemo(() => new MenuInstance(this, {}), []) })

    /** bind a menu to give props */
    bind = (ui?: BoundMenuOpts): BoundMenu => new BoundMenu(this, {}, ui)

    /** push the menu to current activity */
    open(): Trigger | Promise<Trigger> {
        const instance = new MenuInstance(this, {})
        activityManager.start(instance)
        return Trigger.Success
    }
}

export const menuWithProps = <P>(def: MenuDef<P>): Menu<P> => new Menu(def)
export const menuWithoutProps = (def: MenuDef<NO_PROPS>): MenuWithoutProps => new MenuWithoutProps(def)
