import type { Action, RequestableDict } from 'src/core/Action'
import type { ToolL } from '../models/Tool'

/**
 * temporary hack so I can keep a shared ActionL class but still have a way to
 * retrieve the original function that is only available on the backend
 */
export const globalToolFnCache = new WeakMap<ToolL, Action<RequestableDict>>()
