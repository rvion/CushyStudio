import type { Maybe, Tagged } from 'src/utils/types'
import type { LiveInstance } from '../db/LiveInstance'
import type { FolderL, FolderUID } from './Folder'
import type { PromptID, PromptL } from './Prompt'

import { LiveRef } from '../db/LiveRef'

export type ImageID = Tagged<string, 'ImageUID'>
export interface ImageT {
    id: ImageID

    promptID: PromptID
    //
    comfyRelativePath?: string
    comfyURL?: string
    //
    localAbsolutePath?: string
    localURL?: string
    //
    star?: number
    folder?: FolderUID
}

export interface ImageL extends LiveInstance<ImageT, ImageL> {}
export class ImageL {
    get test1() {
        return 'a123'
    }

    prompt = new LiveRef<PromptL>(this, 'promptID', 'prompts')

    // turns this into some clean abstraction
    _resolve!: (value: this) => void
    _rejects!: (reason: any) => void
    finished: Promise<this> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    onUpdate = (prev: Maybe<ImageT>, next: ImageT) => {
        console.log('🟢 ImageL.onUpdate', prev, next)
        if (next.localAbsolutePath) return this._resolve(this)
    }

    test2 = () => 'b123'
    moveTo(folder: FolderL) {
        this.update({ folder: folder.id })
    }
}
