import type { Branded, Maybe } from '../utils/types'
import type { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import type { FormDefinition } from '../core/Requirement'
import type { LiveInstance } from 'src/db/LiveInstance'

export type ToolID = Branded<string, 'FlowDefinitionID'>
export const asToolID = (s: string): ToolID => s as any

export type ToolT = {
    id: ToolID
    priority: number
    name: string
    file: AbsolutePath
    form?: Maybe<FormDefinition>
    codeTS?: string
    codeJS?: string
}

/** a thin wrapper around a single action somewhere in a .cushy.ts file */
export interface ToolL extends LiveInstance<ToolT, ToolL> {}
export class ToolL {
    get name() { return this.data.name } // prettier-ignore
}
