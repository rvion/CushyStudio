import type { GlobalCtx } from './_ctx3'
import type { AsyncRuntimeStorage } from './asyncRuntimeStorage'
/**
 * 🔶 THIS MODULE MUST NOT IMPORT ANYTHING (only types allowed).
 * 🔶 IT WILL BE INCLUDED IN MOST PREFABS.
 */
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { Runtime } from 'src/runtime/Runtime'

const getGlobalCtx = () => {
    const _ = (globalThis as any).globalCtx as GlobalCtx
    if (_ == null) {
        debugger
        throw new Error(`No globalCtx`)
    }
    return _
}
/** every function that may potentially call prefab form needs to be wrapped with that */
export const runWithGlobalForm = <T>(form: FormBuilder, f: () => T): T => {
    const globalCtx = getGlobalCtx()

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
 * @internal
 *
 * You should probably use `getCurrentForm` instead.
 * It is magically available in app context, and does not need to be imported.
 * */
export const getCurrentForm_IMPL = (): FormBuilder => {
    const globalCtx = getGlobalCtx()
    if (globalCtx.currentForm == null) {
        console.log(`[👙] `, globalCtx)
        debugger
        throw new Error(`No form in context !`)
    }
    return globalCtx.currentForm
}

// -------------------------------------------------------
export const getGlobalRuntimeCtx = () => {
    const _ = (globalThis as any).globalAsyncStorage as AsyncRuntimeStorage
    if (_ == null) {
        debugger
        throw new Error(`No AsyncRuntimeStorage`)
    }
    return _
}

/**
 * @internal
 *
 * You should probably use `getCurrentRun` instead.
 * It is magically available in app context, and does not need to be imported.
 * */
export const getCurrentRun_IMPL = (): Runtime => {
    const globalCtx = getGlobalRuntimeCtx()
    const ctx = globalCtx.getStore()
    if (ctx == null) throw new Error(`No run in context`)
    return ctx.runtime
}
