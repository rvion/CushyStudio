import type { ComfyImageInfo } from './ComfyAPI'
import type { Maybe } from './ComfyUtils'
import type { ScriptStep_prompt } from './ScriptStep_prompt'
import type { Workspace } from './Workspace'

import { fetch, ResponseType } from '@tauri-apps/api/http'
import * as path from '@tauri-apps/api/path'
import { nanoid } from 'nanoid'
import { asRelativePath, WorkspaceRelativePath } from '../utils/pathUtils'

/** Cushy wrapper around ComfyImageInfo */
export class PromptOutputImage {
    workspace: Workspace

    constructor(
        /** the prompt this file has been generated from */
        public prompt: ScriptStep_prompt,
        /** image info as returned by Comfy */
        public data: ComfyImageInfo,
    ) {
        this.workspace = prompt.run.project.workspace
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

    get folder(): WorkspaceRelativePath {
        return this.prompt.run.workspaceRelativeCacheFolderPath
    }

    get fileName(): string {
        return this.prompt.uid + '_' + this.uid + '.png'
    }

    get filePath(): WorkspaceRelativePath {
        return asRelativePath(this.folder + path.sep + this.fileName)
    }

    saveOnDisk = async () => {
        if (this.saved) return
        const response = await fetch(this.comfyURL, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            responseType: ResponseType.Binary,
        })
        const numArr: number[] = response.data as any
        const binArr = new Uint16Array(numArr)
        await this.workspace.writeBinaryFile(this.filePath, binArr)
        this.saved = true
    }

    /** this is such a bad workaround but 🤷‍♂️ */
    makeAvailableAsInput = async (): Promise<string> => {
        const res = await this.workspace.uploadURL(this.comfyURL)
        console.log(`[makeAvailableAsInput]`, res)
        this.inputPath = res.name
        return res.name
    }
}
