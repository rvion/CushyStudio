import { ToolID } from 'src/models/Tool'
import { ImageT } from '../models/Image'

export type UIAction =
    | { type: 'paint'; img: ImageT }
    | { type: 'form'; form: any }
    | { type: 'any'; form: any }
    | { type: 'flow'; flowID: ToolID }
