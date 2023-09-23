import { makeObservable, observable } from 'mobx'

export class ManualPromise<T = any> implements PromiseLike<T> {
    done: boolean = false
    resolve!: (t: T | PromiseLike<T>) => void
    reject!: (err: any) => void
    promise: Promise<T>
    then: Promise<T>['then']
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = (t: T | PromiseLike<T>) => {
                this.done = true
                resolve(t)
            }
            this.reject = reject
        })
        this.then = this.promise.then.bind(this.promise)
        makeObservable(this, { done: observable })
    }
}
