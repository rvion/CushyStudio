import type { ScriptStep_Iface } from './ScriptStep_Iface'
import type { Maybe } from './ComfyUtils'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export class ScriptStep_askBoolean implements ScriptStep_Iface<boolean> {
    uid = nanoid()
    name = 'ask-boolean'
    constructor(
        //
        public msg: string,
        public def?: Maybe<boolean>,
    ) {
        makeAutoObservable(this)
    }

    _resolve!: (value: boolean) => void
    _rejects!: (reason: any) => void
    finished: Promise<boolean> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    answer = (value: boolean) => {
        this._resolve(value)
    }
}

export class ScriptStep_askString implements ScriptStep_Iface<string> {
    uid = nanoid()
    name = 'ask-string'
    constructor(
        //
        public msg: string,
        public def?: Maybe<string>,
    ) {
        makeAutoObservable(this)
    }

    _resolve!: (value: string) => void
    _rejects!: (reason: any) => void
    finished: Promise<string> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    answer = (value: string) => {
        this._resolve(value)
    }
}
