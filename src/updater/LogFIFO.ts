import { makeAutoObservable } from 'mobx'

export class LogFifo {
   private readonly _maxSize: number
   logs: { date: Timestamp; msg: string }[] = []

   constructor(maxSize: number) {
      this._maxSize = maxSize
      makeAutoObservable(this)
   }

   add(line: string) {
      if (this.logs.length >= this._maxSize) this.logs.pop()
      this.logs.unshift({ date: Date.now(), msg: line })
   }
}
