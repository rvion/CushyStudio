import type { Domain } from './IDomain'

import { nanoid } from 'nanoid'

// ---------------------------------------------
export class GlobalFormCtx {
    id = nanoid()
    currentForm: Maybe<Domain> = null
}
const globalCtx = new GlobalFormCtx()
;(globalThis as any).globalCtx = globalCtx
// -------------------------------------------

// ⏸️ const getGlobalCtx = () => {
// ⏸️     const _ = (globalThis as any).globalCtx as GlobalFormCtx
// ⏸️     if (_ == null) {
// ⏸️         debugger
// ⏸️         throw new Error(`No globalCtx`)
// ⏸️     }
// ⏸️     return _
// ⏸️ }

/** every function that may potentially call prefab form needs to be wrapped with that */
export const runWithGlobalForm = <T>(form: Domain, f: () => T): T => {
    // const globalCtx = getGlobalCtx()

    // same form, no need to do anything
    if (globalCtx.currentForm === form) return f()

    // different form, temporarilly change context
    const prev = globalCtx.currentForm
    globalCtx.currentForm = form
    const res = f()
    globalCtx.currentForm = prev
    return res
}

/**
 * ❌ DO NOT USE DIRECTLY
 *
 * @internal
 *
 * You need to use `getCurrentForm` instead if building a CushyApp.
 * It is magically available in app context, and does not need to be imported.
 *
 * 2024-03-12 rvion: now that form library is going to be usable outside of cushy
 *   | type here must be generic (IFormBuilder) => but it's ok, cause it's going
 *   | to be properly typed soon
 *
 * */
export const getCurrentForm_IMPL = (): Domain => {
    // const globalCtx = getGlobalCtx()
    if (globalCtx.currentForm == null) {
        console.log(`[👙] `, globalCtx)
        debugger
        throw new Error(`No form in context !`)
    }
    return globalCtx.currentForm
}
