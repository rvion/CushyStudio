import { describe, expect, it } from 'vitest'

import { simpleBuilder as b } from '../../simple/SimpleFactory'
import { expectJSON } from './utils/expectJSON'

// ------------------------------------------------------------------------------
describe('assign to value object', () => {
   it('properly ensure value is properly set for every field', () => {
      const S1 = b.fields({
         int0: b.int(),
         int3: b.int({ default: 4 }),
         intOpt: b.int({ default: 5 }).optional(),
         intOpt2: b.int({ default: 8 }).optional(true),
         strEmpty: b.string(),
         strCoucou: b.string({ default: 'coucou' }),
         bool: b.bool(),
         boolTrue: b.bool({ default: true }),
         boolFalse: b.bool({ default: false }),
         _x: b.bool().hidden().publishSelfToChannel('<test>'),
         with: b.fields({
            b1: b.linkedFromChannelId('<test>', b.bool()),
            b2: b.linkedFromChannelId('<test>', b.bool()),
         }),
      })
      const E1 = S1.create()
      // VALUE
      expectJSON({
         bool: false,
         boolFalse: false,
         boolTrue: true,
         int0: 0,
         int3: 4,
         intOpt: null,
         intOpt2: 8,
         strCoucou: 'coucou',
         strEmpty: '',
         _x: false,
         with: {
            b1: false,
            b2: false,
         },
      }).toEqual(E1.zToValueJSON())

      // SERIAL
      expectJSON({
         $: 'group',
         values_: {
            int0: { $: 'number', value: 0 },
            int3: { $: 'number', value: 4 },
            strEmpty: { $: 'str', value: '' },
            strCoucou: { $: 'str', value: 'coucou' },
            bool: { $: 'bool', value: false },
            boolTrue: { $: 'bool', value: true },
            boolFalse: { $: 'bool', value: false },
            intOpt: {
               $: 'optional',
               n: { $: 'number', value: 5 },
            },
            intOpt2: {
               $: 'optional',
               y: { $: 'number', value: 8 },
            },
            with: {
               $: 'link',
               a: { $: 'bool', value: false },
               b: {
                  $: 'group',
                  values_: {
                     b1: { $: 'shared' },
                     b2: { $: 'shared' },
                  },
               },
            },
         },
      }).toMatchObject(E1.zToSerialJSON())
   })

   it('snapshots correctly', () => {
      const S = b.selectManyString(['a', 'b', 'c'])
      const E = S.create()

      E.zValue = ['a']
      const snap1 = E.zSaveSnapshot() // 💾 1
      expect(snap1 === E.zSerial).toBeFalsy()
      const { snapshot, ...serial } = E.zSerial
      expectJSON(snap1).toEqual(serial)

      E.zValue = ['b']
      E.zRevertToSnapshot() // ↩️
      expectJSON(E.zValue).toMatchObject(['a'])

      E.zValue.push('c')
      expectJSON(E.zValue).toMatchObject(['a', 'c'])

      E.zValue.push('c')
      expectJSON(E.zValue).toMatchObject(['a', 'c'])

      E.zRevertToSnapshot() // 🔴 Unclear what's this supposed to do
      // Either
      // expectJSON(E.value).toMatchObject(['a'])
      // Or
      expectJSON(E.zValue).toMatchObject([])
   })

   it('snapshots correctly v2', () => {
      const S = b.selectManyString(['a', 'b', 'c'])
      const E = S.create()

      E.zValue = ['a']
      E.zSaveSnapshot() // 💾 1

      E.zValue.push('b')
      E.zRevertToSnapshot() // ↩️
      E.zSaveSnapshot() // 💾 2
      expectJSON(E.zValue).toMatchObject(['a'])

      E.zValue.push('c')
      expectJSON(E.zValue).toMatchObject(['a', 'c'])

      E.zRevertToSnapshot() // ↩️ reset to 💾 2
      expectJSON(E.zValue).toMatchObject(['a'])

      expect(E.zSerial.snapshot?.snapshot).toBeUndefined()
   })

   it('Does not nest snapshots', () => {
      const S = b.int()
      const E = S.create()

      E.zValue = 3
      for (let i = 0; i < 10; ++i) {
         E.zRevertToSnapshot()
      }

      expect(E.zSerial.snapshot?.snapshot).toBeUndefined()
   })

   it('snapshots correctly v3', () => {
      const S = b.selectManyString(['a', 'b', 'c'])
      const E = S.create()

      E.zValue = ['a']
      E.zSaveSnapshot() // 💾 1

      E.zValue = ['b']
      E.zRevertToSnapshot()
      expectJSON(E.zValue).toMatchObject(['a'])

      E.zValue = ['a', 'c']
      expectJSON(E.zValue).toMatchObject(['a', 'c'])

      E.zRevertToSnapshot() // Revert to 💾 1 as expected
      expectJSON(E.zValue).toMatchObject([])
   })
})
