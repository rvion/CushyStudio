import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { STATE } from 'src/state/state'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'

import { readFileSync } from 'fs'
import * as mobx from 'mobx'
import { makeAutoObservable, observable } from 'mobx'
import path, { basename, relative } from 'pathe'
import { DraftT } from 'src/db/TYPES.gen'
import { DraftL } from 'src/models/Draft'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'
import { exhaust } from '../utils/misc/ComfyUtils'
import { ManualPromise } from '../utils/misc/ManualPromise'
import { getPngMetadataFromUint8Array } from '../utils/png/_getPngMetadata'
import { Library } from './Library'

import { observer } from 'mobx-react-lite'
import __react from 'react'

import { dirname } from 'path'
import { createEsbuildContextFor } from 'src/back/transpiler'

// @ts-ignore
import { jsx, jsxs } from 'src/utils/custom-jsx/jsx-runtime'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { CompiledApp } from '../models/CushyApp'
import { LiveCollection } from 'src/db/LiveCollection'
import { CushyScriptL } from 'src/models/CushyScriptL'

// prettier-ignore
export type LoadStrategy =
    | 'asCushyStudioAction'
    | 'asComfyUIWorkflow'
    | 'asComfyUIPrompt'
    | 'asComfyUIGeneratedPng'
    | 'asA1111PngGenerated'

enum LoadStatus {
    SUCCESS = 1,
    FAILURE = 0,
}

/**
 * wrapper around files in the library folder
 * responsible to convert files to scripts
 */
export class LibraryFile {
    constructor(
        //
        public library: Library,
        // public pkg: Package,
        public absPath: AbsolutePath,
        public relPath: RelativePath,
    ) {
        this.st = library.st
        this.strategies = this.findLoadStrategies()
        makeAutoObservable(this)
        // { appCompiled: observable.ref }
    }

    /** access to the global app state */
    st: STATE

    /** abs path to the folder this file is in */
    get folderAbs(): AbsolutePath {
        console.log(`[👙] 🔴`, dirname(this.absPath))
        return asAbsolutePath(dirname(this.absPath))
    }

    /** shortcut to open the last draft of the first app defined in this file */
    // openLastDraftAsCurrent = () => {
    //     this.st.currentDraft = this.getLastDraft()
    // }

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
    loaded = new ManualPromise<true>()
    errors: { title: string; details: any }[] = []
    addError = (title: string, details: any = null): LoadStatus => {
        this.errors.push({ title, details })
        return LoadStatus.FAILURE
    }

    get isFavorite(): boolean {
        return this.st.configFile.value.favoriteApps?.includes(this.relPath) ?? false
    }

    setFavorite = (fav: boolean) => {
        const favArray = this.st.configFile.update((f) => {
            if (f.favoriteApps == null) f.favoriteApps = []
            const favs = f.favoriteApps
            if (fav) {
                if (!favs.includes(this.relPath)) favs.unshift(this.relPath)
            } else {
                const index = favs.indexOf(this.relPath)
                if (index !== -1) favs.splice(index, 1)
            }
        })
    }

    // getLastDraft = (): DraftL => {
    //     const drafts = this.drafts
    //     return drafts.length > 0 ? drafts[0] : this.createDraft()
    // }

    get drafts(): DraftL[] {
        const draftTable = this.st.db.drafts
        const draftTableInfos = draftTable.infos
        const draftsT = this.st.db.prepareAll<RelativePath, DraftT>(
            draftTableInfos,
            'select * from draft where appPath=?',
        )(this.relPath)
        return draftsT.map((t) => draftTable.getOrCreateInstanceForExistingData(t))
    }

    // getCompiledApps(): CompiledApp[] {
    //     this.load()
    //     return this.appCompiled!
    // }

    // getFirstCompiledApp(): Maybe<CompiledApp> {
    //     this.load()
    //     return this.appCompiled?.[0]
    // }

    // the first thing to do to load an app is to get the Cushy Script from it.
    codeJS?: Maybe<string> = null
    // appCompiled?: CompiledApp[] = []

    scripts = new LiveCollection<CushyScriptL>(
        () => ({ path: this.relPath }),
        () => this.st.db.cushy_scripts,
    )

