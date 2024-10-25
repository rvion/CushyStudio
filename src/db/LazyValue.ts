import { action, makeAutoObservable, runInAction } from 'mobx'

export class LazyValue<T> {
   isUpdating: boolean = false
   hasValue: boolean = false

   constructor(
      public p: {
         fetch: () => T | Promise<T>

         /** mandatory to provide a smooth sync experience */
         defaultWhenNoValue: T

         /**
          * if set, will be use during update
          * otherwise, past value or defaultWhenNoValue will be used instead
          */
         defaultWhenUpdating?: T

         /**
          * ❌ not implemented yet
          * if provided, will register a reaction to auto-update the value on change
          * */
         autoUpdate?: () => any
      },
   ) {
      makeAutoObservable(this, { update: action })
   }

   /** todo: properly debounce that */
   update = async () => {
      runInAction(() => {
         this.isUpdating = true
      })
      try {
         const val = await this.p.fetch()
         runInAction(() => {
            this.hasValue = true
            this._value = val
            this.isUpdating = false
         })
      } catch {
         runInAction(() => {
            this.isUpdating = false
         })
      }
   }

   private _value: Maybe<T> = null

   get value(): T {
      if (this.isUpdating && this.p.defaultWhenUpdating != null) return this.p.defaultWhenUpdating
      if (!this.isUpdating && !this.hasValue) {
         void this.update()
      }
      return this._value ?? this.p.defaultWhenNoValue
   }
}
