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

      expect(E.ϟisSet).toBeFalsy()
      expectJSON(E.ϟvalue_unchecked).toBeUndefined()

      E.ϟvalue = 'a'
      expectJSON(E.ϟvalue).toEqual('a')

      E.ϟvalue = 'b'
      expectJSON(E.ϟvalue).toEqual('b')
   })

   it('works with defaults', () => {
      const S = b.selectOneString(['a', 'b', 'c'], { default: 'a' })
      const E = S.create()

      expectJSON(E.ϟvalue).toEqual('a')
   })

   it('works with legacy serials', () => {
      const S = b.selectOneString(['a', 'b', 'c'])
      const serial = { $: 'selectOne', val: { id: 'b' } }
      // @ts-expect-error: legacy serial injection
      const E = S.create(serial)

      expectJSON(E.ϟvalue).toEqual('b')
   })

   it('can be created and set from a serial', () => {
      const S = b.selectOneString(['a', 'b', 'c'], { default: 'b' })
      const ser1: (typeof S)['Ҩserial'] = { $: 'selectOne', val: 'c' }
      const ser2: (typeof S)['Ҩserial'] = { $: 'selectOne', val: 'a' }
      const E = S.create(ser1)

      expectJSON(E.ϟvalue).toEqual('c')
      expect(E.ϟserial === ser1).toBeTruthy()

      E.ϟsetSerial(ser2)
      expectJSON(E.ϟvalue).toEqual('a')
      expect(E.ϟserial === ser2).toBeTruthy()

      E.ϟsetSerial({ $: 'selectOne' })
      expectJSON(E.ϟvalue).toEqual('b')
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const S = b.selectOneString(['a', 'b', 'c'], { default: undefined })
            const E1 = S.create()
            const E2 = S.create()

            expect(E1.ϟisValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const S = b.selectOneString(['a', 'b', 'c'])
            const E1 = S.create()
            const E2 = S.create()

            E1.ϟvalue = 'b'
            E2.ϟvalue = 'b'

            expect(E1.ϟisValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const S = b.selectOneString(['a', 'b', 'c'], { default: undefined })
            const E1 = S.create()
            const E2 = S.create()

            E1.ϟvalue = 'a'

            expect(E1.ϟisValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const S = b.selectOneString(['a', 'b', 'c'])
            const E1 = S.create()
            const E2 = S.create()

            E1.ϟvalue = 'a'
            E2.ϟvalue = 'b'

            expect(E1.ϟisValueEqual(E2)).toBeFalsy()
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      it('should change the selected value', () => {
         const S = b.selectOneString(['a', 'b', 'c'], { default: 'a' })
         const E1 = S.create()
         const E2 = S.create()

         E1.ϟvalue = 'b'
         E2.ϟvalue = 'a'

         const patches = E1.ϟgeneratePatches(E2)

         E2.ϟapplyPatches(patches)

         expect(E2.ϟvalue as string).toBe('b' as string)
      })

      it('should not generate a patch for the query', () => {
         const S = b.selectOneString(['a', 'b', 'c'], { default: 'a' })
         const E1 = S.create()
         const E2 = S.create()

         E1.ϟvalue = 'a'
         E1.query = 'b'
         E1.ϟvalue = 'a'
         E1.query = 'c'

         const patches = E1.ϟgeneratePatches(E2)

         expectJSON(patches).toEqual([])
      })
   })

   describe('create perf', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should use the empty serial and not patch it', () => {
               const patchSerial = vitest.spyOn(Field_selectOne.prototype, 'ϟpatchSerial')
               const S = b.selectOneString_(['a', 'b', 'c'])
               const E = S.create()

               expect(E.ϟserial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with a default value', () => {
            it('should use the default serial and not patch it', () => {
               const patchSerial = vitest.spyOn(Field_selectOne.prototype, 'ϟpatchSerial')
               const S = b.selectOneString_(['a', 'b', 'c'], { default: 'b' })
               const E = S.create()

               expect(E.ϟserial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with an optional', () => {
            it('should not patch the serial', () => {
               const optionalPatchSerial = vitest.spyOn(Field_optional.prototype, 'ϟpatchSerial')
               const selectPatchSerial = vitest.spyOn(Field_selectOne.prototype, 'ϟpatchSerial')

               const S = b.selectOneString_(['a', 'b', 'c']).optional()
               const E = S.create()

               expect(E.ϟserial).toBe(S.defaultSerial)
               expect(optionalPatchSerial).not.toHaveBeenCalled()
               expect(selectPatchSerial).not.toHaveBeenCalled()
            })
         })
      })
   })
})
