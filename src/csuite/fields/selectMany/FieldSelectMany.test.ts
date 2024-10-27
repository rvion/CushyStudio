import { describe, expect, it } from 'bun:test'

import { simpleBuilder } from '../../index'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('FieldSelectMany', () => {
   it('works', () => {
      const S = b.selectManyString(['a', 'b', 'c'])
      const E = S.create()

      expectJSON(E.value).toEqual([])

      E.value = ['a']
      expectJSON(E.value).toEqual(['a'])

      E.value = ['b', 'c']
      expectJSON(E.value).toEqual(['b', 'c'])
   })

   it('works with defaults', () => {
      const S = b.selectManyString(['a', 'b', 'c'], { default: ['a'] })
      const E = S.create()

      expectJSON(E.value).toEqual(['a'])
   })

   it('works with legacy serials', () => {
      const S = b.selectManyString(['a', 'b', 'c'])
      const serial = { $: 'selectMany', values: [{ id: 'b' }, { id: 'c' }] }
      // @ts-expect-error: legacy serial injection
      const E = S.create(serial)

      expectJSON(E.value).toEqual(['b', 'c'])
   })

   it('can be created and set from a serial', () => {
      const S = b.selectManyString(['a', 'b', 'c'], { default: ['b'] })
      const ser1: (typeof S)['$Serial'] = { $: 'selectMany', values: ['b', 'c'] }
      const ser2: (typeof S)['$Serial'] = { $: 'selectMany', values: ['a'] }
      const E = S.create(ser1)

      expectJSON(E.value).toEqual(['b', 'c'])
      expect(E.serial === ser1).toBeTrue()

      E.setSerial(ser2)
      expectJSON(E.value).toEqual(['a'])
      expect(E.serial === ser2).toBeTrue()

      E.setSerial({ $: 'selectMany' })
      expectJSON(E.value).toEqual(['b'])
   })
})
