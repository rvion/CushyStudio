import { makeObservable, observable } from 'mobx'

export class ManualPromise<T = any> implements PromiseLike<T> {
    done: boolean = false
    value: T | null = null
    resolve!: (t: T | PromiseLike<T>) => void
    reject!: (err: any) => void
    promise: Promise<T>
    then: Promise<T>['then']
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = (t: T | PromiseLike<T>) => {
                this.done = true
                if (isPromise(t)) {
                    ;(t as Promise<T>).then((final) => (this.value = final))
                } else {
                    this.value = t as any
                }
                resolve(t)
            }
            this.reject = reject
        })
        this.then = this.promise.then.bind(this.promise)
        makeObservable(this, { done: observable, value: observable })
    }
}

const isPromise = (p: any): p is Promise<any> => {
    return p != null && typeof p.then === 'function'
}
