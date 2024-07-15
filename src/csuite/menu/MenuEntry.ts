import type { BoundCommand } from '../commands/Command'
import type { Field } from '../model/Field'
import type { SimpleMenuModal } from './SimpleMenuModal'

import { type FC } from 'react'

import { Command } from '../commands/Command'
import { BoundMenu } from './Menu'
import { SimpleMenuAction } from './SimpleMenuAction'

// prettier-ignore
export type MenuEntry =
    /** inline subform  */
    | Field
    /** custom component  */
    | FC<{}>
    /** a command */
    | Command /* command may be passed unbound: in that case, they retrieve their context from their provider */
    | BoundCommand
    | BoundMenu
    /** simple MenuEntry */
    | SimpleMenuAction
    | SimpleMenuModal
