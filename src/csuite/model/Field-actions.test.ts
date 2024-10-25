import { beforeEach, describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleFactory as f } from '../'

const r = f.repository

describe('field customizations', () => {
   beforeEach(() => r.reset())
   it('works', () => {
      const SA = b.int().useClass((SUPER) => {
         return class A extends SUPER {
            $Field!: A
            squareV2 = (): number => this.value ** 2
            square(): number {
               return this.value ** 2
            }
            set abc(x: number) {
               this.value = x * 2
            }
            toSquareV2(): void {
               void (this.value = this.value ** 2)
            }
            toSquare(): void {
               this.value = this.value ** 2
            }
         }
      })
      const S1 = b
         .fields({
            a1: SA,
            a2: SA,
            b: b.string({ default: 'ok' }),
         })

         .useClass((SUPER) => {
            return class A extends SUPER {
               $Field!: A
               bang(): void {
                  // TODO: this should be done implicitly
                  // not critical
                  this.runInValueTransaction(() => {
                     this.fields.b.value += '!'
                     this.value.a1 += 11
                     this.value.a2 += 11
                  })
               }
               get atimes2(): number {
                  return this.value.a1 * 2
               }
               someValue = 2
            }
         })

      const E1 = S1.create()
      expect({ a1: 0, a2: 0, b: 'ok' }).toMatchObject(E1.toValueJSON())

      expect(r.transactionCount).toBe(1)
      E1.bang()
      expect(r.transactionCount).toBe(2)

      expect({ a1: 11, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())
      const z1 = E1.fields.a1.square()
      const z2 = E1.fields.a1.squareV2()
      expect(z1).toBe(121)
      expect(z2).toBe(121)
      expect({ a1: 11, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())

      E1.fields.a1.toSquare()
      expect({ a1: 121, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())
      expect(E1.atimes2).toBe(242)
      expect({ a1: 121, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())
      E1.fields.a1.abc = 4
      expect({ a1: 8, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())

      expect(E1.someValue).toBe(2)
      E1.someValue = 3
      expect(E1.someValue).toBe(3)
   })
})
