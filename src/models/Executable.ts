import type { CushyScriptL } from './CushyScriptL'
import type { App } from 'src/cards/App'
import type { AppMetadata } from 'src/cards/AppManifest'

import { basename } from 'pathe'

import { asCushyAppID } from 'src/db/TYPES.gen'

export class Executable {
    constructor(
        //
        public script: CushyScriptL,
        public ix: number,
        public def: App<any>,
    ) {}

    get ui() {
        return this.def.ui
    }

    get run() {
        return this.def.run
    }

    get canStartFromImage() {
        return this.def.canStartFromImage ?? false
    }

    get metadata(): Maybe<AppMetadata> {
        return this.def.metadata
    }

    get name(): string {
        return this.def.metadata?.name ?? basename(this.script.relPath)
    }

    get tags(): string[] {
        return this.def.metadata?.tags ?? []
    }

    get description(): Maybe<string> {
        return this.def.metadata?.description
    }

    get illustration(): Maybe<string> {
        return this.def.metadata?.illustration
    }

    get appID(): CushyAppID {
        return asCushyAppID(this.script.relPath + ':' + this.ix)
    }
}
