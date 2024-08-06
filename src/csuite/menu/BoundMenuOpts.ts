import type { IconName } from '../icons/icons'
import type { Menu } from './Menu'

import { nanoid } from 'nanoid'

import { BoundMenuSym } from '../introspect/_isBoundMenu'
import { Trigger } from '../trigger/Trigger'
import { MenuInstance } from './MenuInstance'

// ------------------------------------------------------------------------------------------
// A bound menu; ready to be opened without further params
// great abstraction to handle nested sub-menus and more

export type BoundMenuOpts = { title?: string }
export class BoundMenu<Ctx = any, Props = any> {
    uid: string = nanoid()
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
    open = (): Trigger | Promise<Trigger> => this.menu.open(this.props)
    init = (keysTaken?: Set<string>): MenuInstance<Props> => new MenuInstance(this.menu, this.props, keysTaken)
}
