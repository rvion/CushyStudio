// import type { ITextModel } from './TypescriptOptions'

import { makeAutoObservable } from 'mobx'
import { Comfy } from '../core/Comfy'
import { createContext, useContext } from 'react'
import { RunMode } from '../core/ComfyScript'

/** global IDE State */
export class ComfyIDEState {
    serverIP = '192.168.1.19'
    serverPort = 8188
    get serverHost() { return `${this.serverIP}:${this.serverPort}` } // prettier-ignore

    /** initial project */
    project: Comfy = new Comfy()

    /** list of known projects */
    projects: Comfy[] = [this.project]
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

export const stContext = createContext<ComfyIDEState | null>(null)

export const useSt = () => {
    const st = useContext(stContext)
    if (st == null) throw new Error('no st in context')
    return st
}
export const useProject = () => {
    const st = useContext(stContext)
    if (st == null) throw new Error('no st in context')
    return st.project
}
