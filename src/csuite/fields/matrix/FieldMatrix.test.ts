import { describe, expect, it, vitest } from 'vitest'

import { CSchema } from '../../model/CSchema'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'
import { simpleBuilder as b } from '../../simple/SimpleFactory'
import { Field_matrix } from './FieldMatrix'

describe('FieldMatrix', () => {
   it('work', () => {
      const S1 = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
      const E1 = S1.create()
      expect(E1.cols).toHaveLength(2)
      expectJSON(E1.cols).toEqual(['x', 'y'])
      expectJSON(E1.rows).toEqual(['a', 'b'])
      expectJSON(E1.value).toEqual([])

      const S2 = S1.withConfig({ default: [{ row: 'a', col: 'x' }] })
      const E2 = S2.create()
      expectJSON(E2.value).toMatchObject([{ row: 'a', col: 'x' }])
      E2.setCol('y', true)
      expectJSON(E2.value).toMatchObject([
         { row: 'a', col: 'x' },
         { row: 'a', col: 'y' },
         { row: 'b', col: 'y' },
      ])
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const S = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
            const E1 = S.create()
            const E2 = S.create()

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const S = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
            const E1 = S.create()
            const E2 = S.create()

            E1.setCol('x', true)
            E2.setCol('x', true)

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const S = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
            const E1 = S.create()
            const E2 = S.create()

            E1.setCol('x', true)

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const S = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
            const E1 = S.create()
            const E2 = S.create()

            E1.setCol('x', true)
            E2.setCol('y', true)

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })

         it('should return false if the other field is not a matrix', () => {
            const S = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
            const E1 = S.create()
            const E2 = b.text({ default: '8' }).create()

            E1.setCol('x', true)

            expect(E1.isValueEqual(E2 as any)).toBeFalsy()
         })
      })
   })

   describe('create perf', () => {
      describe('without serial', () => {
         describe('without a default value', () => {
            it('should use the empty serial', () => {
               const patchSerial = vitest.spyOn(Field_matrix.prototype, 'patchSerial')
               const S = CSchema.new(Field_matrix, { rows: ['a', 'b'], cols: ['x', 'y'] })
               const E = S.create()

               expect(patchSerial).not.toHaveBeenCalled()
               expect(E.serial).toBe(S.defaultSerial)
            })
         })

         describe('with a default value', () => {
            it('should use the empty serial', () => {
               const patchSerial = vitest.spyOn(Field_matrix.prototype, 'patchSerial')
               const S = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'], default: [{ row: 'a', col: 'x' }] })
               const E = S.create()

               expect(patchSerial).not.toHaveBeenCalled()
               expect(E.serial).toBe(S.defaultSerial)
            })
         })
      })
   })
})
