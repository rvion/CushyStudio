import type { Branded, Maybe } from '../utils/types'

import type { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import type { FormDefinition } from '../core/Requirement'
import type { LiveInstance } from 'src/db/LiveInstance'

export type ActionID = Branded<string, 'FlowDefinitionID'>
export const asActionID = (s: string): ActionID => s as any

export type ActionT = {
    id: ActionID
    name: string
    file: AbsolutePath
    form?: Maybe<FormDefinition>
}

/** a thin wrapper around a single action somewhere in a .cushy.ts file */
export interface ActionL extends LiveInstance<ActionT, ActionL> {}
export class ActionL {}
