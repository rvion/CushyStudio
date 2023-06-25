import type { LiveInstance } from '../db/LiveInstance'
import type { Branded, Maybe } from '../utils/types'
import type { GraphID, GraphL } from './Graph'
import type { StepL } from './Step'
import type { ToolID, ToolL } from './Tool'

import { LiveRef } from '../db/LiveRef'

export type FormPath = (string | number)[]

export type DraftID = Branded<string, 'DraftID'>
export const asDraftID = (s: string): DraftID => s as any

export type DraftT = {
    id: DraftID /** form that lead to creating this Draft */
    toolID: ToolID /** tool params */
    params: Maybe<any> /** parent */
    graphID: GraphID
}

/** a thin wrapper around a single Draft somewhere in a .cushy.ts file */
export interface DraftL extends LiveInstance<DraftT, DraftL> {}
export class DraftL {
    graph = new LiveRef<this, GraphL>(this, 'graphID', 'graphs')
    tool = new LiveRef<this, ToolL>(this, 'toolID', 'tools')
    start = (): StepL => {
        // console.log('🟢', JSON.stringify(this.data))
        const step = this.graph.item.createStep(this.data)
        step.start()
        return step
    }
    focus = () => this.graph.item.update({ focusedDraftID: this.id })
    reset = () => (this.data.params = {})
    getPathInfo = (path: FormPath): string => this.id + '/' + path.join('/')

    // form part --------------------------------------------------------
    // onUpdate = (prev: Maybe<ActionT>, next: ActionT) => {
    //     if (prev == null) return
    //     if (prev.toolID !== next.toolID) this.reset()
    // }

    // tool = new LiveRefOpt<this, ToolL>(this, 'toolID', 'tools')

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
