import { toJS } from 'mobx'
import { type Assertion, describe, expect as expect_, it } from 'vitest'

import { simpleFactory } from '../../index'

// ------------------------------------------------------------------------------
describe('publish', () => {
   it('works with string', () => {
      const E = simpleFactory.document((f) =>
         f.fields({
            a: f.string({ default: 'test' }).publishToChannel('foo', (self) => self.value),
            b: f.string().subscribeToChannel<string>('foo', (x, self) => (self.value = x)),
         }),
      )
      expect(E.value.a).toBe('test')
      expect(E.value.b).toBe('test')
   })

   it('works with ints', () => {
      const E = simpleFactory.document((f) =>
         f.fields({
            a: f.int({ default: 8 }).publishToChannel('foo', (self) => self.value),
            b: f.int({ default: 1 }).subscribeToChannel<number>('foo', (x, self) => (self.value = x)),
         }),
      )
      expect(E.value.a).toBe(8)
      expect(E.value.b).toBe(8)
   })

   it('works regardless field order definition', () => {
      const E = simpleFactory.document((f) =>
         f.fields({
            b: f.string({ default: '🟡' }).subscribeToChannel<string>('foo', (x, self) => (self.value = x)),
            a: f.string({ default: '🔵' }).publishToChannel('foo', (self) => self.value),
         }),
      )
      expect(E.value.a).toBe('🔵')
      expect(E.value.b).toBe('🔵')

      // bonus test before weekend
      E.fields.b.value = '🟤'
      expect(E.value.a).toBe('🔵')
      expect(E.value.b).toBe('🟤')

      E.fields.a.value = '🟠'
      expect(E.value.a).toBe('🟠')
      expect(E.value.b).toBe('🟠')
   })
   function expect(a: any): Assertion<any> {
      // eslint-disable-next-line vitest/valid-expect
      return expect_(toJS(a))
   }
})
