// import type { ITextModel } from './TypescriptOptions'

import { makeAutoObservable } from 'mobx'
import { Comfy } from '../core/Comfy'
import { createContext, useContext } from 'react'
import { RunMode } from '../core/ComfyProject'

export class EditorState {
    // file: ITextModel | null = null
    project: Comfy = new Comfy()
    focus: number = 0
    code: string = ''

    run = async () => {
        return this.udpateCode(this.code, 'real')
    }

    udpateCode = async (code: string, mode: RunMode) => {
        this.code = code
        const project = new Comfy()
        const result = await project.EVAL(code, mode)
        if (result) this.project = project
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export const stContext = createContext<EditorState | null>(null)
export const useSt = () => {
    const st = useContext(stContext)
    if (st == null) throw new Error('no st in context')
    return st
}
