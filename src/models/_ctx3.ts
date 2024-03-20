import type { IFormBuilder } from '../controls/Form'
import type { Runtime } from '../runtime/Runtime'

import { nanoid } from 'nanoid'

export class GlobalCtx {
    id = nanoid()
    currentForm: Maybe<IFormBuilder> = null
    currentRun: Maybe<Runtime> = null
}

const globalCtx = new GlobalCtx()
;(globalThis as any).globalCtx = globalCtx
