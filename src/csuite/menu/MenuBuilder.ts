import type { Field } from '../model/Field'
import type { Command } from '@codemirror/view'
import type { FC } from 'react'

import { SimpleMenuAction, type SimpleMenuActionProps } from './SimpleMenuAction'

/** class that will be injected in most places where you are expected to return a menu */
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

   SimpleMenuAction(p: SimpleMenuActionProps): SimpleMenuAction {
      return new SimpleMenuAction(p)
   }
}

export const menuBuilder = new MenuBuilder()
