import type { LiveInstance } from '../db/LiveInstance'
import type { LibraryFile } from 'src/cards/LibraryFile'
import type { SchemaDict } from 'src/controls/Spec'

import { statSync } from 'fs'
import { runInAction } from 'mobx'
import { basename } from 'pathe'

import { CUSHY_IMPORT } from '../compiler/CUSHY_IMPORT'
import { getCurrentForm_IMPL, getCurrentRun_IMPL } from './_ctx2'
import { CushyAppL } from './CushyApp'
import { Executable } from './Executable'
import { replaceImportsWithSyncImport } from 'src/back/ImportStructure'
import { App, AppRef } from 'src/cards/App'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'
import { asCushyAppID, type TABLES } from 'src/db/TYPES.gen'
import { extractErrorMessage } from 'src/utils/formatters/extractErrorMessage'
import { asRelativePath } from 'src/utils/fs/pathUtils'

// import { LazyValue } from 'src/db/LazyValue'

export interface CushyScriptL extends LiveInstance<TABLES['cushy_script']> {}
export class CushyScriptL {
    // get firstApp(): Maybe<CushyAppL> {
    //     return this.apps[0]
    // }

    /** relative path from CushyStudio root to the file that produced this script */
    get relPath(): RelativePath {
        return asRelativePath(this.data.path)
    }

    _apps_viaScript: Maybe<CushyAppL[]> = null
    get _apps_viaDB() {
        return cushy.db.cushy_app.select((q) => q.where('scriptID', '=', this.id), ['cushy_script'])
    }
    // private _apps_viaDB = new LiveCollection<TABLES['cushy_app']>({
    //     table: () => this.db.cushy_app,
    //     where: () => ({ scriptID: this.id }),
    // })

    get apps(): CushyAppL[] {
        if (this._apps_viaScript != null) return this._apps_viaScript
        return this._apps_viaDB
    }

    // ⏸️ get apps_viaDB(): CushyAppL[] {
    // ⏸️     return this._apps_viaDB.items
    // ⏸️ }

    // ⏸️ get apps_viaScript(): CushyAppL[] {
    // ⏸️     if (this._apps_viaScript == null) this.extractApps()
    // ⏸️     return this._apps_viaScript!
    // ⏸️ }

    onHydrate = () => {
        if (this.data.lastEvaluatedAt == null) this.evaluateAndUpdateApps()
    }

    get file(): LibraryFile {
        return this.st.library.getFile(this.relPath)
    }

    errors: { title: string; details: any }[] = []
    addError = (title: string, details: any = null): LoadStatus => {
        this.errors.push({ title, details })
        return LoadStatus.FAILURE
    }

    get isOutOfDate(): { needRecompile: boolean; reason: string } {
        return this._isOutOfDate()
    }

    _isOutOfDate = (): { needRecompile: boolean; reason: string } => {
        try {
            // 1. no lastExtractedAt => ❌ need recompile
            const lastExtractedAt = this.data.lastExtractedAt
            if (lastExtractedAt == null) return { needRecompile: true, reason: 'missing lastExtractedAt' }

            // 2. entrypoint more recent
            const relPath = statSync(this.relPath)
            if (relPath.mtime.getTime() > lastExtractedAt)
                return { needRecompile: true, reason: `file ${this.relPath} modified since last compile` }

            // 3. any deps more recent
            const deps = this.data.metafile?.inputs
            if (deps) {
                const inputs = Object.keys(deps)
                for (const input of inputs) {
                    const inputStats = statSync(input)
                    if (inputStats.mtime.getTime() > lastExtractedAt) {
                        return {
                            needRecompile: true,
                            reason: `dependency ${input} modified since last compile`,
                        }
                    }
                }
            }
            return {
                needRecompile: false,
                reason: 'lastExtractedAt + no legacy deps',
            }
        } catch (e) {
            // 4. crash (e.g. file does not exist anymore) => need recompile
            return {
                needRecompile: true,
                reason: `error checking dependencies: ${extractErrorMessage(e)}`,
            }
        }
    }
    // --------------------------------------------------------------------------------------
    /** cache of extracted apps */
    private _EXECUTABLES: Maybe<Executable[]> = null
    // private get EXECUTABLES(): Executable[] {
    //     if (this._EXECUTABLES == null) return this.evaluateAndUpdateApps()
    //     return this._EXECUTABLES
    // }

    getExecutable_orNull(appID: CushyAppID): Maybe<Executable> {
        //      '_'👇
        return this._EXECUTABLES?.find((executable) => appID === executable.appID)
    }

    /** more costly variation of getExecutable_orNull */
    getExecutable_orExtract(appID: CushyAppID): Maybe<Executable> {
        if (this._EXECUTABLES) return this._EXECUTABLES.find((executable) => appID === executable.appID)
        this.evaluateAndUpdateApps()
        return this._EXECUTABLES!.find((executable) => appID === executable.appID)
    }

    // --------------------------------------------------------------------------------------
    /**
     * this function
     *  - 1. evaluate scripts
     *  - 2. upsert apps in db
     *  - 3. bumpt lastEvaluatedAt (and lastSuccessfulEvaluation)
     */
    evaluateAndUpdateApps = (): Executable[] => {
        console.log(`[👙] extracting apps...`)
        // debugger
        this._EXECUTABLES = this._EVALUATE_SCRIPT()

        runInAction(() => {
            this._apps_viaScript = this._EXECUTABLES!.map((executable): CushyAppL => {
                const app = this.db.cushy_app.upsert({
                    id: executable.appID,
                    scriptID: this.id,
                    description: executable.description,
                    illustration: executable.illustration,
                    name: executable.name,
                    tags: executable.tags.join(','),
                    canStartFromImage: executable.canStartFromImage ? SQLITE_true : SQLITE_false,
                })
                return app
            })

            // bumpt timestamps
            const now = Date.now()
            if (this._apps_viaScript.length === 0) this.update({ lastEvaluatedAt: now })
            else this.update({ lastEvaluatedAt: now, lastSuccessfulEvaluationAt: now })
        })
        return this._EXECUTABLES
    }

    /**
     * this function takes some bundled app JSCode,
     * and returns the apps defined in it
     * returns [] on script execution failure
     * */
    private _EVALUATE_SCRIPT = (): Executable[] => {
        // toastInfo(`evaluating script: ${this.relPath}`)
        const codeJS = this.data.code
        const APPS: App<SchemaDict>[] = []

        let appIndex = 0
        // 1. setup DI registering mechanism
        const registerAppFn = (a1: string, a2: App<any>): AppRef<any> => {
            const app: App<SchemaDict> = typeof a1 !== 'string' ? a1 : a2
            const name = app.metadata?.name ?? basename(this.relPath)
            const appID = asCushyAppID(this.relPath + ':' + appIndex++) // 🔴 SUPER UNSAFE
            console.info(`[💙] found app: "${name}"`, { path: this.relPath, appID })
            APPS.push(app)
            return {
                id: appID,
                /**
                 * this is a virtual property; only here so app refs can carry the
                 * type-level form information.
                 */
                $FIELDS: 0 as any,
            }
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
                'getCurrentForm',
                'getCurrentRun',
                'cushy',
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
                getCurrentForm_IMPL,
                getCurrentRun_IMPL,
                //
                cushy,
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
