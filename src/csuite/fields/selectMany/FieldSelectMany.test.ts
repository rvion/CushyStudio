import type { Patch } from '../../model/Patch'

import { describe, expect, it, vitest } from 'vitest'

// import { MsgPackR_packToString } from '../../../../../front/shared/packr'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'
import { simpleBuilder } from '../../simple/SimpleFactory'
import { Field_selectMany, type Field_selectMany_serial } from './FieldSelectMany'

const b = simpleBuilder

// eslint-disable-next-line vitest/no-commented-out-tests
// describe('array proxies', () => {
//    // it.skip('should correctly be packed by MsgPackr', () => {
//    //    // v1 Proxy with get
//    //    const v1Arr = new Proxy([1, 2, 3, 4, 5], {
//    //       get: (target, prop): any => {
//    //          return Reflect.get(target, prop)
//    //          // if (prop === 'constructor') return undefined
//    //          // if (prop === 'hasOwnProperty') return undefined
//    //       },
//    //    })
//    //    const v1 = MsgPackR_packToString(v1Arr)
//    //    console.log(`[🤠] v1`, v1Arr.length, JSON.stringify(v1))
//    //    // v2 Proxy empty
//    //    const v2Arr = new Proxy([1, 2, 3, 4, 5], {})
//    //    const v2 = MsgPackR_packToString(v2Arr)
//    //    console.log(`[🤠] v2`, v2Arr.length, JSON.stringify(v2))
//    //    // v3 base
//    //    const v3Arr = [1, 2, 3, 4, 5]
//    //    const v3 = MsgPackR_packToString(v3Arr)
//    //    console.log(`[🤠] v3`, v3Arr.length, JSON.stringify(v3))
//    //    // v4 mobx
//    //    const v4Arr = observable([1, 2, 3, 4, 5])
//    //    const v4 = MsgPackR_packToString(v4Arr)
//    //    console.log(`[🤠] v4`, v4Arr.length, JSON.stringify(v4))
//    // })
// })

describe('validation when values are invalid', () => {
   it('detect errors when value candidate is an array', () => {
      const serial: Z.Many_<any>['{serial}'] = { $: 'selectMany', values: ['❌'] }
      const schema = b.selectManyStrings(['x', 'y', 'z'])
      const entity = schema.create(serial)
      expect(entity.zIsValid).toBeFalsy()
      expect(entity.zAllErrorsIncludingChildrenErrors).toEqual([
         { path: '$', message: 'value ❌ (label: ❌) not in choices' },
      ])
   })
   it('detect errors when value candidate is an lambda', () => {
      const serial: Z.Many_<any>['{serial}'] = { $: 'selectMany', values: ['❌'] }
      const schema = b.selectManyDynamicStrings(() => ['x', 'y', 'z'])
      const entity = schema.create(serial)
      expect(entity.zIsValid).toBeFalsy()
      expect(entity.zAllErrorsIncludingChildrenErrors).toEqual([
         { path: '$', message: 'value ❌ (label: ❌) not in choices' },
      ])
   })
})

