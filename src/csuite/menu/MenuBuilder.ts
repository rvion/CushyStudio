import type { Field } from '../model/Field'
import type { Command } from '@codemirror/view'
import type { FC } from 'react'

import { SimpleMenuAction, type SimpleMenuActionProps } from './SimpleMenuAction'

// import { Command } from '../commands/Command'

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
    // Command<T extends Command>(command: T): T {
    //     return new Command()
    // }
}

export const menuBuilder = new MenuBuilder()
