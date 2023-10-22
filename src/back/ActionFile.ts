import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { Action, RequestableDict } from 'src/core/Action'
import type { STATE } from 'src/front/state'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'

import { readFileSync } from 'fs'
import { makeAutoObservable, observable } from 'mobx'
import path from 'pathe'
import { ActionPath } from 'src/back/ActionPath'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'
import { getPngMetadataFromUint8Array } from '../importers/getPngMetadata'
import { exhaust } from '../utils/ComfyUtils'
import { ManualPromise } from '../utils/ManualPromise'
import { transpileCode } from './transpiler'
import { DraftL } from 'src/models/Draft'

// prettier-ignore
export type LoadStrategy =
    | 'asCushyStudioAction'
    | 'asComfyUIWorkflow'
    | 'asComfyUIPrompt'
    | 'asComfyUIGeneratedPng'
    | 'asA1111PngGenerated'

enum LoadStatus {
    SUCCESS,
    FAILURE,
}

export class ActionFile {
    displayName: string
    constructor(
        public st: STATE,
        public absPath: AbsolutePath,
        public relPath: ActionPath,
    ) {
        this.displayName = path.basename(this.absPath)

        makeAutoObservable(this, { action: observable.ref })
    }

    // autoreload
    autoReload = false
    autoReloadTimeout?: NodeJS.Timeout
    setAutoReload = (v: boolean) => {
        if (this.autoReloadTimeout != null) clearTimeout(this.autoReloadTimeout)
        this.autoReload = v
        if (!v) return
        this.autoReloadTimeout = setInterval(() => {
            console.log('🟢 auto reloading...')
            this.load({ logFailures: true, force: true })
        }, 3000)
    }

    // status
    loaded = new ManualPromise<true>()
    errors: { title: string; details: any }[] = []
    addError = (title: string, details: any): LoadStatus => {
        this.errors.push({ title, details })
        return LoadStatus.FAILURE
    }

    /** action display name */
    get name(): string {
        return this.action?.name ?? path.basename(this.absPath)
    }

    get drafts(): DraftL[] {
        return this.st.db.drafts //
            .filter((draft) => draft.data.actionPath === this.relPath)
    }

    // extracted stuff
    action?: Maybe<Action<RequestableDict>> = null
    codeJS?: Maybe<string> = null
    codeTS?: Maybe<string> = null
    liteGraphJSON?: Maybe<LiteGraphJSON> = null
    promptJSON?: Maybe<ComfyPromptJSON> = null
    png?: Maybe<AbsolutePath> = null

    focusedDraft?: Maybe<DraftL> = null

    loadRequested = false
    /** load a file trying all compatible strategies */
    load = async (p: { logFailures: boolean; force?: boolean }): Promise<true> => {
        if (this.loadRequested && !p.force) return true
        this.loadRequested = true
        if (this.loaded.done && !p.force) return true
        const strategies = this.findLoadStrategies()
        for (const strategy of strategies) {
            const res = await this.loadWithStrategy(strategy)
            if (res) break
        }
        if (this.action) this.displayName = this.action.name
        this.st.layout.renameTab(`/action/${this.relPath}`, this.displayName)
        this.loaded.resolve(true)
        return true
    }

    private loadWithStrategy = async (strategy: LoadStrategy): Promise<LoadStatus> => {
        if (strategy === 'asCushyStudioAction') return this.load_asCushyStudioAction()
        if (strategy === 'asComfyUIPrompt') return this.load_asComfyUIPrompt()
        if (strategy === 'asComfyUIWorkflow') return this.load_asComfyUIWorkflow()
        if (strategy === 'asComfyUIGeneratedPng') return this.load_asComfyUIGeneratedPng()
        if (strategy === 'asA1111PngGenerated') {
            if (this.png == null) this.png = this.absPath
            this.addError('❌ asA1111 import currently broken', null)
            return LoadStatus.FAILURE
        }

        exhaust(strategy)
        throw new Error(`[💔] TOOL: unknown strategy ${strategy}`)
        // if (strategy)
    }

    // STRATEGIES ---------------------------------------------------------------------
    private findLoadStrategies(): LoadStrategy[] {
        if (this.absPath.endsWith('.ts')) return ['asCushyStudioAction']
        if (this.absPath.endsWith('.tsx')) return ['asCushyStudioAction']
        if (this.absPath.endsWith('.js')) return ['asCushyStudioAction']
        if (this.absPath.endsWith('.json')) return ['asComfyUIWorkflow', 'asComfyUIPrompt']
        if (this.absPath.endsWith('.png')) return ['asComfyUIGeneratedPng', 'asA1111PngGenerated']
        return ['asCushyStudioAction', 'asComfyUIWorkflow', 'asComfyUIPrompt', 'asComfyUIGeneratedPng', 'asA1111PngGenerated']
    }

    // LOADERS ------------------------------------------------------------------------
    // ACTION
    private load_asCushyStudioAction = async (): Promise<LoadStatus> => {
        // 1. transpile
        let codeJS: string
        try {
            codeJS = await transpileCode(this.absPath)
            this.codeJS = codeJS
            this.codeTS = readFileSync(this.absPath, 'utf-8')
        } catch (e) {
            return this.addError('transpile error in load_asCushyStudioAction', e)
        }

        // 2. extract tools
        this.action = this.RUN_ACTION_FILE(codeJS)
        if (this.action == null) return this.addError('❌ [load_asCushyStudioAction] no actions found', null)
        return LoadStatus.SUCCESS
    }

