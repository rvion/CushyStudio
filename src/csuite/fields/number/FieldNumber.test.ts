import { produce } from 'immer'
import { reaction } from 'mobx'
import { describe, expect, it, vitest } from 'vitest'

import { simpleBuilder } from '../../simple/SimpleFactory'
import { Field_group } from '../group/FieldGroup'
import { Field_number } from './FieldNumber'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('field number', () => {
   describe('create', () => {
      it('should load the value from the serial', () => {
         const serial: Field_number['{serial}'] = { $: 'number', value: 8 }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.zValue).toBe(8)
      })

      it('should keep an invalid value from the serial', () => {
         const serial: Field_number['{serial}'] = { $: 'number', value: 'invalid' }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.zValue_unchecked).toBeNull() // 'invalid'
         expect(document.zHasOwnErrors).toBeTruthy()
      })

      it('should parse previously serialized value', () => {
         const serial: Field_number['{serial}'] = { $: 'number', value: '8' }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.zSerial).toEqual({
            $: 'number',
            value: 8,
         })
         expect(document.zValue).toBe(8)
      })
   })

   describe('set value', () => {
      describe('with a number', () => {
         it('should accept a number', () => {
            const schema = b.number({ default: 5 })
            const document = schema.create()
            document.zValue = 8
            expect(document.zValue).toBe(8)
         })

         it('should not be on error', () => {
            const schema = b.number({ default: 5 })
            const document = schema.create()
            document.zValue = 8
            expect(document.zHasOwnErrors).toBeFalsy()
         })
      })

      describe('with null', () => {
         it('should accept null', () => {
            const schema = b.number({ default: 5 })
            const document = schema.create()
            const x = document.zValue
            document.zValue = null
            expect(document.zValue_unchecked).toBeNull()
         })

         it('should be on error', () => {
            const schema = b.number({ default: 5 })
            const document = schema.create()
            document.zValue = null
            expect(document.zHasOwnErrors).toBeTruthy()
         })
      })

      describe('with a string', () => {
         describe('with an invalid string', () => {
            it('should save the value', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.zValue = 'invalid'
               expect(document.zValue_unchecked).toBeNull()
               expect(document.zSerial.value).toBe('invalid')
            })

            it('should be on error', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.zValue = 'invalid'
               expect(document.zHasOwnErrors).toBeTruthy()
               expect(document.zOwnTypeSpecificProblems).toBe('Enter a valid number')
            })

            it('should set the value to null if the string is empty', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.zValue = ' '
               expect(document.zValue_unchecked).toBeNull()
            })
         })

         describe('with a valid string', () => {
            it('should save the value', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.zValue = '8'
               expect(document.zValue).toBe(8)
            })

            it('should not be on error', () => {
               const schema = b.number({ default: 5 })
               const document = schema.create()
               document.zValue = '8'
               expect(document.zHasOwnErrors).toBeFalsy()
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
         const serial: Field_number['{serial}'] = { $: 'number', value: 8 }
         const schema = b.number({ default: 5 })
         const document = schema.create(serial)
         expect(document.zValue).toBe(8)
         expect(document.zSerial).toBe(serial)

         document.zValue = 8
         expect(document.zValue).toBe(8)
         expect(document.zSerial).toBe(serial)
         // TODO: check we don't emit any change events

         document.zValue = 9
         expect(document.zSerial).not.toBe(serial)
      })

      it('should preserve the reference when changed within a group', () => {
         const schema = b.fields({ num: b.number({ default: 5 }) })
         const serial: Z.Group<{ num: Z.Number }>['{serial}'] = {
            $: 'group',
            values_: { num: { $: 'number', value: 8 } },
         }

         const patchSerial = vitest.spyOn(Field_group.prototype, 'zPatchSerial')

         const document = schema.create(serial)
         expect(document.zValue.num).toBe(8)
         expect(document.zSerial).toBe(serial)

         expect(patchSerial).not.toHaveBeenCalled()
         document.zValue.num = 8
         expect(document.zValue.num).toBe(8)
         expect(document.zSerial).toBe(serial)
         expect(patchSerial).not.toHaveBeenCalled()

         document.zValue.num = 9
         expect(document.zValue.num).toBe(9)
         expect(document.zSerial).not.toBe(serial)
         expect(patchSerial).toHaveBeenCalledOnce()

         // test things are properly mutable
         let x = 0
         reaction(
            () => document.zValue.num,
            (v) => void x++,
         )
         expect(x).toBe(0)
         document.zValue.num++
         expect(x).toBe(1)
         document.zValue.num++
         expect(x).toBe(2)
         document.zValue.num++
         expect(x).toBe(3)
         document.zValue.num++
         expect(x).toBe(4)
      })
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = schema.create()

            expect(E1.zIsValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = schema.create()

            E1.zValue = 8
            E2.zValue = 8

            expect(E1.zIsValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = schema.create()

            E1.zValue = 8

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = schema.create()

            E1.zValue = 8
            E2.zValue = 9

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })

         it('should return false if the other field is not a number', () => {
            const schema = b.number({ default: 5 })
            const E1 = schema.create()
            const E2 = b.text({ default: '8' }).create()

            E1.zValue = 8

            expect(E1.zIsValueEqual(E2 as any)).toBeFalsy()
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      it('should generate a patch that sets the value', () => {
         const schema = b.number({ default: 5 })
         const E1 = schema.create()
         const E2 = schema.create()

         E1.zValue = 8

         const patches = E1.zGeneratePatches(E2)

         E2.zApplyPatches(patches)

         expect(E2.zValue).toBe(8)
      })
   })

   describe('create performance', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should use the default serial and not modify it', () => {
               const patchSerial = vitest.spyOn(Field_number.prototype, 'zPatchSerial')

               const schema = b.number_()
               const document = schema.create()

               expect(document.zSerial).toBe(schema.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with a default value', () => {
            it('should use the default serial and not modify it', () => {
               const patchSerial = vitest.spyOn(Field_number.prototype, 'zPatchSerial')

               const schema = b.number({ default: 5 })
               const document = schema.create()

               expect(document.zSerial).toBe(schema.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })
      })
   })
})
