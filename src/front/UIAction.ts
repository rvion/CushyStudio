import { ActionDefinitionID } from 'src/back/ActionDefinition'
import { ImageT } from '../models/Image'

export type UIAction =
    | { type: 'paint'; img: ImageT }
    | { type: 'form'; form: any }
    | { type: 'any'; form: any }
    | { type: 'flow'; flowID: ActionDefinitionID }
