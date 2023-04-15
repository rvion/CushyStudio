import { makeAutoObservable } from 'mobx'
import type { Maybe } from '../utils/types'
import { Workspace } from '../core-back/Workspace'
import { pathe } from '../fs/pathUtils'
import { getPngMetadata, TextChunks } from './getPngMetadata'

/** wrapper around files dropped into comfy
 * responsibilities:
 * - possible import strategies detections
 * - centralize import-related logic
 * - track / follow import progress, and accumulate errors in observable props
 */
export class ImportCandidate {
    title: string
    path: string
    size: number
    type: string
    isPng: boolean
    isImg: boolean
    pngMetadata: Maybe<TextChunks> = null
    canBeImportedAsWorspaceAsset: boolean
    canBeImportedAsCushyScript: boolean = false
    canBeImportedAsComfyUIJSON: boolean = false
    constructor(
        //
        public workspace: Workspace,
        public file: File,
    ) {
        const baseName = pathe.basename(file.name)
        // title is baseName without suffix
        this.title = baseName.replace(/\.[^/.]+$/, '')

        this.path = file.name
        this.size = file.size
        this.type = file.type
        const nameLower = this.path.toLowerCase()
        this.isPng = nameLower.endsWith('.png')
        this.isImg = nameLower.endsWith('.png') || nameLower.endsWith('.jpg')

        this.canBeImportedAsWorspaceAsset = this.isPng
        if (this.isPng) {
            void getPngMetadata(file).then((textChunks) => {
                console.log('💎', this.path, textChunks)
                console.log('💎', 'prompt' in textChunks)
                this.pngMetadata = textChunks
                this.canBeImportedAsComfyUIJSON = 'prompt' in textChunks
                // this.canBeImportedAsCushyScript = 'prompt' in textChunks
            })
        }
        makeAutoObservable(this)
    }

    importAsScript = () => {
        const pngInfos = this.pngMetadata
        if (pngInfos == null) return console.log('❌ no png metadata')
        if (pngInfos.prompt == null) return console.log('❌ no png metadata "prompt"')
        const json = JSON.parse(pngInfos.prompt)
        console.log(json)
        this.workspace.addProjectFromComfyWorkflowJSON(this.title, json)
        this.workspace.removeCandidate(this)
    }

    // 🔴 TODO: implements
    importAsAsset = () => {
        console.log('not really implemented yet')
        this.workspace.removeCandidate(this)
    }
}
