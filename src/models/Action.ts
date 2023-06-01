import type { GraphID, GraphL } from 'src/models/Graph'
import type { LiveInstance } from '../db/LiveInstance'
import type { Branded, Maybe } from '../utils/types'
import type { ToolID, ToolL } from './Tool'

import { nanoid } from 'nanoid'
import { deepCopyNaive } from '../utils/ComfyUtils'
import { LiveRef } from '../db/LiveRef'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { asStepID } from './Step'
import { Status } from '../back/Status'

export type FormPath = (string | number)[]

export type ActionID = Branded<string, 'FormID'>
export const asActionID = (s: string): ActionID => s as any

export type ActionT = {
    /** action id */
    id: ActionID

    /** starting graph */
    inputGraphID: GraphID

    /** tool */
    toolID?: Maybe<ToolID>

    /** action input value */
    params: Maybe<any>
}

export interface ActionL extends LiveInstance<ActionT, ActionL> {}
export class ActionL {
    onUpdate = (prev: Maybe<ActionT>, next: ActionT) => {
        if (prev == null) return
        if (prev.toolID !== next.toolID) this.reset()
    }

    tool = new LiveRefOpt<this, ToolL>(this, 'toolID', 'tools')
    inputGraph = new LiveRef<this, GraphL>(this, 'inputGraphID', 'graphs')

    submit = async () => {
        const toolID = this.tool.id
        if (toolID == null) return console.log('❌ no action yet')
        const outputGraph = this.inputGraph.item.clone()
        const step = this.db.steps.create({
            id: asStepID(nanoid()),
            outputGraphID: outputGraph.id,
            params: deepCopyNaive(this.data.params),
            parentGraphID: this.data.inputGraphID,
            toolID: toolID,
            status: Status.New,
        })
        await step.start()
    }

    reset = () => (this.data.params = {})

    getAtPath(path: FormPath): any {
        if (this.data.params == null) this.data.params = {}
        let current = this.data.params
        for (const key of path) {
            if (!current.hasOwnProperty(key)) {
                return undefined
            }
            current = current[key]
        }
        return current
    }
    setAtPath = (path: FormPath, value: any) => {
        if (this.data.params == null) this.data.params = {}
        // console.log(path, value, toJS(this.data.value))
        let current = this.data.params
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i]
            if (!current[key]) current[key] = typeof path[i + 1] === 'number' ? [] : {}
            current = current[key]
        }
        current[path[path.length - 1]] = value
        // console.log(this.Form)
    }
}