// ------------------------------------------------------------------------------
describe('FieldSelectMany', () => {
   it('works', () => {
      const S = b.selectManyString(['a', 'b', 'c'])
      const E = S.create()

      expectJSON(E.zValue).toEqual([])

      E.zValue = ['a']
      expectJSON(E.zValue).toEqual(['a'])

      E.zValue = ['b', 'c']
      expectJSON(E.zValue).toEqual(['b', 'c'])
   })

   it('works with defaults', () => {
      const S = b.selectManyString(['a', 'b', 'c'], { default: ['a'] })
      const E = S.create()

      expectJSON(E.zValue).toEqual(['a'])
   })

   it('works with legacy serials', () => {
      const S = b.selectManyString(['a', 'b', 'c'])
      const serial = { $: 'selectMany', values: [{ id: 'b' }, { id: 'c' }] }
      // @ts-expect-error: legacy serial injection
      const E = S.create(serial)

      expectJSON(E.zValue).toEqual(['b', 'c'])
   })

   it('can be created and set from a serial', () => {
      const S = b.selectManyString(['a', 'b', 'c'], { default: ['b'] })
      const ser1: (typeof S)['{serial}'] = { $: 'selectMany', values: ['b', 'c'] }
      const ser2: (typeof S)['{serial}'] = { $: 'selectMany', values: ['a'] }
      const E = S.create(ser1)

      expectJSON(E.zValue).toEqual(['b', 'c'])
      expect(E.zSerial === ser1).toBeTruthy()

      E.zSetSerial(ser2)
      expectJSON(E.zValue).toEqual(['a'])
      expect(E.zSerial === ser2).toBeTruthy()

      E.zSetSerial({ $: 'selectMany' })
      expectJSON(E.zValue).toEqual(['b'])
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const S = b.selectManyString(['a', 'b', 'c'], { default: undefined })
            const E1 = S.create()
            const E2 = S.create()

            expect(E1.zIsValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const S = b.selectManyString(['a', 'b', 'c'])
            const E1 = S.create()
            const E2 = S.create()

            E1.zValue = ['b', 'c']
            E2.zValue = ['b', 'c']

            expect(E1.zIsValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if the fields are set to different values', () => {
            const S = b.selectManyString(['a', 'b', 'c'])
            const E1 = S.create()
            const E2 = S.create()

            E1.zValue = ['b', 'c']
            E2.zValue = ['a', 'b']

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })

         it('should return false if one field is unset and the other is set', () => {
            const S = b.selectManyString(['a', 'b', 'c'], { default: undefined })
            const E1 = S.create()
            const E2 = S.create()

            E1.zValue = ['a', 'b']

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })

         it('should return false if values are the same but in different order', () => {
            const S = b.selectManyString(['a', 'b', 'c'])
            const E1 = S.create()
            const E2 = S.create()

            E1.zValue = ['b', 'c']
            E2.zValue = ['c', 'b']

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      it('should change value', () => {
         const S = b.selectManyString(['a', 'b', 'c'])
         const E1 = S.create()
         const E2 = S.create()

         E1.zValue = ['b', 'c']
         E2.zValue = ['a', 'b']

         const patches = E1.zGeneratePatches(E2) as Patch[]

         expect(patches).toEqual([
            {
               op: 'replace',
               fieldType: 'selectMany',
               fieldPath: '$',
               serialPath: 'values',
               value: ['b', 'c'],
            },
         ])

         E2.zApplyPatches(patches)

         expectJSON(E2.zValue).toEqual(['b', 'c'])
      })

      it('should not generate a patch for the query', () => {
         const S = b.selectManyString(['a', 'b', 'c'])
         const E1 = S.create()
         const E2 = S.create()

         E1.zValue = ['b', 'c']
         E1.query = 'b'
         E2.zValue = ['b', 'c']
         E2.query = 'c'

         const patches = E1.zGeneratePatches(E2)

         expectJSON(patches).toEqual([])
      })
   })

   describe('create perf', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should use the empty serial', () => {
               const patchSerial = vitest.spyOn(Field_selectMany.prototype, 'zPatchSerial')
               const S = b.selectMany_({
                  choices: ['a', 'b', 'c'],
                  getIdFromValue: (v) => v as any,
                  getValueFromId: (id) => id,
                  getOptionFromId: (id) => id,
               })
               const E = S.create()

               expect(patchSerial).not.toHaveBeenCalled()
               expect(E.zSerial).toBe(S.defaultSerial)
            })
         })

         describe('with a default value', () => {
            it('should use the default serial', () => {
               const patchSerial = vitest.spyOn(Field_selectMany.prototype, 'zPatchSerial')
               const S = b.selectManyString(['a', 'b', 'c'], { default: ['a'] })
               const E = S.create()

               expect(patchSerial).not.toHaveBeenCalled()
               expect(E.zSerial).toBe(S.defaultSerial)
            })

            it('should use the default serial (empty default)', () => {
               const patchSerial = vitest.spyOn(Field_selectMany.prototype, 'zPatchSerial')
               const S = b.selectManyString(['a', 'b', 'c'])
               const E = S.create()

               expect(patchSerial).not.toHaveBeenCalled()
               expect(E.zSerial).toBe(S.defaultSerial)
            })
         })
      })

      describe('with a serial', () => {
         it('should not patch the serial', () => {
            const patchSerial = vitest.spyOn(Field_selectMany.prototype, 'zPatchSerial')
            const S = b.selectManyString(['a', 'b', 'c'])
            const serial: Field_selectMany_serial<'a' | 'b' | 'c'> = { $: 'selectMany', values: ['b', 'c'] }
            const E = S.create(serial)

            expect(patchSerial).not.toHaveBeenCalled()
            expect(E.zSerial).toBe(serial)
         })
      })
   })
})
