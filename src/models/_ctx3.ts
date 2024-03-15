import type { IFormBuilder } from 'src/controls/Form'
import type { Runtime } from 'src/runtime/Runtime'

import { nanoid } from 'nanoid'

export class GlobalCtx {
    id = nanoid()
    currentForm: Maybe<IFormBuilder> = null
    currentRun: Maybe<Runtime> = null
}

const globalCtx = new GlobalCtx()
;(globalThis as any).globalCtx = globalCtx
