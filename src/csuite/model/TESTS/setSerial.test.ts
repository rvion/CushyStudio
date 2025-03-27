import { describe, expect, it } from 'vitest'

import { simpleBuilder as b } from '../../simple/SimpleFactory'

// ------------------------------------------------------------------------------
describe('setSerial', () => {
   it('works with valid serial', () => {
      const S1 = b.string({ default: '🔵A' })
      const E1 = S1.create()
      E1.ϟsetSerial({ $: 'str', value: '🟢B' })
      expect(E1.ϟvalue).toBe('🟢B')
   })

   it('works with nested fields', () => {
      const S1 = b.fields({
         a: b.fields({
            b: b.fields({
               c: b.string({ default: '🔵' }),
               d: b.int({ default: 1 }),
            }),
         }),
      })
      const E1 = S1.create()
      E1.ϟsetSerial({
         $: 'group',
         values_: {
            a: {
               $: 'group',
               values_: {
                  b: {
                     $: 'group',
                     values_: {
                        c: {
                           $: 'str',
                           value: '🟢',
                        },
                        d: {
                           $: 'number',
                           value: 2,
                        },
                     },
                  },
               },
            },
         },
      })
      expect(E1.ϟvalue.a.b.c).toBe('🟢')
      expect(E1.ϟvalue.a.b.d).toBe(2)
   })
})