    // PROMPT
    private load_asComfyUIPrompt = async (): Promise<LoadStatus> => {
        try {
            const comfyPromptJSON = JSON.parse(readFileSync(this.absPath, 'utf-8'))
            const filename = path.basename(this.absPath)
            const author = path.dirname(this.absPath)
            const title = filename
            this.codeJS = this.st.importer.convertPromptToCode(comfyPromptJSON, {
                title,
                author,
                preserveId: true,
                autoUI: false,
            })
            this.codeTS = this.codeJS
            this.promptJSON = comfyPromptJSON
            this.action = this.RUN_ACTION_FILE(this.codeJS)
            const graph = this.st.db.graphs.create({ comfyPromptJSON: comfyPromptJSON })
            const workflow = await graph.json_workflow()
            this.liteGraphJSON = workflow
            return LoadStatus.SUCCESS
            // 🦊 const codeJSAuto = this.st.importer.convertPromptToCode(json, { title, author, preserveId: true, autoUI: true })
            // 🦊 const codeTSAuto = codeJS
            // 🦊 const toolsAuto =  this.RUN_ACTION_FILE({ codeJS: codeJSAuto })
            // 🦊 this.asAutoAction = __OK({ codeJS: codeJSAuto, codeTS: codeTSAuto, tools: toolsAuto }) // 🟢 AUTOACTION
        } catch (error) {
            return this.addError(`❌ [load_asComfyUIPrompt] crash`, error)
        }
    }

    // WOKRFLOW
    private load_asComfyUIWorkflow = (): Promise<LoadStatus> => {
        const workflowStr = readFileSync(this.absPath, 'utf-8')
        return this.importWorkflowFromStr(workflowStr)
    }

    private load_asComfyUIGeneratedPng = async (): Promise<LoadStatus> => {
        console.log('🟢 found ', this.absPath)
        this.png = this.absPath

        // extract metadata
        const result = getPngMetadataFromUint8Array(readFileSync(this.absPath))
        if (result == null) return this.addError(`❌ [load_asComfyUIGeneratedPng] no metadata in png`, null)
        if (result.type === 'failure')
            return this.addError(`❌ [load_asComfyUIGeneratedPng] metadata extraction failed`, result.value)
        const metadata = result.value
        const workflowStr = (metadata as { [key: string]: any }).workflow
        if (workflowStr == null) return this.addError(`❌ [load_asComfyUIGeneratedPng] no workflow in metadata`, metadata)
        return this.importWorkflowFromStr(workflowStr)
    }

    // LOADERS ------------------------------------------------------------------------
    private importWorkflowFromStr = async (workflowStr: string): Promise<LoadStatus> => {
        // 1. litegraphJSON
        let workflowJSON: LiteGraphJSON
        try {
            workflowJSON = JSON.parse(workflowStr)
        } catch (error) {
            return this.addError(`❌3. workflow is not valid json`, error)
        }

        // 2. promptJSON
        let promptJSON: ComfyPromptJSON
        try {
            promptJSON = convertLiteGraphToPrompt(this.st.schema, workflowJSON)
        } catch (error) {
            return this.addError(`❌ [importWorkflowFromStr] cannot convert LiteGraph To Prompt`, error)
        }
        // at this point, we know the workflow is valid
        //  and we have both the prompt, and the workflow
        this.liteGraphJSON = workflowJSON
        this.promptJSON = promptJSON
        const title = path.basename(this.absPath)
        const author = path.basename(path.dirname(this.absPath))

        // 3. asAction
        try {
            this.codeJS = this.st.importer.convertPromptToCode(promptJSON, {
                title,
                author,
                preserveId: true,
                autoUI: true,
            })
            this.codeTS = this.codeJS
            this.action = this.RUN_ACTION_FILE(this.codeJS)
            return LoadStatus.SUCCESS
        } catch (error) {
            return this.addError(`❌ [importWorkflowFromStr] cannot convert LiteGraph To Prompt`, error)
        }
    }

    RUN_ACTION_FILE = (codeJS: string): Action<RequestableDict> | undefined => {
        // 1. DI registering mechanism
        const ACTIONS: Action<RequestableDict>[] = []
        const registerActionFn = (a1: string, a2: Action<any>): void => {
            const action = typeof a1 !== 'string' ? a1 : a2
            console.info(`[💙] found action: "${name}"`, { path: this.absPath })
            ACTIONS.push(action)
        }

        // 2. eval file to extract actions
        try {
            const ProjectScriptFn = new Function('action', codeJS)
            ProjectScriptFn(registerActionFn)
            if (ACTIONS.length === 0) return
            if (ACTIONS.length > 1)
                this.addError(
                    '❌4. more than one action found',
                    ACTIONS.map((a) => a.name),
                )
            return ACTIONS[0]
        } catch (e) {
            this.addError('❌5. cannot convert prompt to code', e)
            return
        }
    }
}
