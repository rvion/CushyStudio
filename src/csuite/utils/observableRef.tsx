import { observable } from 'mobx'
import { type RefObject } from 'react'

export const createObservableRef = <T extends any>(value: Maybe<T> = null): RefObject<T> => {
   return observable({ current: value }, { current: observable.ref })
}

export const createObservableRefMut = <T extends any>(value: Maybe<T> = null): { current: Maybe<T> } => {
   return observable({ current: value }, { current: observable.ref })
}
