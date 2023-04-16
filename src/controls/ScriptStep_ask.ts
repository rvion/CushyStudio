import type { ScriptStep_Iface } from './ScriptStep_Iface'
import type { Maybe } from '../utils/types'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { RelativePath } from '../fs/BrandedPaths'

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

    locked: boolean = false
    value: Maybe<boolean> = null
    private _resolve!: (value: boolean) => void
    // private _rejects!: (reason: any) => void
    finished: Promise<boolean> = new Promise((resolve, _rejects) => {
        this._resolve = resolve
        // this._rejects = rejects
    })

    answer = (value: boolean) => {
        this.locked = true
        this.value = value
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
    locked: boolean = false
    value: Maybe<string> = null
    private _resolve!: (value: string) => void
    // private _rejects!: (reason: any) => void
    finished: Promise<string> = new Promise((resolve, _rejects) => {
        this._resolve = resolve
        // this._rejects = rejects
    })

    answer = (value: string) => {
        this.locked = true
        this.value = value
        this._resolve(value)
    }
}

export class ScriptStep_askPaint implements ScriptStep_Iface<string> {
    uid = nanoid()
    name = 'ask-paint'
    constructor(
        //
        public msg: string,
    ) // public image: RelativePath,
    {
        makeAutoObservable(this)
    }
    locked: boolean = false
    value: Maybe<string> = null
    private _resolve!: (value: string) => void
    // private _rejects!: (reason: any) => void
    finished: Promise<string> = new Promise((resolve, _rejects) => {
        this._resolve = resolve
        // this._rejects = rejects
    })

    answer = (value: string) => {
        this.locked = true
        this.value = value
        this._resolve(value)
    }
}
