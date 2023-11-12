import type { Action, WidgetDict } from 'src/cards/Card'
import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { STATE } from 'src/state/state'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'

import { readFileSync } from 'fs'
import { makeAutoObservable, observable } from 'mobx'
import path, { relative } from 'pathe'
import { generateName } from 'src/widgets/drafts/generateName'
import { Deck } from 'src/cards/Deck'
import { CardPath } from 'src/cards/CardPath'
import { DraftL } from 'src/models/Draft'
import { transpileCode } from '../back/transpiler'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'
import { getPngMetadataFromUint8Array } from '../importers/getPngMetadata'
import { exhaust } from '../utils/misc/ComfyUtils'
import { ManualPromise } from '../utils/misc/ManualPromise'
import { Library } from './Library'
import { CardManifest } from './DeckManifest'
import { join } from 'pathe'
import { CardStyle } from './fancycard/FancyCard'
import { generateAvatar } from './AvatarGenerator'
import { clamp } from 'three/src/math/MathUtils'

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

export class CardFile {
    st: STATE

    /** card display name */
    get displayName(): string { return this.manifest.name } // prettier-ignore
    get actionPackFolderRel(): string { return this.deck.folderRel } // prettier-ignore
    get actionAuthorFolderRel(): string { return this.deck.authorFolderRel } // prettier-ignore
    get priority(): number { return this.manifest.priority ?? 0 } // prettier-ignore
    get description(): string { return this.manifest.description ?? 'no description' } // prettier-ignore
    get style(): CardStyle { return this.manifest.style ?? 'A' } // prettier-ignore

    openLastDraftAsCurrent = () => {
        this.st.currentDraft = this.getLastDraft()
    }

    /** true if card match current library search */
    matchesSearch = (search: string): boolean => {
        if (search === '') return true
        const searchLower = search.toLowerCase()
        const nameLower = this.displayName.toLowerCase()
        const descriptionLower = this.description.toLowerCase()
        return nameLower.includes(searchLower) || descriptionLower.includes(searchLower)
    }

    constructor(
        //
        public library: Library,
        public deck: Deck,
        public absPath: AbsolutePath,
        public relPath: CardPath,
    ) {
        this.st = library.st
        this.defaultManifest = this.mkDefaultManifest()
        makeAutoObservable(this, { action: observable.ref })
    }

    // --------------------------------------------------------
    // prettier-ignore
    get score(): number {
        let score = 0
        // hardcoded rules
        if (this.relPath==='library/CushyStudio/default/prompt.ts') score+=1000
        // malus
        if (this.deckManifestType === 'crash')            score -= 60
        if (this.deckManifestType === 'invalid manifest') score -= 50
        if (this.deckManifestType === 'no manifest')      score -= 40
        // positives
        if (this.manifest.priority)                       score += clamp(this.manifest.priority, -100, 100)
        if (this.authorDefinedManifest)                   score += 50
        if (this.manifest.illustration?.endsWith('.png')) score += 100
        return score
    }

    /** meh */
    get deckManifestType(): 'no manifest' | 'invalid manifest' | 'crash' | 'valid' {
        return this.deck.manifestError?.type ?? ('valid' as const)
    }

    get manifest(): CardManifest {
        return (
            this.authorDefinedManifest ?? //
            this.defaultManifest
        )
    }

    private get authorDefinedManifest(): Maybe<CardManifest> {
        const cards = this.deck.manifest.cards ?? []
        const match = cards.find((c) => {
            const absPath = path.join(this.deck.folderAbs, c.deckRelativeFilePath)
            if (absPath === this.absPath) return true
        })
        return match
    }

    private defaultManifest: CardManifest
    private mkDefaultManifest(): CardManifest {
        const deckRelPath = this.deckRelativeFilePath
        const baseName = path.basename(deckRelPath)
        return {
            name: baseName.endsWith('.ts') //
                ? baseName.slice(0, -3)
                : baseName,
            deckRelativeFilePath: this.relPath,
            author: 'unknown', // this.deck.githubUserName,
            illustration: deckRelPath.endsWith('.png') //
                ? deckRelPath
                : generateAvatar(deckRelPath),
            description: '<no manifest>',
        }
    }

    private get deckRelativeFilePath(): string {
        return relative(this.deck.folderAbs, this.absPath)
    }
    // --------------------------------------------------------
    // status
    loaded = new ManualPromise<true>()
    errors: { title: string; details: any }[] = []
    addError = (title: string, details: any = null): LoadStatus => {
        this.errors.push({ title, details })
        return LoadStatus.FAILURE
    }

