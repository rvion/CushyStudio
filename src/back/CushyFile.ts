import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { Action, FormDefinition } from 'src/core/Requirement'
import type { STATE } from 'src/front/state'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'

import { readFileSync } from 'fs'
import path from 'pathe'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'
import { ComfyPromptJSON } from '../types/ComfyPrompt'
import { exhaust } from '../utils/ComfyUtils'
import { Result, ResultFailure, __FAIL, __OK } from '../utils/Either'
import { ManualPromise } from '../utils/ManualPromise'
import { FormBuilder } from '../controls/FormBuilder'
import { globalToolFnCache } from '../core/globalActionFnCache'
import { ToolL, asToolID } from '../models/Tool'
import { transpileCode } from './transpiler'
import { getPngMetadataFromUint8Array } from '../importers/getPngMetadata'
import { makeAutoObservable } from 'mobx'

const formBuilder = new FormBuilder()

// prettier-ignore
export type LoadStrategy =
    | 'asCushyStudioAction'
    | 'asComfyUIWorkflow'
    | 'asComfyUIPrompt'
    | 'asComfyUIGeneratedPng'
    | 'asA1111PngGenerated'

export type ActionFileResult = Result<ActionFile>

export type ActionFile = {
    tools: ToolL[]
    // code
    codeTS: string
    codeJS: string
    // optional; if imported from them
    liteGraphJSON?: LiteGraphJSON
    promptJSONd?: ComfyPromptJSON
}

export type PafLoadStatus =
    | { type: 'pending' }
    | { type: 'success'; result: ActionFile }
    | { type: 'failure'; result: ResultFailure }

export class PossibleActionFile {
    // CONTENT = ''
    actions: ToolL[] = []

    constructor(
        public st: STATE,
        public filePath: AbsolutePath,
    ) {
        // this.CONTENT = readFileSync(absPath, 'utf-8')
        // this.extractWorkflowsV2()

        makeAutoObservable(this)
    }

    get relPath() {
        return this.filePath.replace(this.st.actionsFolderPath, '')
    }
    loaded = new ManualPromise<ActionFile>()

    // convertToTS = () => {
    //     //
    // }

    statusByStrategy = new Map<LoadStrategy, PafLoadStatus>()
    loadResult: Maybe<{ paf?: ActionFile; failures: string[] }> = null

    load = async (opts: { logFailures: boolean }): Promise<{ paf?: ActionFile; failures: string[] }> => {
        if (this.loadResult) return this.loadResult
        const strategies = this.findLoadStrategies()
        const failures: string[] = []
        for (const strategy of strategies) {
            this.statusByStrategy.set(strategy, { type: 'pending' })
            const result = await this.loadWithStrategy(strategy)
            if (result.success) {
                this.loaded.resolve(result.value)
                this.statusByStrategy.set(strategy, { type: 'success', result: result.value })
                this.loadResult = { failures, paf: result.value }
                return this.loadResult
            } else {
                this.statusByStrategy.set(strategy, { type: 'failure', result })
                if (opts.logFailures) console.error(result)
                failures.push(result.message)
            }
        }
        this.loadResult = { failures }
        this.loaded.reject(new Error(`[💔] TOOL: no strategy worked`))
        return this.loadResult
    }

    private loadWithStrategy = async (strategy: LoadStrategy): Promise<ActionFileResult> => {
        if (strategy === 'asCushyStudioAction') return this.load_asCushyStudioAction()
        if (strategy === 'asComfyUIPrompt') return this.load_asComfyUIPrompt()
        if (strategy === 'asComfyUIWorkflow') return this.load_asComfyUIWorkflow()
        if (strategy === 'asComfyUIGeneratedPng') return this.load_asComfyUIGeneratedPng()
        if (strategy === 'asA1111PngGenerated') return __FAIL('❌1. not implemented yet', null)

        exhaust(strategy)
        throw new Error(`[💔] TOOL: unknown strategy ${strategy}`)
        // if (strategy)
    }

    // STRATEGIES ---------------------------------------------------------------------
    private findLoadStrategies(): LoadStrategy[] {
        if (this.filePath.endsWith('.ts')) return ['asCushyStudioAction']
        if (this.filePath.endsWith('.tsx')) return ['asCushyStudioAction']
        if (this.filePath.endsWith('.js')) return ['asCushyStudioAction']
        if (this.filePath.endsWith('.json')) return ['asComfyUIWorkflow', 'asComfyUIPrompt']
        if (this.filePath.endsWith('.png')) return ['asComfyUIGeneratedPng', 'asA1111PngGenerated']
        return ['asCushyStudioAction', 'asComfyUIWorkflow', 'asComfyUIPrompt', 'asComfyUIGeneratedPng', 'asA1111PngGenerated']
    }

