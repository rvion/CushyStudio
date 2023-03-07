import type { ITextModel } from './TypescriptOptions'

import { makeAutoObservable } from 'mobx'
import { Comfy } from '../core/Comfy'

export class EditorState {
    file: ITextModel | null = null
    focus: number = 0
    liveModel: Comfy | null = (() => {
        setInterval(async () => {
            const code = this.file?.getValue()
            if (code == null) return console.log('❌')
            const finalCode = code.replace(`export {}`, '')
            const BUILD = new Function('C', `return (async() => { ${finalCode} })()`)
            const project = new Comfy({ noEval: true })
            await BUILD(project)
            this.liveModel = project
        }, 1000)
        return null
    })()

    constructor() {
        makeAutoObservable(this)
    }
}
