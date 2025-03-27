import { describe, it } from 'vitest'

import { simpleBuilder as b } from '../../simple/SimpleFactory'
import { expectJSON } from './utils/expectJSON'

// ------------------------------------------------------------------------------
describe('assign to value object', () => {
   it('assign to Group.value separate fields', () => {
      const S1 = b.fields({
         str1: b.string({ default: '🔵' }),
      })
      const E1 = S1.create()
      expectJSON(E1.zValue.str1).toBe('🔵')
      expectJSON(E1.zFields.str1.zValue).toBe('🔵')

      E1.zValue.str1 = '🟡'
      expectJSON(E1.zValue.str1).toBe('🟡')
      expectJSON(E1.zFields.str1.zValue).toBe('🟡')
   })

   it('assign to List.value separate items (string)', () => {
      const S1 = b.string({ default: '🔵' }).list({ min: 3 })
      const E1 = S1.create()
      expectJSON(E1.zValue).toEqual(['🔵', '🔵', '🔵'])

      E1.zValue[1] = '🟡'
      expectJSON(E1.zValue).toEqual(['🔵', '🟡', '🔵'])
      expectJSON(E1.zSerial).toMatchObject({
         $: 'list',
         items_: [
            { $: 'str', value: '🔵' },
            { $: 'str', value: '🟡' },
            { $: 'str', value: '🔵' },
         ],
         keys: [E1.items[0]?.zMountKey, E1.items[1]?.zMountKey, E1.items[2]?.zMountKey],
      })
   })
})
