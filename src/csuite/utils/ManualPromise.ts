import { action, makeObservable, observable, runInAction } from 'mobx'

export class ManualPromise<T = any> implements PromiseLike<T> {
   /**
    * true when the promised has been manually resolved
    * DO NOT MUTATE DIRECTLY
    */
   done: boolean = false

   /** resolved value */
   value: T | null = null

   /** call that function to manually resolve the promise to the give value */
   resolve!: (t: T | PromiseLike<T>) => void

   /** call that function to manually reject the promise with the given error */
   reject!: (err: any) => void

   /** the actual promise */
   promise: Promise<T>

   then: Promise<T>['then']

   /**
    * true when the promise is running;
    * NOT AUTOMATIC; since this is a MANUAL promise, you have to use that flag manually
    */
   isRunning = false

   setValue = (t: T): void => {
      this.value = t
   }
   constructor() {
      this.promise = new Promise((resolve, reject) => {
         this.resolve = (t: T | PromiseLike<T>): void => {
            runInAction(() => {
               this.done = true
               this.isRunning = false
            })
            if (isPromise(t)) {
               void (t as Promise<T>).then((final) => this.setValue(final))
            } else {
               this.setValue(t as any)
            }
            resolve(t)
         }
         this.reject = (t): void => {
            runInAction(() => {
               this.done = true
               this.isRunning = false
            })
            reject(t)
         }
      })
      this.then = this.promise.then.bind(this.promise)
      void makeObservable(this, {
         done: observable,
         setValue: action,
         value: observable,
      })
   }
}

export const isPromise = (p: any): p is Promise<any> => {
   return p != null && typeof p.then === 'function'
}
