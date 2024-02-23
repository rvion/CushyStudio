import { makeAutoObservable, runInAction } from 'mobx'
import { createElement, type ReactNode } from 'react'

import { stableStringify } from 'src/panels/router/hash'

const newly = Symbol('newly')
type NEWLY = typeof newly

const running = Symbol('running')
type RUNNING = typeof running

const error = Symbol('error')
type ERROR = typeof error

export class Kwery<T = any> implements PromiseLike<T> {
    private static _CACHE = new Map<string, Kwery<any>>()
    static get<T = any>(
        //
        key: string,
        params: object = {},
        set: Promise<T> | (() => Promise<T>),
    ): Kwery<T> {
        const _key = stableStringify({ key, params })
        if (!Kwery._CACHE.has(_key)) {
            console.log(`[🤠] CACHE MISS FOR KEY ${_key}`)
            const kwery = new Kwery<T>()
            Kwery._CACHE.set(_key, kwery)
            if (typeof set === 'function') kwery.set(set())
            else kwery.set(set)
            return kwery
        } else {
            return Kwery._CACHE.get(_key) as Kwery<T>
        }
    }

    orDefault = (t: T): T => {
        if (this._value === newly) return t
        if (this._value === running) return t
        if (this._value === error) return t
        return this._value
    }
    ui = (fn: (t: T) => ReactNode) => {
        if (this._value === newly) return null
        if (this._value === running) return createElement('div', { className: 'loading loading-spinner' })
        if (this._value === error) return createElement('div', { className: 'error' }, '❌')
        return fn(this._value as T)
    }
    get done(): boolean {
        if (this._value === newly) return false
        if (this._value === running) return false
        return true
    }
    get isRunning(): boolean { return this._value === running } // prettier-ignore
    private resolve!: (t: T | PromiseLike<T>) => void
    private reject!: (err: any) => void
    private readonly promise: Promise<T>
    readonly then: Promise<T>['then']

    /* 🟢 --> */ private _error: any = null
    /* 🟢 --> */ private _value: T | NEWLY | RUNNING | ERROR = newly

    get error(): any {
        return this._error
    }
    get value(): T | null {
        if (this._value === newly) return null
        if (this._value === running) return null
        if (this._value === error) return null
        return this._value as T
    }

    set = async (t: T | Promise<T>) => {
        try {
            runInAction(() => {
                this._value = running
            })
            const FINAL = await t
            runInAction(() => {
                this._error = null
                this._value = FINAL
                this.resolve(FINAL)
            })
        } catch (e) {
            runInAction(() => {
                this._value = error
                this._error = e
                this.reject(e)
            })
        }
    }

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
        this.then = this.promise.then.bind(this.promise)
        makeAutoObservable(this)
    }
}
