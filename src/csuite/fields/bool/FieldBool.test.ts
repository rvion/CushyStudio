import { describe, expect, it, vitest } from 'vitest'

import { simpleBuilder } from '../../simple/SimpleFactory'
import { Field_bool } from './FieldBool'

const b = simpleBuilder
describe('FieldBool', () => {
   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const S = b.bool({ default: undefined })
            const E1 = S.create()
            const E2 = S.create()

            expect(E1.ϟisValueEqual(E2)).toBe(true)
         })

         it('should return true if both fields are set to the same value', () => {
            const S = b.bool()
            const E1 = S.create()
            const E2 = S.create()

            E1.ϟvalue = true
            E2.ϟvalue = true
            expect(E1.ϟisValueEqual(E2)).toBeTruthy()
            const x: Z.Field = 0 as any
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const S = b.bool({ default: undefined })
            const E1 = S.create()
            const E2 = S.create()

            E1.ϟvalue = false

            expect(E1.ϟisValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const S = b.bool()
            const E1 = S.create()
            const E2 = S.create()

            E1.ϟvalue = true
            E2.ϟvalue = false

            expect(E1.ϟisValueEqual(E2)).toBeFalsy()
         })
      })
   })

   describe('create perf', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should use the defaultSerial without patching it', () => {
               const patchSerial = vitest.spyOn(Field_bool.prototype, 'ϟpatchSerial')
               const S = b.bool_()
               const E = S.create()

               expect(E.ϟserial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with a default value', () => {
            it('should use the defaultSerial and patch it with the default value', () => {
               const patchSerial = vitest.spyOn(Field_bool.prototype, 'ϟpatchSerial')
               const S = b.bool({ default: true })
               const E = S.create()

               expect(E.ϟserial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })
      })
   })
})
