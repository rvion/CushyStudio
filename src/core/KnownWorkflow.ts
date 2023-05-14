import type { ActionDefinitionID } from 'src/back/ActionDefinition'
import type { ActionForm } from './Requirement'

export type ActionRef = {
    name: string
    id: ActionDefinitionID
    form: ActionForm
}
