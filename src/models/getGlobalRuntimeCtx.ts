// RUNTIME -------------------------------------------------------
// Dependency Injection mecahnism
import type { Runtime } from '../runtime/Runtime'
import type { AsyncRuntimeStorage } from './asyncRuntimeStorage'

/** ❌ DO NOT USE DIRECTLY */
export const getGlobalRuntimeCtx = () => {
   const _ = (globalThis as any).globalAsyncStorage as AsyncRuntimeStorage
   if (_ == null) {
      debugger
      throw new Error(`No AsyncRuntimeStorage`)
   }
   return _
}

/**
 * ❌ DO NOT USE DIRECTLY
 *
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
