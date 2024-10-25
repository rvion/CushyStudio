import { isPromise } from './ManualPromise'

export class ObservablePromise<T> {
   result: T | null = null
   error: any = null

   promise: Promise<T>
   resolve!: (t: T | PromiseLike<T>) => void
   reject!: (err: any) => void
   constructor(
      //
      public fn?: (self: ObservablePromise<T>) => {},
   ) {
      this.promise = new Promise((resolve, reject) => {
         this.resolve = (t: T | PromiseLike<T>) => {
            if (isPromise(t)) {
               void (t as Promise<T>).then((final) => {
                  this.result = final
                  resolve(final)
               })
            } else {
               this.result = t as any
               resolve(t as any)
            }
         }
         this.reject = (t) => {
            this.error = t
            reject(t)
         }
      })
   }
}
