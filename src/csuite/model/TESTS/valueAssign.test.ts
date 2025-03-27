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
      expectJSON(E1.ϟvalue.str1).toBe('🔵')
      expectJSON(E1.ϟfields.str1.ϟvalue).toBe('🔵')

      E1.ϟvalue.str1 = '🟡'
      expectJSON(E1.ϟvalue.str1).toBe('🟡')
      expectJSON(E1.ϟfields.str1.ϟvalue).toBe('🟡')
   })

   it('assign to List.value separate items (string)', () => {
      const S1 = b.string({ default: '🔵' }).list({ min: 3 })
      const E1 = S1.create()
      expectJSON(E1.ϟvalue).toEqual(['🔵', '🔵', '🔵'])

      E1.ϟvalue[1] = '🟡'
      expectJSON(E1.ϟvalue).toEqual(['🔵', '🟡', '🔵'])
      expectJSON(E1.ϟserial).toMatchObject({
         $: 'list',
         items_: [
            { $: 'str', value: '🔵' },
            { $: 'str', value: '🟡' },
            { $: 'str', value: '🔵' },
         ],
         keys: [E1.items[0]?.ϟmountKey, E1.items[1]?.ϟmountKey, E1.items[2]?.ϟmountKey],
      })
   })
})
