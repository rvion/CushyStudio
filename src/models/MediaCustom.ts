import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { CushyScriptL } from './CushyScript'
import type { LoadedCustomView } from './Executable'
import type { StepL } from './Step'

import { LiveRefOpt } from '../db/LiveRefOpt'

export interface MediaCustomL extends LiveInstance<TABLES['media_custom']> {}
export class MediaCustomL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')

    get relPath(): Maybe<RelativePath> {
        return this.data.viewID?.split(':')[0] as Maybe<RelativePath>
    }

    get script(): Maybe<CushyScriptL> {
        if (this.relPath == null) return null
        const file = this.st.library.getFile(this.relPath)
        if (file == null) return null
        const script = file.script
        return script
    }

    get view(): Maybe<LoadedCustomView> {
        if (this.script == null) return null
        const view = this.script.getView_orNull(this.data.viewID)
        // if (view == null) debugger
        return view
    }
}
