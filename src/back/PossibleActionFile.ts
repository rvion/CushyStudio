import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { Action, RequestableDict } from 'src/core/Requirement'
import type { STATE } from 'src/front/state'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'
import type { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'

import { readFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import path from 'pathe'
import { globalToolFnCache } from '../core/globalActionFnCache'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'
import { getPngMetadataFromUint8Array } from '../importers/getPngMetadata'
import { ToolL, asToolID } from '../models/Tool'
import { exhaust } from '../utils/ComfyUtils'
import { __FAIL, __OK, type Result } from '../utils/Either'
import { ManualPromise } from '../utils/ManualPromise'
import { transpileCode } from './transpiler'
import { FormBuilder, Requestable } from 'src/controls/InfoRequest'

// prettier-ignore
export type LoadStrategy =
    | 'asCushyStudioAction'
    | 'asComfyUIWorkflow'
    | 'asComfyUIPrompt'
    | 'asComfyUIGeneratedPng'
    | 'asA1111PngGenerated'

export type ToolAndCode = {
    codeTS: string
    codeJS: string
    tools: Result<ToolL[]>
}

type Focus = 'action' | 'autoaction' | 'png' | 'prompt' | 'workflow'

export class PossibleActionFile {
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

    constructor(
        public st: STATE,
        public absPath: AbsolutePath,
        public relPath: RelativePath,
    ) {
        makeAutoObservable(this)
    }

    focus: Focus = 'action'

    get tool() {
        if (this.focus === 'action') return this.asAction?.value?.tools.value?.[0]
        if (this.focus === 'autoaction') return this.asAutoAction?.value?.tools.value?.[0]
    }

    // code
    asAction?: Result<ToolAndCode>

    // autoui
    asAutoAction?: Result<ToolAndCode>

    // comfyUI
    liteGraphJSON?: Result<LiteGraphJSON>

    // prompt
    promptJSON?: Result<ComfyPromptJSON>

    // illustration
    png?: Result<AbsolutePath>

    loaded = new ManualPromise<true>()

    get mainTool(): Maybe<ToolL> {
        if (this.asAutoAction?.success && this.asAutoAction?.value?.tools.success) return this.asAutoAction.value.tools.value?.[0]
        if (this.asAction?.success && this.asAction?.value?.tools.success) return this.asAction.value.tools.value?.[0]
    }

    private _uid = 0
    load = async (p: {
        //
        logFailures: boolean
        force?: boolean
    }): Promise<true> => {
        if (this.loaded.done && !p.force) return true
        this._uid = 0
        const strategies = this.findLoadStrategies()
        for (const strategy of strategies) await this.loadWithStrategy(strategy)
        this.loaded.resolve(true)
        return true
    }

    private loadWithStrategy = async (strategy: LoadStrategy): Promise<void> => {
        if (strategy === 'asCushyStudioAction') return this.load_asCushyStudioAction()
        if (strategy === 'asComfyUIPrompt') return this.load_asComfyUIPrompt()
        if (strategy === 'asComfyUIWorkflow') return this.load_asComfyUIWorkflow()
        if (strategy === 'asComfyUIGeneratedPng') return this.load_asComfyUIGeneratedPng()
        if (strategy === 'asA1111PngGenerated') {
            if (this.png == null) this.png = __OK(this.absPath)
            return console.log('❌ asA1111 import currently broken')
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
    private load_asCushyStudioAction = async (): Promise<void> => {
        try {
            // 1. read file
            const codeTS = readFileSync(this.absPath, 'utf-8')

            // 2. transpile
            let codeJS: string
            try {
                codeJS = await transpileCode(this.absPath)
                // codeJS = await transpileCodeOld(codeTS)
            } catch (e) {
                this.asAction = __FAIL(`❌ [load_asCushyStudioAction] transpile error`, e)
                return
            }
            // 3. extract tools
            const tools = await this.loadTools({ codeJS, codeTS })
            this.asAction = __OK({ codeJS, codeTS, tools })
        } catch (error) {
            this.asAction = __FAIL(`❌ [load_asCushyStudioAction] crash`, error)
        }
    }

    private load_asComfyUIPrompt = async (): Promise<void> => {
        try {
            const json = JSON.parse(readFileSync(this.absPath, 'utf-8'))
            const filename = path.basename(this.absPath)
            const author = path.dirname(this.absPath)

            // convert to simple action (no AutoUI)
            const title = filename
            const codeJS = this.st.importer.convertPromptToCode(json, { title, author, preserveId: true, autoUI: false })
            const codeTS = codeJS
            // at this point, we know the json was a valid ComfyUI Prompt
            //  and we have both the prompt, and the workflow
            this.promptJSON = __OK(json) // 🟢 PROMPT

            const tools = await this.loadTools({ codeJS, codeTS })
            this.asAction = __OK({ codeJS, codeTS, tools: tools }) // 🟢 ACTION

            const codeJSAuto = this.st.importer.convertPromptToCode(json, { title, author, preserveId: true, autoUI: true })
            const codeTSAuto = codeJS
            const toolsAuto = await this.loadTools({ codeJS: codeJSAuto, codeTS: codeTSAuto })
            this.asAutoAction = __OK({ codeJS: codeJSAuto, codeTS: codeTSAuto, tools: toolsAuto }) // 🟢 AUTOACTION

            const graph = this.st.db.graphs.create({ comfyPromptJSON: json })
            const workflow = await graph.json_workflow()
            this.liteGraphJSON = __OK(json.workflow) // 🟢 WORKFLOW
        } catch (error) {
            if (this.promptJSON == null) {
                this.promptJSON = __FAIL(`❌ [load_asComfyUIPrompt] crash`, error)
                return
            }
        }
    }

    private load_asComfyUIWorkflow = (): Promise<void> => {
        const workflowStr = readFileSync(this.absPath, 'utf-8')
        return this.importWorkflowFromStr(workflowStr)
    }

    private load_asComfyUIGeneratedPng = async (): Promise<void> => {
        console.log('🟢 found ', this.absPath)
        if (this.png == null) this.png = __OK(this.absPath)

        const result = getPngMetadataFromUint8Array(readFileSync(this.absPath))
        if (result == null) {
            if (this.promptJSON == null) this.promptJSON = __FAIL(`❌ [load_asComfyUIGeneratedPng] no metadata in png`, null) // prettier-ignore
            if (this.liteGraphJSON == null) this.liteGraphJSON = __FAIL(`❌ [load_asComfyUIGeneratedPng] no metadata in png`, null) // prettier-ignore
            return
        }

        if (result.type === 'failure') {
            if (this.promptJSON == null) this.promptJSON = __FAIL(`❌ [load_asComfyUIGeneratedPng] metadata extraction failed`, result.value) // prettier-ignore
            if (this.liteGraphJSON == null) this.liteGraphJSON = __FAIL(`❌ [load_asComfyUIGeneratedPng] metadata extraction failed`, result.value) // prettier-ignore
            return
        }

        const metadata = result.value
        const workflowStr = (metadata as { [key: string]: any }).workflow
        if (workflowStr == null) {
            if (this.promptJSON == null) this.promptJSON = __FAIL(`❌ [load_asComfyUIGeneratedPng] no workflow in metadata`, metadata) // prettier-ignore
            if (this.liteGraphJSON == null) this.liteGraphJSON = __FAIL(`❌ [load_asComfyUIGeneratedPng] no workflow in metadata`, metadata) // prettier-ignore
            return
        }
        return this.importWorkflowFromStr(workflowStr)
    }

    // LOADERS ------------------------------------------------------------------------
    private importWorkflowFromStr = async (workflowStr: string): Promise<void> => {
        // 1. litegraphJSON
        let workflowJSON: LiteGraphJSON
        try {
            workflowJSON = JSON.parse(workflowStr)
        } catch (error) {
            this.liteGraphJSON = __FAIL(`❌3. workflow is not valid json`, error)
            return
        }

        // 2. promptJSON
        let promptJSON: ComfyPromptJSON
        try {
            // console.groupCollapsed()
            promptJSON = convertLiteGraphToPrompt(this.st.schema, workflowJSON)
            // console.groupEnd()
        } catch (error) {
            console.log(error)
            if (this.liteGraphJSON == null)
                this.liteGraphJSON = __FAIL(`❌ [importWorkflowFromStr] cannot convert LiteGraph To Prompt`, error)

            if (this.promptJSON == null)
                this.promptJSON = __FAIL(`❌ [importWorkflowFromStr] cannot convert LiteGraph To Prompt`, error)
            return
        }
        // at this point, we know the workflow is valid
        //  and we have both the prompt, and the workflow
        this.liteGraphJSON = __OK(workflowJSON)
        this.promptJSON = __OK(promptJSON)

        const title = path.basename(this.absPath)
        const author = path.basename(path.dirname(this.absPath))

        // 3. asAction
        try {
            const codeJS = this.st.importer.convertPromptToCode(promptJSON, { title, author, preserveId: true, autoUI: true })
            const codeTS = codeJS
            const tools = await this.loadTools({ codeJS, codeTS })
            this.asAction = __OK({ codeJS, codeTS, tools })
        } catch (error) {
            if (this.asAction == null)
                this.asAction = __FAIL(`❌ [importWorkflowFromStr] cannot convert LiteGraph To Prompt`, error)
        }

        // 4. asAutoAction
        try {
            const codeJSAuto = this.st.importer.convertPromptToCode(promptJSON, {
                title,
                author,
                preserveId: true,
                autoUI: false,
            })
            const codeTSAuto = codeJSAuto
            const toolsAuto = await this.loadTools({ codeJS: codeJSAuto, codeTS: codeTSAuto })
            this.asAutoAction = __OK({ codeJS: codeJSAuto, codeTS: codeTSAuto, tools: toolsAuto })
        } catch (error) {
            if (this.asAutoAction == null)
                this.asAutoAction = __FAIL(`❌ [importWorkflowFromStr] cannot convert LiteGraph To Prompt`, error)
            return
        }
    }

    private loadTools = async (p: { codeJS: string; codeTS: string }): Promise<Result<ToolL[]>> => {
        const { codeJS, codeTS } = p

        // this.DEBUG_CODE = codeTS
        const actionsPool: { name: string; action: Action<RequestableDict> }[] = []
        const registerActionFn = (name: string, action: Action<any>): void => {
            console.info(`[💙] TOOL: found action: "${name}"`, { path: this.absPath })
            actionsPool.push({ name, action })
        }

        // creating a formBuilder
        // const schema = this.st.schema
        // const formBuilder = new FormBuilder(schema)

        try {
            const ProjectScriptFn = new Function('action', codeJS)
            await ProjectScriptFn(registerActionFn)

            const tools: ToolL[] = []
            for (const a of actionsPool) {
                const actionID = asToolID(`${this.absPath}#${a.name}#${this._uid++}`)
                const tool = this.st.db.tools.upsert({
                    id: actionID,
                    owner: a.action.author,
                    file: this.absPath,
                    description: a.action.description,
                    name: a.name,
                    priority: a.action.priority ?? 100,
                    codeTS: codeTS,
                    codeJS: codeJS,
                })
                if (tool.drafts.items.length === 0) {
                    tool.createDraft(this.st.db.projects.firstOrCrash())
                }
                globalToolFnCache.set(tool, a.action)
                tools.push(tool)
            }

            return __OK(tools)
        } catch (e) {
            return __FAIL('❌5. cannot convert prompt to code', {
                // codeJS,
                error: e,
            })
        }
    }
}

// writeFileSync(dest, code, 'utf-8')
// this.handleNewFile(filePath + '.ts')
// return
// console.log(code)
