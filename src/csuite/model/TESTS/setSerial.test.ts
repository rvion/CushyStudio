import { describe, expect, it } from 'vitest'

import { simpleBuilder as b } from '../../simple/SimpleFactory'

// ------------------------------------------------------------------------------
describe('setSerial', () => {
   it('works with valid serial', () => {
      const S1 = b.string({ default: '🔵A' })
      const E1 = S1.create()
      E1.zSetSerial({ $: 'str', value: '🟢B' })
      expect(E1.zValue).toBe('🟢B')
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
      E1.zSetSerial({
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
      expect(E1.zValue.a.b.c).toBe('🟢')
      expect(E1.zValue.a.b.d).toBe(2)
   })
})
