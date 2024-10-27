import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { CushyScriptL } from './CushyScript'
import type { LoadedCustomView } from './Executable'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { LiveTable } from '../db/LiveTable'

export class MediaCustomRepo extends LiveTable<TABLES['media_custom'], typeof MediaCustomL> {
   constructor(liveDB: LiveDB) {
      super(liveDB, 'media_custom', '🖼️', MediaCustomL)
      this.init()
   }
}

export class MediaCustomL extends BaseInst<TABLES['media_custom']> {
   instObservabilityConfig: undefined
   dataObservabilityConfig: undefined

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
