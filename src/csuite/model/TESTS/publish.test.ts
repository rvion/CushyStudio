import { toJS } from 'mobx'
import { type Assertion, describe, expect as expect_, it } from 'vitest'

import { simpleFactory } from '../../simple/SimpleFactory'

// ------------------------------------------------------------------------------
describe('publish', () => {
   it('works with string', () => {
      const E = simpleFactory.document((f) =>
         f.fields({
            a: f.string({ default: 'test' }).publishToChannel('foo', (self) => self.ϟvalue),
            b: f.string().subscribeToChannel<string>('foo', (x, self) => (self.ϟvalue = x)),
         }),
      )
      expect(E.ϟvalue.a).toBe('test')
      expect(E.ϟvalue.b).toBe('test')
   })

   it('works with ints', () => {
      const E = simpleFactory.document((f) =>
         f.fields({
            a: f.int({ default: 8 }).publishToChannel('foo', (self) => self.ϟvalue),
            b: f.int({ default: 1 }).subscribeToChannel<number>('foo', (x, self) => (self.ϟvalue = x)),
         }),
      )
      expect(E.ϟvalue.a).toBe(8)
      expect(E.ϟvalue.b).toBe(8)
   })

   it('works regardless field order definition', () => {
      const E = simpleFactory.document((f) =>
         f.fields({
            b: f.string({ default: '🟡' }).subscribeToChannel<string>('foo', (x, self) => (self.ϟvalue = x)),
            a: f.string({ default: '🔵' }).publishToChannel('foo', (self) => self.ϟvalue),
         }),
      )
      expect(E.ϟvalue.a).toBe('🔵')
      expect(E.ϟvalue.b).toBe('🔵')

      // bonus test before weekend
      E.ϟfields.b.ϟvalue = '🟤'
      expect(E.ϟvalue.a).toBe('🔵')
      expect(E.ϟvalue.b).toBe('🟤')

      E.ϟfields.a.ϟvalue = '🟠'
      expect(E.ϟvalue.a).toBe('🟠')
      expect(E.ϟvalue.b).toBe('🟠')
   })
   function expect(a: any): Assertion<any> {
      // eslint-disable-next-line vitest/valid-expect
      return expect_(toJS(a))
   }
})
