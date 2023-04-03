import type { Cushy } from '../cushy/Cushy'
import type { ImportCandidate } from '../importers/ImportCandidate'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'
import type { Run } from './Run'
import type { ScriptStep } from './ScriptStep'

import * as fs from '@tauri-apps/api/fs'
import { Body, fetch, ResponseType } from '@tauri-apps/api/http'
import * as path from '@tauri-apps/api/path'
import { RootFolder } from '../fs/RootFolder'

import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'
import { JsonFile } from '../monaco/JsonFile'
import { Template } from '../templates/Template'
import { CushyLayoutState } from '../layout/LayoutState'
import { logger } from '../logger/Logger'
import { TypescriptFile } from '../monaco/TypescriptFile'
import { sdkTemplate } from '../sdk/sdkTemplate'
import { AbsolutePath, asMonacoPath, asRelativePath, pathe, RelativePath } from '../fs/pathUtils'
import { ResilientWebSocketClient } from '../ws/ResilientWebsocket'
import { ComfyStatus, ComfyUploadImageResult, WsMsg } from './ComfyAPI'
import { ComfyPromptJSON } from './ComfyPrompt'
import { ComfySchema } from './ComfySchema'
import { defaultScript } from '../templates/defaultProjectCode'
import { Project } from './Project'
import { ScriptStep_prompt } from './ScriptStep_prompt'
import { demoLibrary } from '../templates/Library'

export type WorkspaceConfigJSON = {
    version: 2
    comfyWSURL: string
    comfyHTTPURL: string
    lastProjectFolder?: string
}

export type CSCriticalError = { title: string; help: string }

/**
 * global State
 *  - manages connection to the backend
 *  - manages list of known / open projects
 *  - dispatches messages to the right projects
 */
export class Workspace {
    schema: ComfySchema
    focusedFile: Maybe<TypescriptFile> = null
    focusedProject: Maybe<Project> = null

    // private loadDemos = async (): Promise<Demo[]> => {
    //     console.log('🦊', { WORKFLOW: WORKFLOW.toString() })
    //     return [
    //         // lazy load
    //         new Demo(this, 'demo1-basic', `

    //         `),
    //         new Demo(this, 'demo2-test', await import('../examples/demo2-test').then((m) => m.default)),
    //     ]
    // }

    demos: Template[] = demoLibrary

    projects: Project[] = []
    assets = new Map<string, boolean>()
    layout = new CushyLayoutState(this)

    // main files
    workspaceConfigFile: JsonFile<WorkspaceConfigJSON>
    objectInfoFile: JsonFile<ComfySchemaJSON>
    cushySDKFile: TypescriptFile
    comfySDKFile: TypescriptFile

    // import management
    importQueue: ImportCandidate[] = []
    removeCandidate = (candidate: ImportCandidate) => {
        const index = this.importQueue.indexOf(candidate)
        this.importQueue.splice(index, 1)
    }

    openComfySDK = () => {
        this.focusedFile = this.comfySDKFile
        // this.layout.openEditorTab(this.ComfySDKBuff)
    }

    openCushySDK = () => {
        this.focusedFile = this.cushySDKFile
        // this.layout.openEditorTab(this.CushySDKBuff)
    }

    static OPEN = async (cushy: Cushy, absoluteFolderPath: AbsolutePath): Promise<Workspace> => {
        const workspace = new Workspace(cushy, absoluteFolderPath)
        await workspace.objectInfoFile.finished
        await workspace.workspaceConfigFile.finished
        void workspace.init()
        return workspace
    }

    /** relative workspace folder where CushyStudio should store every artifacts and runtime files */
    get relativeCacheFolderPath(): RelativePath {
        return asRelativePath('cache')
    }

