import { basename } from 'pathe'
import { replaceImportsWithSyncImport } from 'src/back/ImportStructure'
import { App, WidgetDict } from 'src/cards/App'
import type { LiveInstance } from '../db/LiveInstance'

import { LibraryFile } from 'src/cards/LibraryFile'
import { LiveCollection } from 'src/db/LiveCollection'
import { CushyScriptT } from 'src/db/TYPES.gen'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { CUSHY_IMPORT } from './CUSHY_IMPORT'
import { CushyAppL } from './CushyApp'
import { Executable } from './Executable'

export interface CushyScriptL extends LiveInstance<CushyScriptT, CushyScriptL> {}
export class CushyScriptL {
    get firstApp(): Maybe<CushyAppL> {
        return this.apps[0]
    }

    /** relative path from CushyStudio root to the file that produced this script */
    get relPath(): RelativePath {
        return asRelativePath(this.data.path)
    }

    /** collection of all apps upserted from this script */
    apps_viaDB = new LiveCollection<CushyAppL>({
        table: () => this.db.cushy_scripts,
        where: () => ({ scriptID: this.id }),
    })

    apps!: CushyAppL[]

    onHydrate = () => {
        this._EXECUTABLES = this.EVALUATE_SCRIPT()
        this.apps = this._EXECUTABLES.map((executable): CushyAppL => {
            const app = this.db.cushy_apps.upsert({
                id: executable.appID,
                scriptID: this.id,
                description: executable.description,
                illustration: executable.illustration,
                name: executable.name,
                tags: executable.tags.join(','),
            })
            return app
        })
    }

    get file(): LibraryFile {
        return this.st.library.getFile(this.relPath)
    }

    errors: { title: string; details: any }[] = []
    addError = (title: string, details: any = null): LoadStatus => {
        this.errors.push({ title, details })
        return LoadStatus.FAILURE
    }

    // --------------------------------------------------------------------------------------
    /** cache of extracted apps */
    private _EXECUTABLES!: Executable[]
    get EXECUTABLES(): Executable[] {
        if (this._EXECUTABLES == null) {
            this._EXECUTABLES = this.EVALUATE_SCRIPT()
        }
        return this._EXECUTABLES
    }

    getExecutable(appID: CushyAppID): Maybe<Executable> {
        return this.EXECUTABLES.find((executable) => appID === executable.appID)
    }

    /** this function takes some bundled app JSCode, and returns the apps defined in it */
    EVALUATE_SCRIPT = (): Executable[] => {
        const codeJS = this.data.code
        const APPS: App<WidgetDict>[] = []

        // 1. setup DI registering mechanism
        const registerAppFn = (a1: string, a2: App<any>): void => {
            const app: App<WidgetDict> = typeof a1 !== 'string' ? a1 : a2
            const name = app.metadata?.name ?? basename(this.relPath)
            console.info(`[💙] found action: "${name}"`, { path: this.relPath })
            APPS.push(app)
        }

        // 2. eval file to extract actions

        let codJSWithoutWithImportsReplaced
        try {
            codJSWithoutWithImportsReplaced = replaceImportsWithSyncImport(codeJS) // REWRITE_IMPORTS(codeJS)
        } catch {
            console.error(`❌ impossible to replace imports`)
            return []
        }
        try {
            // 2.1. replace imports
            const ProjectScriptFn = new Function(
                //
                'action',
                'card',
                'app',
                'CUSHY_IMPORT',
                //
                codJSWithoutWithImportsReplaced,
            )

            // 2.2. extract apps by evaluating script
            ProjectScriptFn(
                //
                registerAppFn,
                registerAppFn,
                registerAppFn,
                //
                CUSHY_IMPORT,
            )

            // 2.3. return all apps
            return APPS.map((app, ix) => new Executable(this, ix, app))
        } catch (e) {
            console.error(`[📜] CushyScript execution failed:`, e)
            console.groupCollapsed(`[📜] <script that failed>`)
            console.log(codJSWithoutWithImportsReplaced)
            console.groupEnd()
            // this.addError('❌5. cannot convert prompt to code', e)
            return []
        }
    }
}

enum LoadStatus {
    SUCCESS = 1,
    FAILURE = 0,
}
