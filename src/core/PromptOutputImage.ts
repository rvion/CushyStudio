import type { ComfyImageInfo } from './ComfyAPI'
import type { Maybe } from './ComfyUtils'
import type { PromptExecution } from '../controls/ScriptStep_prompt'
import type { Workspace } from './Workspace'

import fetch from 'node-fetch'
import * as path from 'path'
import { nanoid } from 'nanoid'
import { asRelativePath, RelativePath } from '../fs/pathUtils'

/** Cushy wrapper around ComfyImageInfo */
export class GeneratedImage {
    workspace: Workspace

    constructor(
        /** the prompt this file has been generated from */
        public prompt: PromptExecution,
        /** image info as returned by Comfy */
        public data: ComfyImageInfo,
    ) {
        this.workspace = prompt.workspace
        this.saveOnDisk()
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

    get folder(): RelativePath {
        return this.prompt.run.workspaceRelativeCacheFolderPath
    }

    get fileName(): string {
        return this.prompt.uid + '_' + this.uid + '.png'
    }

    get filePath(): RelativePath {
        return asRelativePath(this.folder + path.sep + this.fileName)
    }

    /** @internal */
    saveOnDisk = async () => {
        if (this.saved) return
        const response = await fetch(this.comfyURL, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            // responseType: ResponseType.Binary,
        })
        const binArr = await response.buffer()
        // const binArr = new Uint16Array(numArr)

        // 🔴
        this.workspace.writeBinaryFile(this.filePath, binArr)
        this.saved = true
    }

    /** this is such a bad workaround but 🤷‍♂️ */
    uploadAsNamedInput = async (): Promise<string> => {
        const res = await this.workspace.uploadURL(this.comfyURL)
        console.log(`[makeAvailableAsInput]`, res)
        this.inputPath = res.name
        return res.name
    }
}
