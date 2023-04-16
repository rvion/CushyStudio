import * as vscode from 'vscode'
import type { ComfyImageInfo } from '../core-types/ComfyWsPayloads'
import type { Maybe } from '../utils/types'
import type { PromptExecution } from '../controls/ScriptStep_prompt'
import type { Workspace } from './Workspace'

import fetch from 'node-fetch'
import * as path from 'path'
import { nanoid } from 'nanoid'
import { asRelativePath } from '../fs/pathUtils'
import { RelativePath } from '../fs/BrandedPaths'
import { loggerExt } from '../logger/LoggerBack'
import { IGeneratedImage } from '../sdk/IFlowExecution'
import { FrontWebview } from './FrontWebview'

/** Cushy wrapper around ComfyImageInfo */
export class GeneratedImage implements IGeneratedImage {
    private workspace: Workspace

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

    /** unique image id */
    uid: string = nanoid()

    // high level API ----------------------------------------------------------------------
    /** run an imagemagick convert action */
    imagemagicConvert = (partialCmd: string, suffix: string): string => {
        const pathA = this.localRelativeFilePath
        const pathB = `${pathA}.${suffix}.png`
        const cmd = `convert "${pathA}" ${partialCmd} "${pathB}"`
        this.prompt.run.exec(cmd)
        return pathB
    }

    // COMFY RELATIVE ----------------------------------------------------------------------
    /** file name within the ComfyUI folder */
    get comfyFilename() { return this.data.filename } // prettier-ignore

    /** relative path on the comfy URL */
    get comfyRelativePath(): string { return `./outputs/${this.data.filename}` } // prettier-ignore

    /** url to acces the image */
    get comfyURL():string { return this.workspace.serverHostHTTP + '/view?' + new URLSearchParams(this.data).toString() } // prettier-ignore

    /** path within the input folder */
    comfyInputPath?: Maybe<string> = null

    // CUSHY RELATIVE ----------------------------------------------------------------------
    /** folder in which the image should be saved */
    get localFolder(): RelativePath { return this.prompt.run.workspaceRelativeCacheFolderPath } // prettier-ignore

    /** local workspace file name, without extension */
    get localFileNameNoExt(): string { return this.prompt.uid + '_' + this.uid } // prettier-ignore

    /** local workspace file name, WITH extension */
    get localFileName(): string { return this.localFileNameNoExt + '.png' } // prettier-ignore

    /** local workspace relative file path */
    get localRelativeFilePath(): RelativePath { return asRelativePath(this.localFolder + path.sep + this.localFileName) } // prettier-ignore

    get localUri(): vscode.Uri { return this.workspace.resolve(this.localRelativeFilePath) } // prettier-ignore

    /** uri the webview can access */
    get webviewURI(): string {
        return FrontWebview.current?.webview.asWebviewUri(this.localUri).toString() ?? ''
    }
    // MISC ----------------------------------------------------------------------
    /** true if file exists on disk; false otherwise */
    saved = false
    savedPromise: Promise<true>

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

        this.workspace.writeBinaryFile(this.localRelativeFilePath, binArr)
        loggerExt.info('🌠', '🖼️ image saved')
        this.saved = true
        return true
    }

    /** this is such a bad workaround but 🤷‍♂️ */
    uploadAsNamedInput = async (): Promise<string> => {
        const res = await this.prompt.run.uploadURL(this.comfyURL)
        console.log(`[makeAvailableAsInput]`, res)
        this.comfyInputPath = res.name
        return res.name
    }
}
