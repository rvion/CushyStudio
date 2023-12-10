import { basename } from 'pathe'
import { replaceImportsWithSyncImport } from 'src/back/ImportStructure'
import { App, WidgetDict } from 'src/cards/App'
import type { LiveInstance } from '../db/LiveInstance'

import { CushyScriptT, asCushyAppID } from 'src/db/TYPES.gen'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { CushyAppL } from './CushyApp'
import { LiveCollection } from 'src/db/LiveCollection'
import { CUSHY_IMPORT } from './CUSHY_IMPORT'
import { LibraryFile } from 'src/cards/LibraryFile'

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
        this._LIVE_APPS = this.EVALUATE_SCRIPT(this.data.code)
        this.apps = this._LIVE_APPS.map((liveApp: App<WidgetDict>, ix): CushyAppL => {
            const computedAppID = this.relPath + ':' + ix
            const app = this.db.cushy_apps.upsert({
                id: asCushyAppID(computedAppID),
                scriptID: this.id,
            })
            return app
        })
    }

    getLiveApp(appID: CushyAppID): Maybe<App<WidgetDict>> {
        return this.LIVE_APPS.find((liveApp, ix) => {
            const computedAppID = this.relPath + ':' + ix
            if (appID === computedAppID) return true
            return false
        })
    }

    get file(): LibraryFile {
        return this.st.library.getFile(this.relPath)
    }

    get LIVE_APPS(): App<WidgetDict>[] {
        if (this._LIVE_APPS == null) {
            this._LIVE_APPS = this.EVALUATE_SCRIPT(this.data.code)
        }
        return this._LIVE_APPS
    }

    errors: { title: string; details: any }[] = []
    addError = (title: string, details: any = null): LoadStatus => {
        this.errors.push({ title, details })
        return LoadStatus.FAILURE
    }

    /** cache of extracted apps */
    private _LIVE_APPS!: App<WidgetDict>[]

    /** this function takes some bundled app JSCode, and returns the apps defined in it */
    EVALUATE_SCRIPT = (codeJS: string): App<WidgetDict>[] => {
        const APPS: App<WidgetDict>[] = []

        // 1. setup DI registering mechanism
        const registerAppFn = (a1: string, a2: App<any>): void => {
            const app: App<WidgetDict> = typeof a1 !== 'string' ? a1 : a2
            const name = app.metadata?.name ?? basename(this.relPath)
            console.info(`[💙] found action: "${name}"`, { path: this.relPath })
            APPS.push(app)
        }

        // 2. eval file to extract actions
        try {
            // 2.1. replace imports
            const codJSWithoutWithImportsReplaced = replaceImportsWithSyncImport(codeJS) // REWRITE_IMPORTS(codeJS)
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
            return APPS //.map((app) => new CompiledApp(this, app))
        } catch (e) {
            console.error(`[📜] CushyScript execution failed:`, e)
            // this.addError('❌5. cannot convert prompt to code', e)
            return []
        }
    }
}

enum LoadStatus {
    SUCCESS = 1,
    FAILURE = 0,
}
