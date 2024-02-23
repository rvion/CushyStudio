import { action, makeObservable, observable, runInAction } from 'mobx'

export class ManualPromise<T = any> implements PromiseLike<T> {
    done: boolean = false
    value: T | null = null
    resolve!: (t: T | PromiseLike<T>) => void
    reject!: (err: any) => void
    promise: Promise<T>
    then: Promise<T>['then']
    isRunning = false
    setValue = (t: T) => { this.value = t } // prettier-ignore
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = (t: T | PromiseLike<T>) => {
                runInAction(() => {
                    this.done = true
                    this.isRunning = false
                })
                if (isPromise(t)) {
                    ;(t as Promise<T>).then((final) => this.setValue(final))
                } else {
                    this.setValue(t as any)
                }
                resolve(t)
            }
            this.reject = (t) => {
                runInAction(() => {
                    this.done = true
                    this.isRunning = false
                })
                reject(t)
            }
        })
        this.then = this.promise.then.bind(this.promise)
        makeObservable(this, {
            done: observable,
            setValue: action,
            value: observable,
        })
    }
}

export const isPromise = (p: any): p is Promise<any> => {
    return p != null && typeof p.then === 'function'
}
