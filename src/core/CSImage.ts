import type { ComfyImageInfo } from './ComfyAPI'
import type { Workspace } from './Workspace'
import type { Maybe } from './ComfyUtils'
import type { ScriptStep_prompt } from './ScriptStep_prompt'

import { fetch } from '@tauri-apps/api/http'
import * as path from '@tauri-apps/api/path'
import * as fs from '@tauri-apps/api/fs'
import { nanoid } from 'nanoid'
import { ResponseType } from '@tauri-apps/api/http'

/** Cushy wrapper around ComfyImageInfo */
export class CSImage {
    /** unique image id */
    uid = nanoid()

    /** path within the input folder */
    inputPath?: Maybe<string> = null

    saved = false

    get folder(){ return this.prompt.run.folderPath } // prettier-ignore
    get fileName() { return this.prompt.uid + '_' + this.uid + '.png' } // prettier-ignore
    get filePath () { return this.folder + path.sep + this.fileName } // prettier-ignore

    save = async () => {
        if (this.saved) return
        // ensure folder exists
        await fs.createDir(this.folder, { recursive: true })
        const response = await fetch(this.comfyURL, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            responseType: ResponseType.Binary,
        })
        const numArr: number[] = response.data as any
        const binArr = new Uint16Array(numArr)
        await fs.writeBinaryFile(this.filePath, binArr)
        console.log('[📁] saved', this.filePath)
        this.saved = true
    }

    /** this is such a bad workaround but 🤷‍♂️ */
    makeAvailableAsInput = async (): Promise<string> => {
        const res = await this.client.uploadURL(this.comfyURL)
        console.log(`[makeAvailableAsInput]`, res)
        this.inputPath = res.name
        return res.name
    }

    client: Workspace
    constructor(
        //
        public prompt: ScriptStep_prompt,
        public data: ComfyImageInfo,
    ) {
        this.client = prompt.run.script.workspace
        this.save()
    }

    /** url to acces the image */
    get comfyURL() {
        return this.client.serverHostHTTP + '/view?' + new URLSearchParams(this.data).toString()
    }
}
