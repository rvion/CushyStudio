import type { ScriptStep_Iface } from './ScriptStep_Iface'
import type { Widget } from '../Widget'
import type { GetWidgetResult } from '../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export class ScriptStep_ask<const Req extends { [key: string]: Widget }>
    implements ScriptStep_Iface<{ [key in keyof Req]: GetWidgetResult<Req[key]> }>
{
    uid = nanoid()
    name = 'ask-boolean'
    constructor(public req: Req) {
        makeAutoObservable(this)
    }

    locked: boolean = false
    value: Maybe<{ [key in keyof Req]: GetWidgetResult<Req[key]> }> = null
    private _resolve!: (value: { [key in keyof Req]: GetWidgetResult<Req[key]> }) => void
    // private _rejects!: (reason: any) => void
    finished: Promise<{ [key in keyof Req]: GetWidgetResult<Req[key]> }> = new Promise((resolve, _rejects) => {
        this._resolve = resolve
        // this._rejects = rejects
    })

    answer = (value: { [key in keyof Req]: GetWidgetResult<Req[key]> }) => {
        this.locked = true
        this.value = value
        this._resolve(value)
    }
}
