import type { IReactionDisposer } from 'mobx'

import { reaction } from 'mobx'

export type LocalStorageKey = Tagged<string, 'localstorage'>

export class AutoSaver<Data = any> {
    constructor(
        /** localstorage key */
        public key: LocalStorageKey,

        /** localstorage key */
        public getCurrent: () => Data,
    ) {}

    discard = () => localStorage.removeItem(this.key)

    private _disposer: IReactionDisposer | null = null

    start = () => {
        if (this._disposer != null) return
        this._disposer = reaction(
            () => this.getCurrent(),
            (data: Data) => this.save(data),
            { delay: 500, fireImmediately: true },
        )
    }

    stop = () => {
        if (this._disposer == null) return
        this._disposer()
        this._disposer = null
    }

    load = (): Data | null => load(this.key)

    private save = (data: Data) => {
        if (!data) return log(`nothing to save`)
        localStorage.setItem(this.key, JSON.stringify(data))
        log(`autosaved (${this.key})`)
    }
}

export const load = (key: LocalStorageKey) => {
    const rawValue = localStorage.getItem(key)
    // localStorage.removeItem(this.autosaveKey)
    if (rawValue == null) {
        log('no previous value to re-hydrate')
        return null
    }
    try {
        const value = JSON.parse(rawValue)
        return value
    } catch (error) {
        log('❌ restore - failed', error)
        return null
    }
}

const log = (...args: any) => console.log(`[🐹]`, ...args)