    rootFolder: RootFolder
    private constructor(
        //
        public cushy: Cushy,
        public absoluteWorkspaceFolderPath: AbsolutePath,
    ) {
        this.schema = new ComfySchema({})
        this.rootFolder = new RootFolder(absoluteWorkspaceFolderPath)
        this.cushySDKFile = new TypescriptFile(this.rootFolder, {
            title: 'Cushy SDK',
            relativeTSFilePath: asRelativePath('cushy.d.ts.backup'),
            virtualPathTS: asMonacoPath(`file:///cushy.d.ts`),
            codeOverwrite: sdkTemplate,
        })

        this.comfySDKFile = new TypescriptFile(this.rootFolder, {
            title: 'Comfy SDK',
            relativeTSFilePath: asRelativePath('comfy.d.ts.backup'),
            virtualPathTS: asMonacoPath(`file:///comfy.d.ts`),
            defaultCodeWhenNoFile: null,
        })

        this.objectInfoFile = new JsonFile<ComfySchemaJSON>(this.rootFolder, {
            // folder: Promise.resolve(this.absoluteWorkspaceFolderPath),
            title: 'object_info.json',
            relativePath: asRelativePath('object_info.json'),
            init: () => ({}),
            maxLevel: 3,
        })

        this.workspaceConfigFile = new JsonFile<WorkspaceConfigJSON>(this.rootFolder, {
            // folder: Promise.resolve(this.absoluteWorkspaceFolderPath),
            title: 'workspace.json',
            relativePath: asRelativePath('workspace.json'),
            init: () => ({
                version: 2,
                comfyWSURL: 'ws://127.0.0.1:8188/ws',
                comfyHTTPURL: 'http://127.0.0.1:8188',
            }),
        })
        makeAutoObservable(this)
    }

    /** will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server */
    ws!: ResilientWebSocketClient

    async init() {
        this.ws = new ResilientWebSocketClient({
            url: () => this.workspaceConfigFile.value.comfyWSURL,
            onMessage: this.onMessage,
        })
        await this.loadProjects()
        await this.updateComfy_object_info()
        // this.editor.openCODE()
    }

    sid = 'temp'

