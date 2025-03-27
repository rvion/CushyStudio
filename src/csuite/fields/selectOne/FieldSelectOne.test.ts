import { describe, expect, it, vitest } from 'vitest'

import { expectJSON } from '../../model/TESTS/utils/expectJSON'
import { simpleBuilder } from '../../simple/SimpleFactory'
import { Field_optional } from '../optional/FieldOptional'
import { Field_selectOne } from './FieldSelectOne'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('FieldSelectOne', () => {
   it('works', () => {
      const S = b.selectOneString(['a', 'b', 'c'], { default: undefined })
      const E = S.create()

      expect(E.isSet).toBeFalsy()
      expectJSON(E.value_unchecked).toBeUndefined()

      E.value = 'a'
      expectJSON(E.value).toEqual('a')

      E.value = 'b'
      expectJSON(E.value).toEqual('b')
   })

   it('works with defaults', () => {
      const S = b.selectOneString(['a', 'b', 'c'], { default: 'a' })
      const E = S.create()

      expectJSON(E.value).toEqual('a')
   })

   it('works with legacy serials', () => {
      const S = b.selectOneString(['a', 'b', 'c'])
      const serial = { $: 'selectOne', val: { id: 'b' } }
      // @ts-expect-error: legacy serial injection
      const E = S.create(serial)

      expectJSON(E.value).toEqual('b')
   })

   it('can be created and set from a serial', () => {
      const S = b.selectOneString(['a', 'b', 'c'], { default: 'b' })
      const ser1: (typeof S)['…serial'] = { $: 'selectOne', val: 'c' }
      const ser2: (typeof S)['…serial'] = { $: 'selectOne', val: 'a' }
      const E = S.create(ser1)

      expectJSON(E.value).toEqual('c')
      expect(E.serial === ser1).toBeTruthy()

      E.setSerial(ser2)
      expectJSON(E.value).toEqual('a')
      expect(E.serial === ser2).toBeTruthy()

      E.setSerial({ $: 'selectOne' })
      expectJSON(E.value).toEqual('b')
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const S = b.selectOneString(['a', 'b', 'c'], { default: undefined })
            const E1 = S.create()
            const E2 = S.create()

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const S = b.selectOneString(['a', 'b', 'c'])
            const E1 = S.create()
            const E2 = S.create()

            E1.value = 'b'
            E2.value = 'b'

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const S = b.selectOneString(['a', 'b', 'c'], { default: undefined })
            const E1 = S.create()
            const E2 = S.create()

            E1.value = 'a'

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const S = b.selectOneString(['a', 'b', 'c'])
            const E1 = S.create()
            const E2 = S.create()

            E1.value = 'a'
            E2.value = 'b'

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      it('should change the selected value', () => {
         const S = b.selectOneString(['a', 'b', 'c'], { default: 'a' })
         const E1 = S.create()
         const E2 = S.create()

         E1.value = 'b'
         E2.value = 'a'

         const patches = E1.generatePatches(E2)

         E2.ܮapplyPatches(patches)

         expect(E2.value as string).toBe('b' as string)
      })

      it('should not generate a patch for the query', () => {
         const S = b.selectOneString(['a', 'b', 'c'], { default: 'a' })
         const E1 = S.create()
         const E2 = S.create()

         E1.value = 'a'
         E1.query = 'b'
         E1.value = 'a'
         E1.query = 'c'

         const patches = E1.generatePatches(E2)

         expectJSON(patches).toEqual([])
      })
   })

   describe('create perf', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should use the empty serial and not patch it', () => {
               const patchSerial = vitest.spyOn(Field_selectOne.prototype, 'patchSerial')
               const S = b.selectOneString_(['a', 'b', 'c'])
               const E = S.create()

               expect(E.serial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with a default value', () => {
            it('should use the default serial and not patch it', () => {
               const patchSerial = vitest.spyOn(Field_selectOne.prototype, 'patchSerial')
               const S = b.selectOneString_(['a', 'b', 'c'], { default: 'b' })
               const E = S.create()

               expect(E.serial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with an optional', () => {
            it('should not patch the serial', () => {
               const optionalPatchSerial = vitest.spyOn(Field_optional.prototype, 'patchSerial')
               const selectPatchSerial = vitest.spyOn(Field_selectOne.prototype, 'patchSerial')

               const S = b.selectOneString_(['a', 'b', 'c']).optional()
               const E = S.create()

               expect(E.serial).toBe(S.defaultSerial)
               expect(optionalPatchSerial).not.toHaveBeenCalled()
               expect(selectPatchSerial).not.toHaveBeenCalled()
            })
         })
      })
   })
})
