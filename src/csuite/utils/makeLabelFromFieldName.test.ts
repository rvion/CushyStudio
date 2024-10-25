import { describe, expect, it } from 'bun:test'

import { makeLabelFromPrimitiveValue } from './makeLabelFromFieldName'

// ------------------------------------------------------------------------------
describe('makeLabelFromPrimitiveValue', () => {
   it('works', () => {
      expect(makeLabelFromPrimitiveValue('abc')).toBe('Abc')
      expect(makeLabelFromPrimitiveValue('00abc')).toBe('00 abc')
      expect(makeLabelFromPrimitiveValue('1')).toBe('1')
      expect(makeLabelFromPrimitiveValue(1)).toBe('1')
      expect(makeLabelFromPrimitiveValue('true')).toBe('True')
      expect(makeLabelFromPrimitiveValue(true)).toBe('True')
   })
})