    onMessage = (e: MessageEvent /* WS.MessageEvent*/) => {
        const msg: WsMsg = JSON.parse(e.data as any)
        if (msg.type === 'status') {
            if (msg.data.sid) this.sid = msg.data.sid
            this.status = msg.data.status
            return
        }

        // ensure current project is running
        const project: Maybe<Project> = this.focusedProject
        if (project == null) return console.log(`❌ received ${msg.type} but project is null`)

        const currentRun: Run | null = project.currentRun
        if (currentRun == null) return console.log(`❌ received ${msg.type} but currentRun is null`)

        // ensure current step is a prompt
        const promptStep: ScriptStep = currentRun.step
        if (!(promptStep instanceof ScriptStep_prompt))
            return console.log(`❌ received ${msg.type} but currentStep is not prompt`)

        // defer accumulation to ScriptStep_prompt
        if (msg.type === 'progress') {
            logger.debug('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep.onProgress(msg)
        }
        if (msg.type === 'executing') {
            logger.debug('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep.onExecuting(msg)
        }

        if (msg.type === 'executed') {
            logger.info('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep.onExecuted(msg)
        }

        // unknown message payload ?
        console.log('❌', 'Unknown message:', msg)
        throw new Error('Unknown message type: ' + msg)
    }

    private RANDOM_IMAGE_URL = 'http://192.168.1.20:8188/view?filename=ComfyUI_01619_.png&subfolder=&type=output'

    /** attempt to convert an url to a Blob */
    private getUrlAsBlob = async (url: string = this.RANDOM_IMAGE_URL) => {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            responseType: ResponseType.Binary,
        })
        const numArr: number[] = response.data as any
        const binArr = new Uint8Array(numArr)
        return binArr
        // return new Blob([binArr], { type: 'image/png' })
    }

    uploadURL = async (url: string = this.RANDOM_IMAGE_URL): Promise<ComfyUploadImageResult> => {
        const blob = await this.getUrlAsBlob(url)
        return this.uploadUIntArrToComfy(blob)
    }

    createProjectAndFocustIt = (
        //
        workspaceRelativeFilePath: RelativePath,
        script: string = defaultScript,
    ) => {
        const project = new Project(this, workspaceRelativeFilePath, script)
        this.projects.push(project)
        project.focus()
    }

    // /** 📝 should be the SINGLE function able to save text files in a workspace */
    // readTextFile = async (workspaceRelativePath: RelativePath): Promise<Maybe<string>> => {
    //     const absoluteFilePath = await path.join(this.absoluteWorkspaceFolderPath, workspaceRelativePath)
    //     const exists = await fs.exists(absoluteFilePath)
    //     if (exists) return await fs.readTextFile(absoluteFilePath)
    //     return null
    // }

    // /** 📝 should be the SINGLE function able to save text files in a workspace */
    // writeTextFile = async (workspaceRelativePath: RelativePath, contents: string): Promise<void> => {
    //     // 1. resolve absolute path
    //     const absoluteFilePath = await path.join(this.absoluteWorkspaceFolderPath, workspaceRelativePath)
    //     // 2. create folder if missing
    //     const folder = await path.dirname(absoluteFilePath)
    //     const folderExists = await fs.exists(folder)
    //     if (!folderExists) await fs.createDir(folder, { recursive: true })
    //     // 3. check previous file content
    //     const prevExists = await fs.exists(absoluteFilePath)
    //     const prev = prevExists ? await fs.readTextFile(absoluteFilePath) : null
    //     // 4. save if necessary
    //     if (prev != contents) await fs.writeTextFile({ path: absoluteFilePath, contents })
    // }

    // /** 📝 should be the SINGLE function able to save binary files in a workspace */
    // writeBinaryFile = async (workspaceRelativePath: RelativePath, contents: fs.BinaryFileContents) => {
    //     // 1. resolve absolute path
    //     const absoluteFilePath = await path.join(this.absoluteWorkspaceFolderPath, workspaceRelativePath)
    //     // console.log('>>> 🔴y', absoluteFilePath)
    //     // 2. create folder if missing
    //     const folder = await path.dirname(absoluteFilePath)
    //     const folderExists = await fs.exists(folder)
    //     if (!folderExists) await fs.createDir(folder, { recursive: true })
    //     // 3. update file (NO check to see if previous file similar)
    //     await fs.writeBinaryFile({ path: absoluteFilePath, contents })
    // }

    /** resolve any path to a relative workspace path
     * CRASH if path is outside of workspace folder or invalid */
    resolveToRelativePath = (rawPath: string): RelativePath => {
        const isAbsolute = pathe.isAbsolute(rawPath)
        // console.log('🚀 ~ file: Workspace.tsx:218 ~ Workspace ~ isAbsolute:', isAbsolute)
        const parsed = pathe.parse(rawPath)
        const relativePath = isAbsolute //
            ? pathe.relative(this.absoluteWorkspaceFolderPath, rawPath)
            : pathe.relative(this.absoluteWorkspaceFolderPath, pathe.resolve(this.absoluteWorkspaceFolderPath, rawPath))

        // ENFORCE WORKSPACE ISOLATION
        if (relativePath.startsWith('..')) {
            console.log(
                JSON.stringify(
                    {
                        parsed,
                        rawPath,
                        workspaceFolder: this.absoluteWorkspaceFolderPath,
                        relativePath,
                    },
                    null,
                    3,
                ),
            )
            throw new Error("🔴BB invalid path; can't create path outside of workspace folder")
        }
        return relativePath as RelativePath
    }

    /** load all project found in workspace */
    loadProjects = async () => {
        console.log(`[🔍] loading projects...`)
        const items = await fs.readDir(this.absoluteWorkspaceFolderPath, { recursive: true })
        for (const item of items) {
            if (item.children) continue // skip folders
            if (item.name == null) continue // skip invalid files
            if (!item.name.endsWith('.ts')) continue // skip non ts files
            const content = await fs.readTextFile(this.absoluteWorkspaceFolderPath + path.sep + item.name)
            const relPath = this.resolveToRelativePath(item.path)
            this.projects.push(new Project(this, relPath, content))
        }
        //     if (!item.children) {
        //         console.log(`[🔍] - ${item.name} is not a folder`)
        //         continue
        //     }
        //     const script = item.children.find((f) => f.name === 'script.ts')
        //     if (script == null) {
        //         console.log(
        //             `[🔍] - ${item.name} has no script.ts file ${item.children.length} ${item.children.map((f) => f.name)}`,
        //         )
        //         continue
        //     }
        //     const folderName = item.name
        //     if (folderName == null) {
        //         console.log(`[🔍] - ${item.name} has an invalid name (e.g. ends with a dot)`)
        //         continue
        //     }
        //     console.log(`[🔍] found project ${folderName}!`)
        //     this.projects.push(new Project(this, folderName))
        // }
    }

    /** save an image at given url to disk */
    saveImgToDisk = async (
        url: string = 'http://192.168.1.20:8188/view?filename=ComfyUI_01619_.png&subfolder=&type=output',
    ): Promise<'ok'> => {
        console.log('done')
        const response = await fetch(url, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            responseType: ResponseType.Binary,
        })
        const numArr: number[] = response.data as any
        const binArr = new Uint16Array(numArr)
        await fs.writeBinaryFile('CushyStudio/images/test.png', binArr, { dir: fs.Dir.Document })
        return 'ok'
    }

