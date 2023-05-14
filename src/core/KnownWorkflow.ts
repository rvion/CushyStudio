import type { ActionDefinitionID } from 'src/back/ActionDefinition'
import type { FormDefinition } from './Requirement'

export type ActionRef = {
    name: string
    id: ActionDefinitionID
    form: FormDefinition
}
