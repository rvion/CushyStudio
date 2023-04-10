import * as vscode from 'vscode'
import type { ComfyImageInfo } from '../core-types/ComfyWsPayloads'
import type { Maybe } from '../utils/types'
import type { PromptExecution } from '../controls/ScriptStep_prompt'
import type { Workspace } from './Workspace'

import fetch from 'node-fetch'
import * as path from 'path'
import { nanoid } from 'nanoid'
import { asRelativePath, RelativePath } from '../fs/pathUtils'
import { loggerExt } from '../logger/LoggerBack'

/** Cushy wrapper around ComfyImageInfo */
export class GeneratedImage {
    workspace: Workspace

    convertToImageInput = (): string => {
        return `../outputs/${this.data.filename}`
        // return this.LoadImage({ image: name })
    }

    constructor(
        /** the prompt this file has been generated from */
        public prompt: PromptExecution,
        /** image info as returned by Comfy */
        public data: ComfyImageInfo,
    ) {
        this.workspace = prompt.workspace
        this.savedPromise = this.downloadImageAndSaveToDisk()
    }

    /** url to acces the image */
    get comfyURL() {
        return this.workspace.serverHostHTTP + '/view?' + new URLSearchParams(this.data).toString()
    }

    /** unique image id */
    uid = nanoid()

    /** path within the input folder */
    inputPath?: Maybe<string> = null

    /** true if file exists on disk; false otherwise */
    saved = false
    savedPromise: Promise<true>

    /** @internal folder in which the image should be saved */
    private get folder(): RelativePath {
        return this.prompt.run.workspaceRelativeCacheFolderPath
    }

    /** @internal */
    private get fileName(): string {
        return this.prompt.uid + '_' + this.uid + '.png'
    }

    /** @internal */
    get filePath(): RelativePath {
        return asRelativePath(this.folder + path.sep + this.fileName)
    }

    /** @internal */
    get uri(): vscode.Uri {
        return this.workspace.resolve(this.filePath)
    }

    // downloadImageAndSaveToDisk = () => {
    //     return new Promise((resolve, rejects) => {
    //         this._downloadImageAndSaveToDisk() //
    //             .then(resolve)
    //             .catch(rejects)
    //     })
    // }

    /** @internal */
    downloadImageAndSaveToDisk = async (): Promise<true> => {
        if (this.saved) return true

        const response = await fetch(this.comfyURL, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            // responseType: ResponseType.Binary,
        })
        const binArr = await response.buffer()
        // const binArr = new Uint16Array(numArr)

        this.workspace.writeBinaryFile(this.filePath, binArr)
        loggerExt.info('🌠', '🖼️ image saved')
        this.saved = true
        return true
    }

    /** this is such a bad workaround but 🤷‍♂️ */
    uploadAsNamedInput = async (): Promise<string> => {
        const res = await this.workspace.uploadURL(this.comfyURL)
        console.log(`[makeAvailableAsInput]`, res)
        this.inputPath = res.name
        return res.name
    }
}