    /** upload an image present on disk to ComfyServer */
    uploadImgFromDisk = async (path: string): Promise<ComfyUploadImageResult> => {
        const ui8arr = await fs.readBinaryFile(path)
        return this.uploadUIntArrToComfy(ui8arr)
    }

    // lastUpload: Maybe<string> = null
    /** upload an Uint8Array buffer as png to ComfyServer */
    uploadUIntArrToComfy = async (ui8arr: Uint8Array): Promise<ComfyUploadImageResult> => {
        const uploadURL = this.serverHostHTTP + '/upload/image'
        const resp = await fetch(uploadURL, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: Body.form({
                image: {
                    file: ui8arr,
                    mime: 'image/png',
                    fileName: 'upload.png',
                },
            }),
        })
        const result = resp.data as ComfyUploadImageResult
        console.log({ 'resp.data': result })
        // this.lastUpload = new CushyImage(this, { filename: result.name, subfolder: '', type: 'output' }).url
        return result
    }

    get serverHostHTTP() { return this.workspaceConfigFile.value.comfyHTTPURL } // prettier-ignore

    fetchPrompHistory = async () => {
        const res = await fetch(`${this.serverHostHTTP}/history`, { method: 'GET' })
        console.log(res.data)
        const x = res.data
        return x
    }

    CRITICAL_ERROR: Maybe<CSCriticalError> = null

    /** retri e the comfy spec from the schema*/
    updateComfy_object_info = async (): Promise<ComfySchemaJSON> => {
        // 1. fetch schema$
        const url = `${this.serverHostHTTP}/object_info`

        let schema$: ComfySchemaJSON
        try {
            const res = await fetch(url, { method: 'GET', timeout: { secs: 3, nanos: 0 } })
            console.log('[🤖]', res.data)
            schema$ = res.data as any
        } catch (error) {
            console.log('🔴', error)
            logger.error('🦊', 'Failed to fetch ObjectInfos from Comfy.')
            schema$ = {}
        }
        this.objectInfoFile.update(schema$)
        this.schema.update(schema$)
        const comfySdkCode = this.schema.codegenDTS()
        this.comfySDKFile.updateFromCodegen(comfySdkCode)
        this.comfySDKFile.syncWithDiskFile()

        return schema$
    }

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    status: ComfyStatus | null = null

    notify = (msg: string) => void toast(msg)

    addProjectFromComfyWorkflowJSON = async (title: string, comfyPromptJSON: ComfyPromptJSON) => {
        const project = Project.FROM_JSON(this, title, comfyPromptJSON)
        this.projects.push(project)
        this.focusedProject = project
        this.focusedFile = project.scriptBuffer
    }
}
