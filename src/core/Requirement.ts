import type { LATER } from 'LATER'
import type { Runtime } from 'src/back/Runtime'
import type { Requestable } from '../controls/InfoRequest'
import type { InfoAnswer } from '../controls/InfoAnswer'
import type { FormBuilder } from 'src/controls/FormBuilder'

// ACTIONS ============================================================
// 1. the main abstraction of cushy are actions.
/** quick function to help build actions in a type-safe way */

export const action = <const F extends FormDefinition>(name: string, t: Omit<Action<F>, 'name'>): Action<F> => ({ name, ...t })
export type ActionType = <const F extends FormDefinition>(name: string, t: Omit<Action<F>, 'name'>) => Action<F>

export type FormDefinition = { [key: string]: Requestable }
export type FormResult<Req extends FormDefinition> = { [key in keyof Req]: InfoAnswer<Req[key]> }

export type Action<FormDef extends FormDefinition> = {
    author: string
    /** action name; default to unnamed_action_<nanoid()> */
    name: string
    /** help text to show user */
    help?: string
    /** temporary hack so I can work more efficiently (lower first) */
    priority?: number
    /** the list of dependencies user can specify */
    ui?: (form: FormBuilder /*, flow: Workflow*/) => FormDef
    /** extra list of dependencies */
    // requirement?: (builder: ReqBuilder) => Reqs
    /** the code to run */
    run: (f: Runtime, r: FormResult<FormDef>) => void | Promise<void>
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
