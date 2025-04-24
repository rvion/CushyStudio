import { makeAutoObservable, observable } from 'mobx'
import { describe, expect, it } from 'vitest'

import { expectPotato } from '../model/TESTS/utils/expectJSON'
import { potatoClone } from './potatoClone'

describe('smartClone', () => {
   //
   it('can detect basic objects', () => {
      // NOT object
      expect([].constructor).not.toBe(Object)
      expect(new (class Foo {})().constructor).not.toBe(Object)

      // YES object
      expect({ a: 1 }.constructor).toBe(Object)
      expect(observable({ a: 1 }).constructor).toBe(Object)
   })

   it('works with stuff that have getters', () => {
      expect(
         potatoClone({
            get a() {
               return observable({ x: 1 })
            },
         }),
      ).toEqual({ a: { x: 1 } })
   })

   it(`DISCARD proxy or getters`, () => {
      const x = {
         foo: 1,
         get bar(): number {
            return this.foo
         },
      }
      const y = potatoClone(x)
      y.foo = 2
      expect(y.bar).toBe(1)
   })

   it('can somewhat-clone most stuff', () => {
      const A = {
         a: 1,
         b: '2',
         c: [3, 4, 5],
         fn1: (): void => console.log('fn1'),
         fn2: function (): void {
            console.log('fn2')
         },
         fns: [(): void => console.log('fns1'), (): void => console.log('fns2')],
         cls1: new (class {
            coucou = 'yay'
         })(),
         clsObs: new (class {
            coucou = 'yay'
            constructor() {
               makeAutoObservable(this)
            }
         })(),
         set: new Set([1, 2, 3]),
         map: new Map([[1, 2]]),
         objsObj: observable({
            a: 1,
            b: [3, 4, { c: 5 }],
         }),
      }
      const B = potatoClone(A)

      expect(A).not.toBe(B)
      expect(A.c).not.toBe(B.c)
      expect(A.fn1).toBe(B.fn1)
      expect(A.fn2).toBe(B.fn2)

      expectPotato(A).toEqual(B)
      expect(A.a).toEqual(B.a)
   })
})