    // LOADERS ------------------------------------------------------------------------
    load_asCushyStudioAction = async (): Promise<ActionFileResult> => {
        try {
            const codeTS = readFileSync(this.filePath, 'utf-8')
            const codeJS = await transpileCode(codeTS)
            return this.loadTools({ codeJS, codeTS })
        } catch (error) {
            return __FAIL(`❌2. cannot transpile code`, error)
        }
    }

    load_asComfyUIPrompt = async (): Promise<ActionFileResult> => {
        try {
            const json = JSON.parse(readFileSync(this.filePath, 'utf-8'))
            const filename = path.basename(this.filePath)
            const author = path.dirname(this.filePath)
            const codeJS = this.st.importer.convertFlowToCode(json, {
                title: filename,
                author,
                preserveId: true,
                autoUI: true,
            })
            const codeTS = codeJS
            return this.loadTools({ codeJS, codeTS })
        } catch (error) {
            return __FAIL(`❌2. cannot transpile code`, error)
        }
    }

    load_asComfyUIWorkflow = (): Promise<ActionFileResult> => {
        const workflowStr = readFileSync(this.filePath, 'utf-8')
        return this.importWorkflowFromStr(workflowStr)
    }

    load_asComfyUIGeneratedPng = async (): Promise<ActionFileResult> => {
        console.log('🟢 found ', this.filePath)
        const result = getPngMetadataFromUint8Array(readFileSync(this.filePath))
        if (result == null) return __FAIL(`❌0. no metadata`, null)

        if (result.type === 'failure') {
            return __FAIL(`❌1. metadata extraction failed`, result.value)
        }

        const metadata = result.value
        const workflowStr = (metadata as { [key: string]: any }).workflow
        if (workflowStr == null) {
            return __FAIL(`❌2. no workflow in metadata`, metadata)
        }
        return this.importWorkflowFromStr(workflowStr)
    }

    // LOADERS ------------------------------------------------------------------------

    private importWorkflowFromStr = async (workflowStr: string): Promise<ActionFileResult> => {
        // 1. litegraphJSON
        let workflowJSON: LiteGraphJSON
        try {
            workflowJSON = JSON.parse(workflowStr)
        } catch (error) {
            return __FAIL(`❌3. workflow is not valid json`, error)
        }

        // 2. promptJSON
        let promptJSON: ComfyPromptJSON
        try {
            // console.groupCollapsed()
            promptJSON = convertLiteGraphToPrompt(this.st.schema, workflowJSON)
            // console.groupEnd()
        } catch (error) {
            console.log(error)
            return __FAIL(`❌4. cannot convert LiteGraph To Prompt`, error)
        }

        // 3. code
        try {
            const title = path.basename(this.filePath)
            const author = path.basename(path.dirname(this.filePath))
            const codeJS = this.st.importer.convertFlowToCode(promptJSON, {
                title,
                author,
                preserveId: true,
                autoUI: true,
            })
            const codeTS = codeJS
            return this.loadTools({ codeJS, codeTS })
        } catch (error) {
            return __FAIL('❌5. cannot convert prompt to code', error)
        }
    }

    DEBUG_CODE: string = ''
    private loadTools = async (p: { codeJS: string; codeTS: string }): Promise<ActionFileResult> => {
        const { codeJS, codeTS } = p
        this.DEBUG_CODE = codeTS
        const actionsPool: { name: string; action: Action<FormDefinition> }[] = []
        const registerActionFn = (name: string, action: Action<any>): void => {
            console.info(`[💙] TOOL: found action: "${name}"`, { path: this.filePath })
            actionsPool.push({ name, action })
        }

        try {
            const ProjectScriptFn = new Function('action', codeJS)
            await ProjectScriptFn(registerActionFn)

            const tools: ToolL[] = []
            for (const a of actionsPool) {
                const actionID = asToolID(`${this.filePath}#${a.name}`)
                const tool = this.st.db.tools.upsert({
                    id: actionID,
                    owner: a.action.author,
                    file: this.filePath,
                    name: a.name,
                    priority: a.action.priority ?? 100,
                    form: a.action.ui?.(formBuilder),
                    codeTS: codeTS,
                    codeJS: codeJS,
                })
                globalToolFnCache.set(tool, a.action)
                tools.push(tool)
            }

            return __OK({ tools, codeTS, codeJS })
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
