import type { Action } from 'src/core/Requirement'
import type { ToolL } from '../models/Tool'
import type { Requestable } from 'src/controls/InfoRequest'

/**
 * temporary hack so I can keep a shared ActionL class but still have a way to
 * retrieve the original function that is only available on the backend
 */
export const globalToolFnCache = new WeakMap<ToolL, Action<Requestable>>()