    get name() {
        return this.manifest.name
    }

    /** action display name */
    get illustrationPath_eiter_RelativeToDeckRoot_or_Base64Encoded(): Maybe<string> {
        return this.manifest.illustration
    }

    get illustrationPathWithFileProtocol() {
        const tmp = this.illustrationPath_eiter_RelativeToDeckRoot_or_Base64Encoded
        if (tmp?.startsWith('data:')) return tmp
        if (tmp) return `file://${join(this.deck.folderAbs, tmp)}`
        // default illustration if none is provided
        return `file://${join(this.st.rootPath, 'library/CushyStudio/default/_illustrations/default-card-illustration.jpg')}`
    }

    get isFavorite(): boolean {
        return this.st.configFile.value.favoriteCards?.includes(this.relPath) ?? false
    }

    setFavorite = (fav: boolean) => {
        const favArray = this.st.configFile.value.favoriteCards ?? []
        if (fav) {
            if (!favArray.includes(this.relPath)) favArray.push(this.relPath)
        } else {
            const index = favArray.indexOf(this.relPath)
            if (index !== -1) favArray.splice(index, 1)
        }
        this.st.configFile.update({ favoriteCards: favArray })
    }

    createDraft = (): DraftL => {
        const title = generateName()
        const pj = this.st.getProject()
        const draft = this.st.db.drafts.create({
            actionParams: {},
            actionPath: this.relPath,
            graphID: pj.rootGraph.id,
            title: title,
        })
        pj.st.layout.addDraft({ draftID: draft.id })
        return draft
    }
    getLastDraft = (): DraftL => {
        const pj = this.st.getProject()
        const drafts = this.drafts
        return drafts.length > 0 ? drafts[0] : this.createDraft()
    }
    get drafts(): DraftL[] {
        return this.st.db.drafts //
            .filter((draft) => draft.data.actionPath === this.relPath)
    }

    getCompiledAction() {
        this.load()
        return this.action
    }
    // extracted stuff
    action?: Maybe<Action<WidgetDict>> = null
    codeJS?: Maybe<string> = null
    codeTS?: Maybe<string> = null
    liteGraphJSON?: Maybe<LiteGraphJSON> = null
    promptJSON?: Maybe<ComfyPromptJSON> = null
    png?: Maybe<AbsolutePath> = null
    loadRequested = false

    /** load a file trying all compatible strategies */
    load = async (p?: { force?: boolean }): Promise<true> => {
        if (this.loadRequested && !p?.force) return true
        this.loadRequested = true
        if (this.loaded.done && !p?.force) return true
        const strategies = this.findLoadStrategies()
        for (const strategy of strategies) {
            const res = await this.loadWithStrategy(strategy)
            if (res) break
        }
        // if (this.action) this.displayName = this.action.name
        // this.st.layout.renameTab(`/action/${this.relPath}`, this.displayName)
        this.loaded.resolve(true)
        if (this.drafts.length === 0) {
            this.createDraft()
        }
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
        if (!result.success) return this.addError(`❌ [load_asComfyUIGeneratedPng] metadata extraction failed`, result.value)
        const metadata = result.value
        const workflowStr = (metadata as { [key: string]: any }).workflow
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

    RUN_ACTION_FILE = (codeJS: string): Action<WidgetDict> | undefined => {
        // 1. DI registering mechanism
        const CARDS_FOUND_IN_FILE: Action<WidgetDict>[] = []

        const registerCardFn = (a1: string, a2: Action<any>): void => {
            const action = typeof a1 !== 'string' ? a1 : a2
            console.info(`[💙] found action: "${name}"`, { path: this.absPath })
            CARDS_FOUND_IN_FILE.push(action)
        }

        // 2. eval file to extract actions
        try {
            const ProjectScriptFn = new Function('action', 'card', codeJS)
            ProjectScriptFn(registerCardFn, registerCardFn)
            if (CARDS_FOUND_IN_FILE.length === 0) return
            if (CARDS_FOUND_IN_FILE.length > 1) this.addError(`❌4. more than one action found: (${CARDS_FOUND_IN_FILE.length})`)
            return CARDS_FOUND_IN_FILE[0]
        } catch (e) {
            this.addError('❌5. cannot convert prompt to code', e)
            return
        }
    }
}
