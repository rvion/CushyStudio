import { computed, makeObservable, observable } from 'mobx'

// export interface NumberVar<Name extends string = string> {
//     readonly value: string
// }

// 🔴 TODO: 2024-06-10 remove this
export class NumberVar<Name extends string = string> {
   get value(): number {
      return this.value_ instanceof Function ? this.value_() : this.value_
   }

   constructor(
      public name: Name,
      public value_: number | (() => number),
   ) {
      makeObservable(this, { value_: observable, value: computed })
   }

   toString() {
      return `var(--${this.name})`
   }
}

/**
 * extract value from a number of NumberVar
 */
export function getNum(a: number | NumberVar): number
export function getNum(a: Maybe<number | NumberVar>, def: number): number
export function getNum(a: Maybe<number | NumberVar>, def?: undefined): number | undefined
export function getNum(a: Maybe<number | NumberVar>, def?: number): number | undefined {
   if (a == null) return def
   if (a instanceof NumberVar) return getNum(a.value)
   return a
}
