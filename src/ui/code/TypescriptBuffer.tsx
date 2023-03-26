import type { ITextModel } from '../TypescriptOptions'
import type { Maybe } from '../../core/ComfyUtils'
import type { Workspace } from '../../core/Workspace'
import { globalMonaco } from '../Monaco'
import { makeObservable, observable } from 'mobx'

export class TypescriptBuffer {
    constructor(
        //
        public workspace: Workspace,
        public name: string,
        public path: string,
    ) {
        this.ensureModel('')
        makeObservable(this, { textModel: observable.ref })
    }

    textModel: Maybe<ITextModel> = null

    ensureModel = async (content: string) => {
        const monaco = await globalMonaco
        if (!monaco) throw new Error('🔴 monaco is null')

        const uri = monaco.Uri.parse(this.monacoPath)
        let model = monaco.editor.getModel(uri)
        if (model) {
            console.log(`[🔵] updating ${this.monacoPath}`)
            model.setValue(content)
        } else {
            console.log(`[🔵] creating ${this.monacoPath}`)
            model = monaco.editor.createModel(content, 'typescript', uri)
        }
        this.textModel = model
    }

    writable?: boolean = true
    virtual: boolean = false
    code: string = ''

    get monacoPath(): string {
        return `file://${this.path}`
    }

    // openPathInEditor = (): ITextModel | null => {
    //     const monaco = globalMonaco
    //     if (!monaco) throw new Error('monaco is null')
    //     const libURI = monaco.Uri.parse(this.monacoPath)
    //     return monaco.editor.getModel(libURI)
    // }

    udpateCode = (value: Maybe<string>) => {
        if (value == null) return
        this.code = value
    }
}
