import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { STATE } from 'src/state/state'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'

import { readFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import path, { basename, relative } from 'pathe'
import { asCushyScriptID } from 'src/db/TYPES.gen'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'
import { exhaust } from '../utils/misc/ComfyUtils'
import { ManualPromise } from '../utils/misc/ManualPromise'
import { getPngMetadataFromUint8Array } from '../utils/png/_getPngMetadata'
import { Library } from './Library'

import { dirname } from 'pathe'
import { createEsbuildContextFor } from 'src/compiler/transpiler'

// @ts-ignore
import { LiveCollection } from 'src/db/LiveCollection'
import { CushyScriptL } from 'src/models/CushyScriptL'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { AppMetadata } from './AppManifest'

// prettier-ignore
export type LoadStrategy =
    | 'asCushyStudioAction'
    | 'asComfyUIWorkflow'
    | 'asComfyUIPrompt'
    | 'asComfyUIGeneratedPng'
    | 'asA1111PngGenerated'

// prettier-ignore
type LoadStatus =
    | { type: 'SUCCESS', script:CushyScriptL}
    | { type: 'FAILURE', msg?: string }

// prettier-ignore
type FileLoadResult =
    | { type: 'cached' }
    | { type: 'failed' }
    | { type: 'newScript'; script: CushyScriptL }

/**
 * wrapper around files in the library folder
 * responsible to convert files to scripts
 */
export class LibraryFile {
    constructor(
        //
        public library: Library,
        public absPath: AbsolutePath,
        public relPath: RelativePath,
    ) {
        this.st = library.st
        this.strategies = this.findLoadStrategies()
        makeAutoObservable(this, { _esbuildContext: false })
    }

    get baseName() {
        return basename(this.relPath)
    }
    /** access to the global app state */
    st: STATE

    /** abs path to the folder this file is in */
    get folderAbs(): AbsolutePath {
        // console.log(`[👙] 🔴`, dirname(this.absPath))
        return asAbsolutePath(dirname(this.absPath))
    }

    /** true if file match current library search */
    matchesSearch = (search: string): boolean => {
        if (search === '') return true
        const searchLower = search.toLowerCase()
        const nameLower = basename(this.relPath).toLowerCase()
        return nameLower.includes(searchLower)
    }

    strategies: LoadStrategy[]

    // --------------------------------------------------------
    get score(): number { return 0 } // prettier-ignore

    private get deckRelativeFilePath(): string {
        return relative(this.folderAbs, this.absPath)
    }

    // --------------------------------------------------------
    // status
    // loaded = new ManualPromise<true>()
    errors: { title: string; details: any }[] = []
    addError = (title: string, details: any = null): LoadStatus => {
        this.errors.push({ title, details })
        return { type: 'FAILURE' }
    }

    // the first thing to do to load an app is to get the Cushy Script from it.
    codeJS?: Maybe<string> = null

    scripts = new LiveCollection<CushyScriptL>({
        table: () => this.st.db.cushy_scripts,
        where: () => ({ path: this.relPath }),
    })

    liteGraphJSON?: Maybe<LiteGraphJSON> = null
    promptJSON?: Maybe<ComfyPromptJSON> = null
    png?: Maybe<AbsolutePath> = null

    /** load a file trying all compatible strategies */
    successfullLoadStrategies: Maybe<LoadStrategy> = null

    script0: Maybe<CushyScriptL>

    isLoading = false
    hasBeenLoadedAtLeastOnce = false

    load = async (p?: { force?: boolean }): Promise<FileLoadResult> => {
        // don't load more than once unless manually requested
        if (this.isLoading) return { type: 'cached' }
        this.isLoading = true

        // don't load once already loaded
        // if (this.loaded.done && !p?.force) return true
        if (this.hasBeenLoadedAtLeastOnce && !p?.force) return { type: 'cached' }

        let script: Maybe<CushyScriptL> = null
        // try every strategy in order
        for (const strategy of this.strategies) {
            const res = await this.loadWithStrategy(strategy)
            if (res.type === 'SUCCESS') {
                script = res.script
                this.script0 = res.script
                this.successfullLoadStrategies = strategy
                // console.log(`[🟢] LibFile: LOAD SUCCESS !`)
                break
            }
        }

        // done
        this.hasBeenLoadedAtLeastOnce = true
        this.isLoading = false
        if (script == null) {
            console.log(`[🔴] LibFile: LOAD FAILURE !`)
            return { type: 'failed' }
        } else {
            return { type: 'newScript', script }
        }
    }

    private loadWithStrategy = async (strategy: LoadStrategy): Promise<LoadStatus> => {
        if (strategy === 'asCushyStudioAction') return this.load_asTypescriptFile()
        if (strategy === 'asComfyUIPrompt') return this.load_asComfyUIPromptJSON()
        if (strategy === 'asComfyUIWorkflow') return this.load_asComfyUIWorkflowJSON()
        if (strategy === 'asComfyUIGeneratedPng') return this.load_asComfyUIGeneratedPng()
        if (strategy === 'asA1111PngGenerated') {
            if (this.png == null) this.png = this.absPath
            this.addError('❌ can not import file as Automaric1111 image', { reason: 'not supported yet' })
            return { type: 'FAILURE' }
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

    // public syncS

    private load_asTypescriptFile = async (): Promise<LoadStatus> => {
        try {
            // 1. transpile
            // await this.pkg.rebuild()
            // console.log('-- a', { eps: this.relPath })
            const ctx = await this._esbuildContext
            // console.log('-- b')
            const res = await ctx.rebuild()
            // console.log('-- c')

            const distPathWrongExt = path.join(this.folderAbs, 'dist', this.deckRelativeFilePath)
            const ext = path.extname(distPathWrongExt)
            const distPathJS = distPathWrongExt.slice(0, -ext.length) + '.js'

            this.codeJS = readFileSync(distPathJS, 'utf-8')

            // 2. extract tools
            return { type: 'SUCCESS', script: this.UPSERT_SCRIPT(this.codeJS) }
        } catch (e) {
            console.error(`[🔴] failed to load ${this.relPath}`, e)
            return this.addError('transpile error in load_asCushyStudioAction', e)
        }
    }
    /** the persistent esbuild context, used to allow for fast rebundling */
    get _esbuildContext() {
        // ensure typescript files
        if (!this.relPath.endsWith('.ts') && !this.relPath.endsWith('.tsx'))
            throw new Error('esbuild can only work on .ts or .tsx files')
        // create context
        const context = createEsbuildContextFor({
            entrypoints: [this.absPath],
            root: this.folderAbs,
        })
        // cache it
        Object.defineProperty(this, '_esbuildContext', {
            value: context,
        })
        return context
    }

    // PROMPT
    private load_asComfyUIPromptJSON = async (): Promise<LoadStatus> => {
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
            this.promptJSON = comfyPromptJSON
            return { type: 'SUCCESS', script: this.UPSERT_SCRIPT(this.codeJS) }
            // ⏸️ const graph = this.st.db.graphs.create({ comfyPromptJSON: comfyPromptJSON })
            // ⏸️ const workflow = await graph.json_workflow()
            // ⏸️ this.liteGraphJSON = workflow
            // ⏸️ return LoadStatus.SUCCESS
            // 🦊 const codeJSAuto = this.st.importer.convertPromptToCode(json, { title, author, preserveId: true, autoUI: true })
            // 🦊 const codeTSAuto = codeJS
            // 🦊 const toolsAuto =  this.RUN_ACTION_FILE({ codeJS: codeJSAuto })
            // 🦊 this.asAutoAction = __OK({ codeJS: codeJSAuto, codeTS: codeTSAuto, tools: toolsAuto }) // 🟢 AUTOACTION
        } catch (error) {
            return this.addError(`❌ [load_asComfyUIPrompt] crash`, error)
        }
    }

    // WOKRFLOW
    private load_asComfyUIWorkflowJSON = (): Promise<LoadStatus> => {
        const workflowStr = readFileSync(this.absPath, 'utf-8')
        return this.importWorkflowFromStr(workflowStr)
    }

    private load_asComfyUIGeneratedPng = async (): Promise<LoadStatus> => {
        console.log('🟢 found ', this.absPath)
        this.png = this.absPath

        // extract metadata
        const result = getPngMetadataFromUint8Array(readFileSync(this.absPath))
        if (result == null) return this.addError(`❌ [load_asComfyUIGeneratedPng] no metadata in png`, null)
        if (!result.success) return this.addError(`❌ [load_asComfyUIGeneratedPng] metadata extraction failed`, result.value)
        const metadata = result.value
        const workflowStr: string = (metadata as { [key: string]: any }).workflow
        // const promptStr: string = (metadata as { [key: string]: any }).prompt

        if (workflowStr == null) return this.addError(`❌ [load_asComfyUIGeneratedPng] no workflow in metadata`, metadata)
        const res = await this.importWorkflowFromStr(workflowStr, { illustration: this.relPath })
        return res
    }

    // LOADERS ------------------------------------------------------------------------
    private importWorkflowFromStr = async (workflowStr: string, metadata: AppMetadata = {}): Promise<LoadStatus> => {
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
            console.error(error)
            return this.addError(`❌ failed to import workflow: cannot convert LiteGraph To Prompt`, error)
        }
        // at this point, we know the workflow is valid
        // and we have both the prompt, and the workflow
        this.liteGraphJSON = workflowJSON
        this.promptJSON = promptJSON

        // 3. asAction
        try {
            this.codeJS = this.st.importer.convertPromptToCode(promptJSON, {
                // metadat
                illustration: metadata.illustration,
                author: metadata.author,
                title: metadata.name ?? path.basename(this.absPath),
                // codegen
                preserveId: true,
                autoUI: true,
            })
            // this.codeTS = this.codeJS
            return { type: 'SUCCESS', script: this.UPSERT_SCRIPT(this.codeJS) }
        } catch (error) {
            return this.addError(`❌ failed to import workflow: cannot convert LiteGraph To Prompt`, error)
        }
    }

    UPSERT_SCRIPT = (codeJS: string): CushyScriptL => {
        console.groupCollapsed(`[👙] script extracted for ${this.relPath}`)
        console.log(codeJS)
        console.groupEnd()
        const script = this.st.db.cushy_scripts.upsert({
            id: asCushyScriptID(this.relPath),
            code: codeJS,
            path: this.relPath,
        })
        return script
    }
}

// get displayName(): string {
//     return this.manifest.name ?? basename(this.relPath)
// }

// get priority(): number {
//     return this.manifest.priority ?? 0
// }

// get description(): string {
//     return this.manifest.description ?? 'no description'
// }

/** meh */
// get deckManifestType(): 'no manifest' | 'invalid manifest' | 'crash' | 'valid' {
//     return this.pkg.manifestError?.type ?? ('valid' as const)
// }

// get manifest(): AppManifest {
//     return this.appCompiled?.metadata ?? this.defaultManifest
// }

// get authorDefinedManifest(): Maybe<AppManifest> {
//     const cards = this.deck.manifest.cards ?? []
//     const match = cards.find((c) => {
//         const absPath = path.join(this.deck.folderAbs, c.deckRelativeFilePath)
//         if (absPath === this.absPath) return true
//     })
//     return match
// }

// drafts= new LiveCollection<DraftL>
// get drafts(): DraftL[] {
//     const draftTable = this.st.db.drafts
//     const draftTableInfos = draftTable.infos
//     const draftsT = this.st.db.prepareAll<RelativePath, DraftT>(
//         draftTableInfos,
//         'efrom draft where appPath=?',
//     )(this.relPath)
//     return draftsT.map((t) => draftTable.getOrCreateInstanceForExistingData(t))
// }

// getCompiledApps(): CompiledApp[] {
//     this.load()
//     return this.appCompiled!
// }

// getFirstCompiledApp(): Maybe<CompiledApp> {
//     this.load()
//     return this.appCompiled?.[0]
// }

// appCompiled?: CompiledApp[] = []
