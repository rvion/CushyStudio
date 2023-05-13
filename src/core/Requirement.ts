import type { FlowRun } from 'src/back/FlowRun'

// ACTIONS ============================================================
// 1. the main abstraction of cushy are actions.
/** quick function to help build actions in a type-safe way */

export const action = <const T extends Requirements>(t: Action<T>): Action<T> => t
export type ActionType = <const T extends Requirements>(t: Action<T>) => Action<T>

export type Action<Reqs extends Requirements> = {
    /** action name; default to unnamed_action_<nanoid()> */
    name?: string
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

// EXAMPLE ============================================================

export const x = action({
    name: 'mask-clothes', // <- action name
    help: 'extract a mak for the given clothes', // <- action help text
    requirement: (kk) => ({
        // <- action require an image and an input text with tag 'clothes'
        image: kk.IMAGE({}),
        clothes: kk.STRING({ tag: 'clothes' }),
    }),
    run: (flow, reqs) => {
        //
        const image = reqs.image
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: image,
            prompt: reqs.clothes,
            negative_prompt: 'face, arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        flow.nodes.PreviewImage({ images: clothesMask.IMAGE })
    },
})
