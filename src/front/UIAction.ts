import { ActionDefinitionID } from 'src/back/ActionDefinition'
import { ImageInfos } from 'src/core/GeneratedImageSummary'

export type UIAction =
    | { type: 'paint'; img: ImageInfos }
    | { type: 'form'; form: any }
    | { type: 'any'; form: any }
    | { type: 'flow'; flowID: ActionDefinitionID }
