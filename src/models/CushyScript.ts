import type { LibraryFile } from '../cards/LibraryFile'
import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'

import { statSync } from 'fs'
import { runInAction } from 'mobx'

import { App, AppRef, type CustomView, type CustomViewRef } from '../cards/App'
import { CUSHY_IMPORT, replaceImportsWithSyncImport } from '../compiler/transpiler'
import { extractErrorMessage } from '../csuite/formatters/extractErrorMessage'
import { getCurrentForm_IMPL } from '../csuite/model/runWithGlobalForm'
import { SQLITE_false, SQLITE_true } from '../csuite/types/SQLITE_boolean'
import { asRelativePath } from '../utils/fs/pathUtils'
import { CushyAppL } from './CushyApp'
import { Executable, LoadedCustomView } from './Executable'
import { getCurrentRun_IMPL } from './getGlobalRuntimeCtx'

// import { LazyValue } from '../db/LazyValue'

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
        if (this.data.lastEvaluatedAt == null) this.evaluateAndUpdateAppsAndViews()
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
    private _VIEWS: Maybe<LoadedCustomView[]> = []

    /** cache of extracted views */
    private _EXECUTABLES: Maybe<Executable[]> = null

    /** do not evaluate the script if script is not evaluated yet, nor re-evaluate it if script if missing */
    getExecutable_orNull(appID: CushyAppID): Maybe<Executable> {
        return this._EXECUTABLES?.find((executable) => appID === executable.appID)
    }

    /** more costly variation of getExecutable_orNull */
    getExecutable_orExtract(appID: CushyAppID): Maybe<Executable> {
        if (this._EXECUTABLES) return this._EXECUTABLES.find((executable) => appID === executable.appID)
        this.evaluateAndUpdateAppsAndViews()
        return this._EXECUTABLES!.find((executable) => appID === executable.appID)
    }

    /** do not evaluate the script if script is not evaluated yet, nor re-evaluate it if script if missing */
    getView_orNull(viewID: CushyViewID): Maybe<LoadedCustomView> {
        return this._VIEWS?.find((view) => viewID === view.id)
    }

    /** more costly variation of getExecutable_orNull */
    getView_orExtract(viewID: CushyViewID): Maybe<LoadedCustomView> {
        if (this._VIEWS) return this._VIEWS.find((view) => viewID === view.id)
        this.evaluateAndUpdateAppsAndViews()
        return this._VIEWS!.find((view) => viewID === view.id)
    }

    // --------------------------------------------------------------------------------------
    /**
     * this function
     *  - 1. evaluate scripts
     *  - 2. upsert apps in db
     *  - 3. bumpt lastEvaluatedAt (and lastSuccessfulEvaluation)
     */
    evaluateAndUpdateAppsAndViews = (): /* Executable[]  */ void => {
        console.log(`[🧐] extracting apps...`)
        // debugger
        const evalRes = this._EVALUATE_SCRIPT()
        this._EXECUTABLES = evalRes.apps
        this._VIEWS = evalRes.views

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
        return // this._EXECUTABLES
    }

    /**
     * this function takes some bundled app JSCode,
     * and returns the apps defined in it
     * returns [] on script execution failure
     * */
    private _EVALUATE_SCRIPT = (): { apps: Executable[]; views: LoadedCustomView[] } => {
        // toastInfo(`evaluating script: ${this.relPath}`)
        const codeJS = this.data.code

        // 1. setup DI registering mechanism
        // APPS ---------------------------------------------------------------------------
        const APPS: Executable[] = []
        let appIndex = 0
        const registerAppFn = (appDef: App<any>): AppRef<any> => {
            const app = new Executable(this, appIndex++, appDef)
            console.info(`[💙] found app: "${app.name}"`, { path: this.relPath, appID: app.appID })
            APPS.push(app)
            return app.ref
        }

        // VIEWS ---------------------------------------------------------------------------
        let viewIndex = 0
        const VIEWS: LoadedCustomView[] = []
        const registerViewFn = (viewDef: CustomView<any>): CustomViewRef<any> => {
            const view = new LoadedCustomView(this, viewIndex++, viewDef)
            console.info(`[💙] found view: "${view.id}"`, { path: this.relPath, viewID: view.id })
            VIEWS.push(view)
            return view.ref
        }

        // 2. eval file to extract actions

        let codJSWithoutWithImportsReplaced
        try {
            // console.log(`🟡 BEFORE: rewriting module import (${mod})`)
            codJSWithoutWithImportsReplaced = replaceImportsWithSyncImport(codeJS) // REWRITE_IMPORTS(codeJS)
        } catch {
            console.error(`❌ script evealuation crashed when replacing imports`)
            return { apps: [], views: [] }
        }
        try {
            // 2.1. replace imports
            const ProjectScriptFn = new Function(
                //
                'app',
                'view',
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
                registerViewFn,
                //
                CUSHY_IMPORT,
                getCurrentForm_IMPL,
                getCurrentRun_IMPL,
                //
                cushy,
            )

            // 2.3. return all apps
            return { apps: APPS, views: VIEWS }
        } catch (e) {
            console.error(`[📜] CushyScript execution failed:`, e)
            console.groupCollapsed(`[📜] <script that failed>`)
            console.log(codJSWithoutWithImportsReplaced)
            console.groupEnd()
            // this.addError('❌5. cannot convert prompt to code', e)
            return { apps: [], views: [] }
        }
    }
}

enum LoadStatus {
    SUCCESS = 1,
    FAILURE = 0,
}
