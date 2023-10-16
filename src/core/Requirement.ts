import type { Runtime } from 'src/back/Runtime'
import type { FormBuilder, ReqResult, Requestable } from '../controls/InfoRequest'

// ACTIONS ============================================================
// 1. the main abstraction of cushy are actions.
/** quick function to help build actions in a type-safe way */

// export const action = <const F extends RequestableDict>(name: string, t: Omit<Action<F>, 'name'>): Action<F> => ({ name, ...t })
export type ActionType = <const F extends RequestableDict>(name: string, t: Omit<Action<F>, 'name'>) => Action<F>

// export type FormDefinition = { [key: string]: Requestable }
export type FormResult<Req extends Requestable> = ReqResult<Req>

export type RequestableDict = { [key: string]: Requestable }

export type Action<FIELDS extends RequestableDict> = {
    /** who did that? */
    author: string
    /** this description will show-up at the top of the action form */
    description?: string
    /** action name; default to unnamed_action_<nanoid()> */
    name: string
    /** help text to show user */
    help?: string
    /** temporary hack so I can work more efficiently (lower first) */
    priority?: number
    /** the list of dependencies user can specify */
    ui?: (form: FormBuilder /*, flow: Workflow*/) => FIELDS
    /** extra list of dependencies */
    // requirement?: (builder: ReqBuilder) => Reqs
    /** the code to run */
    run: (f: Runtime, r: { [k in keyof FIELDS]: FIELDS[k]['$Output'] }) => void | Promise<void>
    /** next actions to suggest user */
    next?: string[]
}

// REQUIREMENTS ============================================================
/** a set of requirements your action expect to be runnable */
export type Requirements = {
    [name: string]: Requirement
}

/** a single requirement */
export type Requirement<T = any> = {
    // the required node or value required to be present in the graph / flow
    type: string

    tag?: string | string[]
    findOrCreate?: (flow: Runtime) => T

    /** if specified, Cushy will check if missing requirements can be created to
     * know if it shoul suggest this flow or not
     */
    syncCheckIfCreationIsPossible?: () => boolean
    creationLogic?: () => T
}

// helper to build requirements in a type-safe way
export type ReqBuilder = {
    [k in keyof Requirable]: (req?: Omit<Requirement<Requirable[k]>, 'type'>) => Requirement<Requirable[k]>
}

// REQUIRABLE ============================================================
// requirements are lazylly transformed at execution time when needed by the action
export type Resolved<Reqs extends { [name: string]: Requirement }> = {
    [K in keyof Reqs]: Reqs[K] extends Requirement<infer T> ? () => T : never
}
