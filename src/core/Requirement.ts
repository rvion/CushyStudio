import type { FlowRun } from 'src/back/FlowRun'

// ACTIONS ============================================================
// 1. the main abstraction of cushy are actions.
/** quick function to help build actions in a type-safe way */

export const action = <const T extends Requirements>(name: string, t: Omit<Action<T>, 'name'>): Action<T> => ({ name, ...t })
export type ActionType = <const T extends Requirements>(name: string, t: Omit<Action<T>, 'name'>) => Action<T>

export type Action<Reqs extends Requirements> = {
    /** action name; default to unnamed_action_<nanoid()> */
    name: string
    /** help text to show user */
    help?: string
    requirement?: (builder: ReqBuilder) => Reqs
    /** the code to run */
    run: (f: FlowRun, r: Resolved<Reqs>) => void | Promise<void>
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
    findOrCreate?: (flow: FlowRun) => T

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
