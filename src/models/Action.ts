import type { Branded, Maybe } from '../utils/types'

import type { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import type { FormDefinition } from '../core/Requirement'
import type { LiveInstance } from 'src/db/LiveInstance'

export type ActionDefinitionID = Branded<string, 'FlowDefinitionID'>
export const asActionDefinitionID = (s: string): ActionDefinitionID => s as any

export type ExecutionID = Branded<string, 'ExecutionID'>
export const asExecutionID = (s: string): ExecutionID => s as any

export type ActionT = {
    id: ActionDefinitionID
    name: string
    file: AbsolutePath
    form?: Maybe<FormDefinition>
}

/** a thin wrapper around a single action somewhere in a .cushy.ts file */
export interface ActionL extends LiveInstance<ActionT, ActionL> {}
export class ActionL {}
