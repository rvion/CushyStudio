import type { DependencyList } from 'react'

import { makeAutoObservable, observable } from 'mobx'
import { useMemo } from 'react'

export function useObservableRef<T extends any>(deps: DependencyList): ObservableRef<T> {
   return useMemo(() => new ObservableRef(), deps)
}

export function createObservableRef<T extends any>(value?: T): ObservableRef<T> {
   return new ObservableRef(value)
}

class ObservableRef<T extends any> {
   constructor(private _current: T | null = null) {
      makeAutoObservable<this, '_current'>(this, { _current: observable.ref })
   }

   get current(): T | null {
      return this._current ?? null
   }

   set current(value: T | null) {
      this._current = value
   }
}
