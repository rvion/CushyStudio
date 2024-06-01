import { computed, makeObservable, observable } from 'mobx'

// export interface NumberVar<Name extends string = string> {
//     readonly value: string
// }
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
export function getNum(a: Maybe<number | NumberVar>, def?: undefined): number | undefined
export function getNum(a: Maybe<number | NumberVar>, def: number): number
export function getNum(a: Maybe<number | NumberVar>, def?: number): number | undefined {
    if (a == null) return def
    return typeof a === 'number' ? a : a.value
}
