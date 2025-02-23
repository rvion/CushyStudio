import type { Field_number } from './FieldNumber'

import { produce } from 'immer'
import { reaction } from 'mobx'
import { describe, expect, it } from 'vitest'

import { simpleBuilder } from '../../simple/SimpleFactory'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('field number', () => {
   describe('create', () => {
      it('should load the value from the serial', () => {
         const serial: Field_number['$serial'] = { $: 'number', value: 8 }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.value).toBe(8)
      })

      it('should keep an invalid value from the serial', () => {
         const serial: Field_number['$serial'] = { $: 'number', value: 'invalid' }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.value_unchecked).toBe('invalid')
         expect(document.hasOwnErrors).toBeTruthy()
      })

      it('should parse previously serialized value', () => {
         const serial: Field_number['$serial'] = { $: 'number', value: '8' }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.serial).toEqual({
            $: 'number',
            value: 8,
         })
         expect(document.value).toBe(8)
      })
   })

   describe('set value', () => {
      describe('with a number', () => {
         it('should accept a number', () => {
            const schema = b.number({ default: 5 })
            const document = schema.create()
            document.value = 8
            expect(document.value).toBe(8)
         })

         it('should not be on error', () => {
            const schema = b.number({ default: 5 })
            const document = schema.create()
            document.value = 8
            expect(document.hasOwnErrors).toBeFalsy()
         })
      })

      describe('with null', () => {
         it('should accept null', () => {
            const schema = b.number({ default: 5 })
            const document = schema.create()
            document.value = null
            expect(document.value_unchecked).toBeNull()
         })

         it('should be on error', () => {
            const schema = b.number({ default: 5 })
            const document = schema.create()
            document.value = null
            expect(document.hasOwnErrors).toBeTruthy()
         })
      })

      describe('with a string', () => {
         describe('with an invalid string', () => {
            it('should save the value', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.value = 'invalid'
               expect(document.value_unchecked).toBe('invalid')
            })

            it('should be on error', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.value = 'invalid'
               expect(document.hasOwnErrors).toBeTruthy()
               expect(document.ownTypeSpecificProblems).toBe('Enter a valid number')
            })

            it('should set the value to null if the string is empty', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.value = ' '
               expect(document.value_unchecked).toBeNull()
            })
         })

         describe('with a valid string', () => {
            it('should save the value', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.value = '8'
               expect(document.value).toBe(8)
            })

            it('should not be on error', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.value = '8'
               expect(document.hasOwnErrors).toBeFalsy()
            })
         })
      })
   })

   describe('reference equality', () => {
      it('should preserve reference equality when deleting non-existent property', () => {
         const x = { a: 1, b: 2 }
         const y1 = produce(x, (draft) => void delete (draft as any).xxxx)
         expect(y1 === x).toBeTruthy()
      })

      it('should preserve reference equality when assigning same value', () => {
         const x = { a: 1, b: 2 }
         const y2 = produce(x, (draft) => void (draft.b = 2))
         expect(y2 === x).toBeTruthy()
      })

      it('should change reference equality when assigning different value', () => {
         const x = { a: 1, b: 2 }
         const y3 = produce(x, (draft) => void (draft.b = 8))
         expect(y3 === x).toBeFalsy()
      })

      it('should change reference equality when deleting existing property', () => {
         const x = { a: 1, b: 2 }
         const y4 = produce(x, (draft) => void delete (draft as any).b)
         expect(y4 === x).toBeFalsy()
      })

      it('should only change the serial reference if something changes', () => {
         const serial: Field_number['$serial'] = { $: 'number', value: 8 }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.value).toBe(8)
         expect(document.serial).toBe(serial)

         document.value = 8
         expect(document.value).toBe(8)
         expect(document.serial).toBe(serial)
         // TODO: check we don't emit any change events

         document.value = 9
         expect(document.serial).not.toBe(serial)
      })

      it('should preserve the reference when changed within a group', () => {
         const schema = b.fields({ num: b.number({ default: 5 }) })
         const serial: Z.Group<{ num: Z.Number }>['$serial'] = {
            $: 'group',
            values_: { num: { $: 'number', value: 8 } },
         }

         const document = schema.create(serial)
         expect(document.value.num).toBe(8)
         expect(document.serial).toBe(serial)

         expect(document._acknowledgeCount).toBe(0)
         document.value.num = 8
         expect(document.value.num).toBe(8)
         expect(document.serial).toBe(serial)
         expect(document._acknowledgeCount).toBe(0)

         document.value.num = 9
         expect(document.value.num).toBe(9)
         expect(document.serial).not.toBe(serial)
         expect(document._acknowledgeCount).toBe(1)

         // test things are properly mutable
         let x = 0
         reaction(
            () => document.value.num,
            (v) => void x++,
         )
         expect(x).toBe(0)
         document.value.num++
         expect(x).toBe(1)
         document.value.num++
         expect(x).toBe(2)
         document.value.num++
         expect(x).toBe(3)
         document.value.num++
         expect(x).toBe(4)
      })
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = schema.create()

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = schema.create()

            E1.value = 8
            E2.value = 8

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = schema.create()

            E1.value = 8

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = schema.create()

            E1.value = 8
            E2.value = 9

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })

         it('should return false if the other field is not a number', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = b.text({ default: '8' }).create()

            E1.value = 8

            expect(E1.isValueEqual(E2 as any)).toBeFalsy()
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      it('should generate a patch that sets the value', () => {
         const schema = b.number({ default: 5 })
         const E1 = schema.create()
         const E2 = schema.create()

         E1.value = 8

         const patches = E1.generatePatches(E2)

         E2.applyPatches(patches)

         expect(E2.value).toBe(8)
      })
   })
})
