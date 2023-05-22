import type { Action, FormDefinition } from 'src/core/Requirement'
import type { ActionL } from '../models/Action'

/**
 * temporary hack so I can keep a shared ActionL class but still have a way to
 * retrieve the original function that is only available on the backend
 */
export const globalActionFnCache = new WeakMap<ActionL, Action<FormDefinition>>()