    liteGraphJSON?: Maybe<LiteGraphJSON> = null
    promptJSON?: Maybe<ComfyPromptJSON> = null
    png?: Maybe<AbsolutePath> = null
    loadRequested = false

    /** load a file trying all compatible strategies */
    successfullLoadStrategies: Maybe<LoadStrategy> = null

    load = async (p?: { force?: boolean }): Promise<true> => {
        // don't load more than once unless manually requested
        if (this.loadRequested && !p?.force) return true
        this.loadRequested = true

        // don't load once already loaded
        if (this.loaded.done && !p?.force) return true

        // try every strategy in order
        for (const strategy of this.strategies) {
            const res = await this.loadWithStrategy(strategy)
            if (res === LoadStatus.SUCCESS) {
                this.successfullLoadStrategies = strategy
                break
            }
        }

        // // if one strategy worked, we're done
        // this.loaded.resolve(true)

        // // create a draft if none exists
        // if (this.drafts.length === 0) this.createDraft()

        // done
        return true
    }

    private loadWithStrategy = async (strategy: LoadStrategy): Promise<LoadStatus> => {
        if (strategy === 'asCushyStudioAction') return this.load_asCushyStudioAction()
        if (strategy === 'asComfyUIPrompt') return this.load_asComfyUIPrompt()
        if (strategy === 'asComfyUIWorkflow') return this.load_asComfyUIWorkflow()
        if (strategy === 'asComfyUIGeneratedPng') return this.load_asComfyUIGeneratedPng()
        if (strategy === 'asA1111PngGenerated') {
            if (this.png == null) this.png = this.absPath
            this.addError('❌ can not import file as Automaric1111 image', { reason: 'not supported yet' })
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

    // public syncS

    private load_asCushyStudioAction = async (): Promise<LoadStatus> => {
        try {
            // 1. transpile
            // await this.pkg.rebuild()
            // console.log('-- a', { eps: this.relPath })
            const ctx = await this.esbuildContext
            // console.log('-- b')
            const res = await ctx.rebuild()
            // console.log('-- c')

            const distPathWrongExt = path.join(this.folderAbs, 'dist', this.deckRelativeFilePath)
            const ext = path.extname(distPathWrongExt)
            const distPathJS = distPathWrongExt.slice(0, -ext.length) + '.js'

            this.codeJS = readFileSync(distPathJS, 'utf-8')

            // 2. extract tools
            this.appCompiled = this.EVALUATE_SCRIPT(this.codeJS)
            if (this.appCompiled == null) return this.addError('❌ [load_asCushyStudioAction] no actions found', null)
            return LoadStatus.SUCCESS
        } catch (e) {
            return this.addError('transpile error in load_asCushyStudioAction', e)
        }
    }
    /** the persistent esbuild context, used to allow for fast rebundling */
    private get esbuildContext() {
        // ensure typescript files
        if (!this.relPath.endsWith('.ts') && !this.relPath.endsWith('.tsx'))
            throw new Error('esbuild can only work on .ts or .tsx files')
        // create context
        const context = createEsbuildContextFor({
            entrypoints: [this.absPath],
            root: this.folderAbs,
        })
        // cache it
        Object.defineProperty(this, 'esbuildContext', {
            value: context,
        })
        return context
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
            this.promptJSON = comfyPromptJSON
            this.appCompiled = this.EVALUATE_SCRIPT(this.codeJS)
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
        if (!result.success) return this.addError(`❌ [load_asComfyUIGeneratedPng] metadata extraction failed`, result.value)
        const metadata = result.value
        const workflowStr: string = (metadata as { [key: string]: any }).workflow
        const promptStr: string = (metadata as { [key: string]: any }).prompt

        if (workflowStr == null) return this.addError(`❌ [load_asComfyUIGeneratedPng] no workflow in metadata`, metadata)
        const res = await this.importWorkflowFromStr(workflowStr)
        return res
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
            console.error(error)
            return this.addError(`❌ failed to import workflow: cannot convert LiteGraph To Prompt`, error)
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
            // this.codeTS = this.codeJS
            this.appCompiled = this.EVALUATE_SCRIPT(this.codeJS)
            return LoadStatus.SUCCESS
        } catch (error) {
            return this.addError(`❌ failed to import workflow: cannot convert LiteGraph To Prompt`, error)
        }
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
