import type { MenuItemProps } from '../dropdown/MenuItem'
import type { Field } from '../model/Field'
import type { Command } from '@codemirror/view'
import type { FC } from 'react'

import { MenuDivider } from '../dropdown/MenuDivider'
import { Menu, type MenuProps } from './Menu'
import { SimpleMenuAction } from './SimpleMenuAction'

/**
 * class that will be injected in most places where you are expected
 * to return a list of menu entries
 * @see src/csuite/menu/MenuEntry.ts
 * */
export class MenuBuilder<Ctx> {
   field<T extends Field>(field: T): T {
      return field
   }

   Component<T extends FC<any>>(component: T): T {
      return component
   }

   Command<T extends Command>(command: T): T {
      return command
   }

   SimpleMenuAction(p: MenuItemProps): SimpleMenuAction {
      return new SimpleMenuAction(p)
   }

   SubMenu(p: MenuProps): Menu {
      return new Menu(p)
   }

   Divider = MenuDivider
}

export const menuBuilder = new MenuBuilder()
