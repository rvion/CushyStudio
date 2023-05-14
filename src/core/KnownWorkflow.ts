import type { ActionDefinitionID } from 'src/back/ActionDefinition'
import type { FormDefinitino } from './Requirement'

export type ActionRef = {
    name: string
    id: ActionDefinitionID
    form: FormDefinitino
}
