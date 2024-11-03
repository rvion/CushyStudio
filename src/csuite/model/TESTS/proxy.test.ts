import { describe, it } from 'bun:test'
import { makeAutoObservable } from 'mobx'

import { expectJSON } from './utils/expectJSON'

describe('proxied mobx array that pretend their values are something else', () => {
   // MOBX MAKES IT SUPER HARD TO RE-PROXY
   it('works(get,push,slice,set,...)', () => {
      const foo = new MockedMappedList()
      expectJSON(foo.nums).toEqual([1, 2, 3])
      expectJSON(JSON.stringify(foo.nums)).toBe('[1,2,3]')

      foo.nums[1] = 999

      expectJSON(foo.nums).toEqual([1, 999, 3])
      expectJSON(foo.nums.slice(0, 2)).toEqual([1, 999])
      expectJSON(JSON.stringify(foo.nums)).toBe('[1,999,3]')
      expectJSON(foo.raw).toEqual([
         { num: 1, str: '1' },
         { num: 999, str: '999' },
         { num: 3, str: '3' },
      ])

      foo.nums.push(8)
      expectJSON(foo.nums[1]).toBe(999)
      expectJSON(foo.nums[2]).toBe(3)
      expectJSON(foo.nums.length).toBe(4)
      expectJSON(foo.nums[3]).toBe(8)
      expectJSON(foo.nums.length).toBe(4)
      expectJSON(foo.raw.length).toBe(4)
      expectJSON(foo.raw[3]!.str).toBe('8')
      expectJSON(JSON.stringify(foo.nums)).toBe('[1,999,3,8]')
   })
})

class MockedMappedList {
   constructor() {
      makeAutoObservable(this, { __nums: false })
   }

   raw: { num: number; str: string }[] = [
      { num: 1, str: '1' },
      { num: 2, str: '2' },
      { num: 3, str: '3' },
   ]

   __nums = new Proxy(this.raw as any, {
      get: (target, prop: any): any => {
         // console.log(`[GET]`, prop)
         if (typeof prop === 'symbol') return this.raw[prop as any]

         // ONLY BECAUSE OF MOBX ----------------------------------------------------
         if (prop === 'toJSON') return (): number[] => this.raw.map((e) => e.num)
         if (prop === 'pop') return () => this.raw.pop()
         if (prop === 'push')
            return (value: number) => {
               this.raw.push({ num: value, str: value.toString() })
            }
         if (prop === 'slice') {
            const arr = this.raw.map((e) => e.num)
            return arr.slice.bind(arr)
         }
         // -------------------------------------------------------------------------
         if (parseInt(prop, 10) === +prop) {
            return this.raw[+prop]?.num
         }
         return this.raw[prop]
      },
      set: (target, prop: any, value): boolean => {
         // console.log(`[SET]`, prop, value)
         if (typeof prop === 'symbol') return false
         if (parseInt(prop, 10) === +prop) {
            if (this.raw[prop]) {
               this.raw[prop]!.num = value
               this.raw[prop]!.str = value.toString()
            } else {
               this.raw[prop] = { num: value, str: value.toString() }
            }
         }

         return true
      },
   })

   get nums(): number[] {
      return this.__nums
   }
}
