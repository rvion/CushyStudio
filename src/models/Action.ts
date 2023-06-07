// import type { GraphID, GraphL } from 'src/models/Graph'
// import type { LiveInstance } from '../db/LiveInstance'
// import type { Branded, Maybe } from '../utils/types'
// import type { ToolID, ToolL } from './Tool'

// import { nanoid } from 'nanoid'
// import { deepCopyNaive } from '../utils/ComfyUtils'
// import { LiveRef } from '../db/LiveRef'
// import { LiveRefOpt } from '../db/LiveRefOpt'
// import { asStepID } from './Step'
// import { Status } from '../back/Status'

// export type FormPath = (string | number)[]

// export type ActionID = Branded<string, 'FormID'>
// export const asActionID = (s: string): ActionID => s as any

// // 🔴 🔴 🔴 TODO: remove actions and switch to step only. no reason to keep action those are just weird.
// export type ActionT = {
//     /** action id */
//     id: ActionID

//     /** starting graph */
//     inputGraphID: GraphID

//     /** tool */
//     toolID?: Maybe<ToolID>

//     /** action input value */
//     params: Maybe<any>
// }

// export interface ActionL extends LiveInstance<ActionT, ActionL> {}
// export class ActionL {

// }
