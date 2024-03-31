import type { Runtime } from '../runtime/Runtime'

import { AsyncLocalStorage } from 'async_hooks'

// https://nodejs.org/api/async_context.html#class-asynclocalstorage
const asyncRuntimeStorage = new AsyncLocalStorage<{ stepID: StepID; runtime: Runtime }>()
;(globalThis as any).globalAsyncStorage = asyncRuntimeStorage

export type AsyncRuntimeStorage = typeof asyncRuntimeStorage
