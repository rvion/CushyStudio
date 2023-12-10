import { App, WidgetDict } from 'src/cards/App'
import { CushyScriptL } from './CushyScriptL'
import { asCushyAppID } from 'src/db/TYPES.gen'

export class Executable {
    constructor(
        //
        public script: CushyScriptL,
        public ix: number,
        public def: App<WidgetDict>,
    ) {}

    get ui() {
        return this.def.ui
    }

    get run() {
        return this.def.run
    }

    get metadata() {
        return this.def.metadata
    }

    get appID(): CushyAppID {
        return asCushyAppID(this.script.relPath + ':' + this.ix)
    }
}
