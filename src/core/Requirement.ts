import type { LATER } from 'LATER'
import type { Workflow } from 'src/back/Workflow'
import type { Requestable } from 'src/controls/Requestable'
import type { FormBuilder, InfoAnswer, InfoRequestFn } from 'src/controls/askv2'

// ACTIONS ============================================================
// 1. the main abstraction of cushy are actions.
/** quick function to help build actions in a type-safe way */

export const action = <const T extends ActionForm>(name: string, t: Omit<Action<T>, 'name'>): Action<T> => ({ name, ...t })
export type ActionType = <const T extends ActionForm>(name: string, t: Omit<Action<T>, 'name'>) => Action<T>

export type ActionForm = { [key: string]: Requestable }
export type ActionFormResult<Req extends ActionForm> = { [key in keyof Req]: InfoAnswer<Req[key]> }

export type Action<Reqs extends ActionForm> = {
    /** action name; default to unnamed_action_<nanoid()> */
    name: string
    /** help text to show user */
    help?: string
    /** the list of dependencies user can specify */
    ui?: (form: FormBuilder, flow: Workflow) => Reqs
    /** extra list of dependencies */
    // requirement?: (builder: ReqBuilder) => Reqs
    /** the code to run */
    run: (f: Workflow, r: ActionFormResult<Reqs>) => void | Promise<void>
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
    findOrCreate?: (flow: Workflow) => T

    /** if specified, Cushy will check if missing requirements can be created to
     * know if it shoul suggest this flow or not
     */
    syncCheckIfCreationIsPossible?: () => boolean
    creationLogic?: () => T
}

type Requirable_ = LATER<'Requirable'>

// helper to build requirements in a type-safe way
export type ReqBuilder = {
    [k in keyof Requirable_]: (req?: Omit<Requirement<Requirable_[k]>, 'type'>) => Requirement<Requirable_[k]>
}

// REQUIRABLE ============================================================
// requirements are lazylly transformed at execution time when needed by the action
export type Resolved<Reqs extends { [name: string]: Requirement }> = {
    [K in keyof Reqs]: Reqs[K] extends Requirement<infer T> ? () => T : never
}
