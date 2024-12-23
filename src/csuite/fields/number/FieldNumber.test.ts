import type { Field_number_serial } from './FieldNumber'

import { describe, expect, it } from 'bun:test'
import { produce } from 'immer'
import { reaction } from 'mobx'

import { simpleBuilder } from '../../simple/SimpleFactory'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('field number', () => {
   describe('create', () => {
      it('should load the value from the serial', () => {
         const serial: Field_number_serial = { $: 'number', value: 8 }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.value).toBe(8)
      })

      it('should keep an invalid value from the serial', () => {
         const serial: Field_number_serial = { $: 'number', value: 'invalid' }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.value_unchecked).toBe('invalid')
         expect(document.hasOwnErrors).toBeTrue()
      })

      it('should parse previously serialized value', () => {
         const serial: Field_number_serial = { $: 'number', value: '8' }
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
            expect(document.hasOwnErrors).toBeFalse()
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
            expect(document.hasOwnErrors).toBeTrue()
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
               expect(document.hasOwnErrors).toBeTrue()
               expect(document.ownTypeSpecificProblems).toBe('Enter a valid number')
            })

            it('should set the value_unchecked to null if the string is empty', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.value = ' '
               expect(document.value_unchecked).toBeNull()
            })
            it('should parse advanced notations', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.value = '1e3'
               expect(document.value_unchecked).toBe(1000)
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
               expect(document.hasOwnErrors).toBeFalse()
            })
         })
      })
   })

   describe('reference equality', () => {
      it('should preserve reference equality when deleting non-existent property', () => {
         const x = { a: 1, b: 2 }
         const y1 = produce(x, (draft) => void delete (draft as any).xxxx)
         expect(y1 === x).toBeTrue()
      })

      it('should preserve reference equality when assigning same value', () => {
         const x = { a: 1, b: 2 }
         const y2 = produce(x, (draft) => void (draft.b = 2))
         expect(y2 === x).toBeTrue()
      })

      it('should change reference equality when assigning different value', () => {
         const x = { a: 1, b: 2 }
         const y3 = produce(x, (draft) => void (draft.b = 8))
         expect(y3 === x).toBeFalse()
      })

      it('should change reference equality when deleting existing property', () => {
         const x = { a: 1, b: 2 }
         const y4 = produce(x, (draft) => void delete (draft as any).b)
         expect(y4 === x).toBeFalse()
      })

      it('should only change the serial reference if something changes', () => {
         const serial: Field_number_serial = { $: 'number', value: 8 }
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
         const serial: S.SGroup<{ num: S.SNumber }>['$Serial'] = {
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
})
