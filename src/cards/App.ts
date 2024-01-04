import type { CSSProperties } from 'react'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { Runtime } from 'src/runtime/Runtime'
import type { Widget } from '../controls/Widget'
import { AppMetadata } from './AppManifest'

// ACTIONS ============================================================
// 1. the main abstraction of cushy are actions.
/** quick function to help build actions in a type-safe way */

// export const action = <const F extends WidgetDict>(name: string, t: Omit<Action<F>, 'name'>): Action<F> => ({ name, ...t })
export type GlobalFunctionToDefineAnApp = <const F extends WidgetDict>(t: App<F>) => AppRef<F>
export type GlobalGetCurrentRun = () => Runtime
export type GlobalGetCurrentForm = () => FormBuilder
export type ActionTagMethod = (arg0: string) => string
export type ActionTagMethodList = Array<{ key: string; method: ActionTagMethod }>
export type ActionTags = (arg0: ActionTagMethodList) => void
export type WidgetDict = { [key: string]: Widget }
export type AppRef<F> = { $Output: F; id: CushyAppID }

export type $ExtractFormValueType<FIELDS extends WidgetDict> = { [k in keyof FIELDS]: FIELDS[k]['$Output'] }

export type App<FIELDS extends WidgetDict> = {
    /** app interface (GUI) */
    ui: (form: FormBuilder) => FIELDS

    /** app execution logic */
    run: (f: Runtime<FIELDS>, r: { [k in keyof FIELDS]: FIELDS[k]['$Output'] }) => void | Promise<void>

    /** the list of dependencies user can specify */
    metadata?: AppMetadata

    /** form container className */
    containerClassName?: string

    containerStyle?: CSSProperties

    // HELP ============================================================
    /** dependencies of your action */
    customNodeRequired?: string[]
    /** help text to show user when using their card */
    help?: string
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
