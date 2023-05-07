import type { Maybe } from '../utils/types'
import type { ScriptStep_Iface } from './ScriptStep_Iface'
import type { InfoAnswer, Requestable } from './askv2'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export class ScriptStep_ask<const Req extends { [key: string]: Requestable }>
    implements ScriptStep_Iface<{ [key in keyof Req]: InfoAnswer<Req[key]> }>
{
    uid = nanoid()
    name = 'ask-boolean'
    constructor(public req: Req) {
        makeAutoObservable(this)
    }

    locked: boolean = false
    value: Maybe<{ [key in keyof Req]: InfoAnswer<Req[key]> }> = null
    private _resolve!: (value: { [key in keyof Req]: InfoAnswer<Req[key]> }) => void
    // private _rejects!: (reason: any) => void
    finished: Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }> = new Promise((resolve, _rejects) => {
        this._resolve = resolve
        // this._rejects = rejects
    })

    answer = (value: { [key in keyof Req]: InfoAnswer<Req[key]> }) => {
        this.locked = true
        this.value = value
        this._resolve(value)
    }
}

// -----------------------------------
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
        public msg: string, // public image: RelativePath,
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
