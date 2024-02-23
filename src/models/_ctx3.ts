import { nanoid } from 'nanoid'

import { FormBuilder } from 'src/controls/FormBuilder'
import { Runtime } from 'src/runtime/Runtime'

export class GlobalCtx {
    id = nanoid()
    currentForm: Maybe<FormBuilder> = null
    currentRun: Maybe<Runtime> = null
}

const globalCtx = new GlobalCtx()
;(globalThis as any).globalCtx = globalCtx
