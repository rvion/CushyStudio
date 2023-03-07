import type { ITextModel } from './TypescriptOptions'

import { makeAutoObservable } from 'mobx'
import { Comfy } from '../core/Comfy'
import { createContext, useContext } from 'react'

export class EditorState {
    file: ITextModel | null = null
    focus: number = 0
    project: Comfy | null = null

    eval_real = async (otps?: { noEval: true }) => {
        const code = this.file?.getValue()
        if (code == null) return console.log('❌')
        const finalCode = code.replace(`export {}`, '')
        const BUILD = new Function('C', `return (async() => { ${finalCode} })()`)
        const project = new Comfy(otps)
        await BUILD(project)
        console.log('✅', project, otps)
        this.project = project
    }

    constructor() {
        makeAutoObservable(this)
        setTimeout(() => this.eval_real({ noEval: true }), 1000)
    }
}

export const stContext = createContext<EditorState | null>(null)
export const useSt = () => {
    const st = useContext(stContext)
    if (st == null) throw new Error('no st in context')
    return st
}
