/* eslint-disable vitest/require-to-throw-message */
import type { Patch } from '../../model/Patch'

import { toJS } from 'mobx'
import { describe, expect, it, vitest } from 'vitest'

import { expectJSON } from '../../model/TESTS/utils/expectJSON'
import { simpleBuilder as b } from '../../simple/SimpleFactory'
import { Field_optional } from '../optional/FieldOptional'
import { Field_string } from '../string/FieldString'
import {
   Field_list,
   type Field_list_config,
   type Field_list_ItemID,
   type Field_list_patch,
   type Field_list_serial,
} from './FieldList'

describe('FieldList', () => {
   const S1 = b.string({ default: '🔵' }).list({ defaultLength: 3 })
   const S123 = b.string({ default: '🔵' }).list()

   describe('caching', () => {
      it('works', () => {
         let suffix = ''
         const doc = b
            .fields(() => {
               suffix += '!'
               return { a: b.string({ default: suffix }) }
            })
            .list({ min: 3 })
            .create()
         expect(suffix).toBe('!')
         expectJSON(doc.ϟvalue).toMatchObject([{ a: '!' }, { a: '!' }, { a: '!' }])
      })
   })

   describe('isSet', () => {
      it('is true with list()', () => {
         const S_def = b.int().list()
         const E_def = S_def.create()
         expect(E_def.ϟisSet).toBeTruthy()
      })

      it('is false with list_()', () => {
         const S_nodef = b.int().list_()
         const E_nodef = S_nodef.create()
         expect(E_nodef.ϟisSet).toBe(false)
      })

      type VisualValid = '✅' | '❌'
      type VisualSet = '🛟' | '🟢'
      it('is correct for all of the combination of (min, max, defaultLen)', () => {
         const configsWithExpectedIsSetAndIsValid: [
            //
            VisualSet,
            VisualValid,
            Omit<Field_list_config<any>, 'element'>,
         ][] = [
            // Set, Valid, Config,
            // (min=0, max=0, default=0)
            ['🛟', '❌', { min: 0 }], // too
            ['🛟', '❌', { max: 0 }],
            ['🛟', '❌', { min: 0, max: 0 }],
            ['🟢', '✅', { defaultLength: 0 }],
            ['🟢', '✅', { defaultLength: 0, min: 0 }],
            ['🟢', '✅', { defaultLength: 0, max: 0 }],
            ['🟢', '✅', { defaultLength: 0, min: 0, max: 0 }],

            // (min=3, max=6, default=0)
            ['🛟', '❌', { min: 3 }],
            ['🛟', '❌', { max: 6 }],
            ['🛟', '❌', { min: 3, max: 6 }],
            ['🟢', '✅', { defaultLength: 0 }],
            ['🟢', '❌', { defaultLength: 0, min: 3 }], // FAILS
            ['🟢', '✅', { defaultLength: 0, max: 6 }],
            ['🟢', '❌', { defaultLength: 0, min: 3, max: 6 }],

            // (min=3, max=6, default=5)
            ['🛟', '❌', { min: 3 }],
            ['🛟', '❌', { max: 6 }],
            ['🛟', '❌', { min: 3, max: 6 }],
            ['🟢', '✅', { defaultLength: 5 }],
            ['🟢', '✅', { defaultLength: 5, min: 3 }],
            ['🟢', '✅', { defaultLength: 5, max: 6 }],
            ['🟢', '✅', { defaultLength: 5, min: 3, max: 6 }],

            // (min=3, max=6, default=7)
            ['🛟', '❌', { min: 3 }],
            ['🛟', '❌', { max: 6 }],
            ['🛟', '❌', { min: 3, max: 6 }],
            ['🟢', '✅', { defaultLength: 7 }],
            ['🟢', '✅', { defaultLength: 7, min: 3 }],
            ['🟢', '❌', { defaultLength: 7, max: 6 }],
            ['🟢', '❌', { defaultLength: 7, min: 3, max: 6 }],
         ]

         for (const TC of configsWithExpectedIsSetAndIsValid) {
            const [set, valid, config] = TC
            const S = b.int().list_({
               min: config.min,
               max: config.max,
               defaultLength: config.defaultLength,
            })
            const E = S.create()
            expect({
               TC,
               set: E.ϟisSet,
               valid: E.ϟisValid,
            }).toEqual({
               TC,
               set: set === '🟢',
               valid: valid === '✅',
            })
         }
      })
   })

   describe('addItem', () => {
      it('adds an item at the right index', () => {
         const S = b.int().list({ min: 3 })
         const E = S.create()
         expect(E.ϟvalue).toHaveLength(3)
         expect(E.ϟvalue[0]).toBe(0)
         expect(E.ϟvalue[1]).toBe(0)
         expect(E.ϟvalue[2]).toBe(0)
         // 🔴 proxy error when using `expect`
         // VVVVV
         expectJSON(E.ϟvalue).toEqual([0, 0, 0])

         E.addItem({ at: 1, value: 8 })
         expectJSON(E.ϟvalue).toEqual([0, 8, 0, 0])
         expectJSON(E.ϟserial).toMatchObject({
            $: 'list',
            items_: [
               { $: 'number', value: 0 },
               { $: 'number', value: 8 },
               { $: 'number', value: 0 },
               { $: 'number', value: 0 },
            ],
            keys: [
               E.items[0]?.ϟmountKey,
               E.items[1]?.ϟmountKey,
               E.items[2]?.ϟmountKey,
               E.items[3]?.ϟmountKey,
            ],
         })
      })

      it('adds an item at the end', () => {
         const S = b.int().list({ min: 1 })
         const E = S.create()

         E.addItem({ value: 8 })
         expectJSON(E.ϟvalue).toEqual([0, 8])
         expectJSON(E.ϟserial).toMatchObject({
            $: 'list',
            items_: [
               { $: 'number', value: 0 },
               { $: 'number', value: 8 },
            ],
            keys: [E.items[0]?.ϟmountKey, E.items[1]?.ϟmountKey],
         })
      })
   })
   describe('tupples', () => {
      it('works', () => {
         const S2 = b.list({
            min: 2,
            element: (x) => {
               if (x % 2 === 0) return b.int()
               return b.string()
            },
         })
         const a = S2.create()
         expect(a).toHaveLength(2)
         expectJSON(a.ϟvalue).toEqual([0, ''])

         a.ϟsetValue([1, 2])
         expectJSON(a.ϟvalue).toEqual([1, '2'])
      })
   })

   // INSTANCIATION -------------------
   describe('instanciation', () => {
      it('works without default', () => {
         const E1 = S123.create()
         expectJSON(E1.ϟvalue).toEqual([])
      })

      it('works WITH default', () => {
         const S1 = b.string({ default: '🔵' }).list({ defaultLength: 3 })
         const E1 = S1.create()
         expectJSON(E1.ϟvalue).toEqual(['🔵', '🔵', '🔵'])
         expect(Object.values(E1.ϟserial.items_ ?? {})).toEqual([
            { $: 'str', value: '🔵' },
            { $: 'str', value: '🔵' },
            { $: 'str', value: '🔵' },
         ])
      })
   })

   // SET SERIAL ----------------------
   describe('setSerial', () => {
      it('works on a set field', () => {
         const S1 = b.string({ default: '🔵' }).list({ defaultLength: 3 })
         const E1 = S1.create()
         expectJSON(E1.ϟvalue).toEqual(['🔵', '🔵', '🔵'])
         expect(E1).toHaveLength(3)
         const serial: Field_list_serial<Z.String> = {
            $: 'list' as const,
            items_: [
               { $: 'str' as const, value: '🔵' },
               { $: 'str' as const, value: '🟢' },
            ],
            keys: ['UUID1' as Field_list_ItemID, 'UUID2' as Field_list_ItemID],
         }

         E1.ϟsetSerial(serial)
         expect(E1.ϟserial === serial).toBeTruthy()
         expect(E1).toHaveLength(2)
         expectJSON(E1.ϟvalue).toEqual(['🔵', '🟢'])
         expect(toJS(E1.ϟserial)).toMatchObject(serial)
         expect(E1.items[0]?.ϟmountKey).toBe('UUID1')
         expect(E1.items[1]?.ϟmountKey).toBe('UUID2')
      })

      it('works on an unset field', () => {
         const S1 = b.string_().list()
         const E1 = S1.create()

         expect(E1).toHaveLength(0)

         const serial: Field_list_serial<Z.String> = {
            $: 'list' as const,
            items_: [
               { $: 'str' as const, value: '🔵' },
               { $: 'str' as const, value: '🟢' },
            ],
            keys: ['UUID1' as Field_list_ItemID, 'UUID2' as Field_list_ItemID],
         }

         E1.ϟsetSerial(serial)
         expect(E1.ϟserial === serial).toBeTruthy()
         expect(E1).toHaveLength(2)
         expectJSON(E1.ϟvalue).toEqual(['🔵', '🟢'])
         expect(toJS(E1.ϟserial)).toMatchObject(serial)
         expect(E1.items[0]?.ϟmountKey).toBe('UUID1')
         expect(E1.items[1]?.ϟmountKey).toBe('UUID2')
      })
   })

   describe('setValue', () => {
      it('works', () => {
         const E1 = S1.create()
         expectJSON(E1.ϟvalue).toEqual(['🔵', '🔵', '🔵'])
         expect(E1).toHaveLength(3)
         E1.ϟvalue = ['🔵', '🟢']
         expect(E1).toHaveLength(2)
         expectJSON(E1.ϟvalue).toEqual(['🔵', '🟢'])
         expect(Object.values(E1.ϟserial.items_ ?? {})).toEqual([
            { $: 'str', value: '🔵' },
            { $: 'str', value: '🟢' },
         ])
      })

      it('updates the serial without touching the old one', () => {
         const S1 = b.string({ default: '🔵' }).list({ defaultLength: 3 })
         const E1 = S1.create()
         const oldSerial = E1.ϟserial
         expect(Object.values(oldSerial.items_ ?? {})).toHaveLength(3)
         E1.ϟvalue = ['🔵', '🟢']
         expect(Object.values(oldSerial.items_ ?? {})).toHaveLength(3)
         const newSerial = E1.ϟserial
         expect(Object.values(newSerial.items_ ?? {})).toHaveLength(2)
         expect(toJS(newSerial)).toMatchObject({
            $: 'list' as const,
            items_: [
               { $: 'str', value: '🔵' },
               { $: 'str', value: '🟢' },
            ],
            keys: [E1.items[0]?.ϟmountKey, E1.items[1]?.ϟmountKey],
         })
      })
   })

   // STRUCTURAL SHARING --------------
   it('generate a new serial for each field', () => {
      const E1 = S1.create()
      const E2 = S1.create(E1.ϟserial)

      // same shape
      expect(E1.items).toHaveLength(3)
      expect(E1.ϟserial).toEqual(E2.ϟserial)
      expect(E1.at(1)!.ϟserial).toEqual(E2.at(1)!.ϟserial)

      // same refs
      expect(E1.ϟserial === E2.ϟserial).toBeTruthy()
      expect(E1.at(1)!.ϟserial === E2.at(1)!.ϟserial).toBeTruthy()
   })

   // EFFECTS -------------------------
   it.skip('doesnt apply serial effect nor value effect on instanciation', () => {
      // 🔴 TODO
   })

   describe('value proxy', () => {
      it('is mutable', () => {
         const S2 = b.int({ default: 3 }).list({ defaultLength: 1 })
         const a = S2.create()
         expect(a).toHaveLength(1)
         expectJSON(a.ϟvalue).toEqual([3])

         a.ϟvalue[0] = 8

         expect(a).toHaveLength(1)
         expectJSON(a.ϟvalue).toEqual([8])
      })

      it('can ADD/PUSH/POP/SPLICE/... items at the end/start/middle/...', () => {
         const S2 = b.int({ default: 3 }).list({ defaultLength: 1 })
         const a = S2.create()
         expectJSON(a.ϟvalue).toEqual([3])

         a.ϟvalue[1] = 8
         expectJSON(a.ϟvalue).toEqual([3, 8])

         a.ϟvalue.push(9)
         expectJSON(a.ϟvalue).toEqual([3, 8, 9])

         a.ϟvalue.pop()
         expectJSON(a.ϟvalue).toEqual([3, 8])

         a.ϟvalue.unshift(4)
         expectJSON(a.ϟvalue).toEqual([4, 3, 8])

         a.ϟvalue.shift()
         expectJSON(a.ϟvalue).toEqual([3, 8])
      })

      it('can .removeAllItems()', () => {
         const S2 = b.int({ default: 3 }).list({ min: 3 })
         const a = S2.create()
         expectJSON(a.ϟvalue).toEqual([3, 3, 3])

         a.ϟvalue.push(8)
         a.ϟvalue.push(8)
         expectJSON(a.ϟvalue).toEqual([3, 3, 3, 8, 8])

         a.removeAllItems()
         expectJSON(a.ϟvalue).toEqual([3, 3, 3])
      })

      describe('map', () => {
         it('should map items', () => {
            const S2 = b.int({ default: 3 }).list({ min: 3 })
            const a = S2.create()
            expectJSON(a.ϟvalue).toEqual([3, 3, 3])
            const r = a.ϟvalue.map((x) => x + 1)

            expect(r).toEqual([4, 4, 4])
         })
      })

      describe('filter', () => {
         it('should filter items', () => {
            const S = b.int().list()
            const f = S.create()

            f.ϟvalue = [1, 2, 3, 4, 5, 6]
            expectJSON(f.ϟvalue).toEqual([1, 2, 3, 4, 5, 6])

            const filtered = f.ϟvalue.filter((x) => x > 3)
            expect(filtered).toEqual([4, 5, 6])
         })
      })
   })

   // RESET ---------------------------
   it('field.reset() should always yield same serial as schema.create(null) except for updatedAt', () => {
      const S2 = b.int({ default: 3 }).list({ min: 3 })
      const a1 = S2.create()
      expect(a1).toHaveLength(3)

      // set value then reset
      const a2 = S2.create(a1.ϟserial)
      a2.ϟvalue[3] = 8
      expectJSON(a2.ϟvalue).toEqual([3, 3, 3, 8])
      expect(a2).toHaveLength(4)

      // reset
      a2.ϟreset()
      expect(a2).toHaveLength(3)

      // should be same serial since we reset
      expect(Object.values(a2.ϟserial.items_ ?? {})).toEqual(Object.values(a1.ϟserial.items_ ?? {}))
      // expect(toJS(a1.serial)).toEqual(toJS(a2.serial))
   })

   describe('.moveItem', () => {
      it('properly update indexes when moving an item one index on the right', () => {
         const S = b.int().list({ defaultLength: 8 })
         const E = S.create()
         E.ϟvalue = E.ϟvalue.map((_, ix) => ix)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
         E.moveItem(3, 4)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 4, 3, 5, 6, 7])
         expect(E.ϟserial.keys as any[]).toEqual([
            E.items[0]?.ϟmountKey,
            E.items[1]?.ϟmountKey,
            E.items[2]?.ϟmountKey,
            E.items[3]?.ϟmountKey,
            E.items[4]?.ϟmountKey,
            E.items[5]?.ϟmountKey,
            E.items[6]?.ϟmountKey,
            E.items[7]?.ϟmountKey,
         ])
      })

      it('properly update indexes when moving an item three indices on the right', () => {
         const S = b.int().list({ defaultLength: 8 })
         const E = S.create()
         E.ϟvalue = E.ϟvalue.map((_, ix) => ix)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
         E.moveItem(3, 6)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 4, 5, 6, 3, 7])
         expect(E.ϟserial.keys as any[]).toEqual([
            E.items[0]?.ϟmountKey,
            E.items[1]?.ϟmountKey,
            E.items[2]?.ϟmountKey,
            E.items[3]?.ϟmountKey,
            E.items[4]?.ϟmountKey,
            E.items[5]?.ϟmountKey,
            E.items[6]?.ϟmountKey,
            E.items[7]?.ϟmountKey,
         ])
      })

      it('properly update indexes when moving an item one index on the left', () => {
         const S = b.int().list({ defaultLength: 8 })
         const E = S.create()
         E.ϟvalue = E.ϟvalue.map((_, ix) => ix)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
         E.moveItem(4, 3)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 4, 3, 5, 6, 7])
         expect(E.ϟserial.keys as any[]).toEqual([
            E.items[0]?.ϟmountKey,
            E.items[1]?.ϟmountKey,
            E.items[2]?.ϟmountKey,
            E.items[3]?.ϟmountKey,
            E.items[4]?.ϟmountKey,
            E.items[5]?.ϟmountKey,
            E.items[6]?.ϟmountKey,
            E.items[7]?.ϟmountKey,
         ])
      })

      it('properly update indexes when moving an item three indices on the left', () => {
         const S = b.int().list({ defaultLength: 8 })
         const E = S.create()
         E.ϟvalue = E.ϟvalue.map((_, ix) => ix)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
         E.moveItem(6, 3)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 6, 3, 4, 5, 7])
         expect(E.ϟserial.keys as any[]).toEqual([
            E.items[0]?.ϟmountKey,
            E.items[1]?.ϟmountKey,
            E.items[2]?.ϟmountKey,
            E.items[3]?.ϟmountKey,
            E.items[4]?.ϟmountKey,
            E.items[5]?.ϟmountKey,
            E.items[6]?.ϟmountKey,
            E.items[7]?.ϟmountKey,
         ])
      })
   })

   describe('.splice', () => {
      it('properly update indexes', () => {
         const S = b.int().list({ defaultLength: 8 })
         const E = S.create()
         E.ϟvalue = E.ϟvalue.map((_, ix) => ix)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
         E.splice(3, 2)
         expectJSON(E.ϟvalue).toEqual([0, 1, 2, 5, 6, 7])

         E.items.forEach((item) => {
            expect(item.ϟmountKey).toMatch(/^[0-9a-z_-]{6}$/i)
         })

         expect(E.ϟserial.keys as any[]).toEqual([
            E.items[0]?.ϟmountKey,
            E.items[1]?.ϟmountKey,
            E.items[2]?.ϟmountKey,
            E.items[3]?.ϟmountKey,
            E.items[4]?.ϟmountKey,
            E.items[5]?.ϟmountKey,
         ])
      })
   })

   it('properly forwards value mode through proxy', () => {
      const S = b.string_().list({ defaultLength: 3 })
      const E = S.create()
      E.ϟvalue[0] = 'zero'

      expect(E.ϟvalue_unchecked[0]).toBe('zero')
      expect(E.ϟvalue_unchecked[1]).toBeUndefined()
      expect(E.ϟvalue_unchecked[2]).toBeUndefined()
      expect(E.ϟvalue_unchecked.map((x) => x)).toEqual(['zero', undefined, undefined])

      expect(E.ϟvalue[0]).toBe('zero')
      expect(() => E.ϟvalue[1]).toThrow()
      expect(() => E.ϟvalue[2]).toThrow()
      expect(() => E.ϟvalue.map((x) => x)).toThrow()

      expect(E.ϟvalue_or_zero[0]).toBe('zero')
      expect(E.ϟvalue_or_zero[1]).toBe('')
      expect(E.ϟvalue_or_zero[2]).toBe('')
      expect(E.ϟvalue_or_zero.map((x) => x)).toEqual(['zero', '', ''])
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are undefined', () => {
            const field = b.string({}).list({ defaultLength: 3 }).create()
            const field2 = b.string({}).list({ defaultLength: 3 }).create()

            expect(field.ϟisValueEqual(field2)).toBeTruthy()
         })

         it('should return true if both fields are equal', () => {
            const field = b.string({}).list({ defaultLength: 3 }).create()
            field.ϟvalue = ['One', 'Two', 'Three']
            const field2 = b.string({}).list({ defaultLength: 3 }).create()
            field2.ϟvalue = ['One', 'Two', 'Three']

            expect(field.ϟisValueEqual(field2)).toBeTruthy()
         })
      })

      describe('difference', () => {
         it('should return false if both fields are different', () => {
            const field = b.string({}).list({ defaultLength: 3 }).create()
            field.ϟvalue = ['One', 'Two', 'Three']
            const field2 = b.string({}).list({ defaultLength: 3 }).create()
            field2.ϟvalue = ['One', 'Two', 'Four']

            expect(field.ϟisValueEqual(field2)).toBe(false)
         })

         it('should return false if one field is undefined and the other is not', () => {
            const field = b.string({}).list({ defaultLength: 3 }).create()
            const field2 = b.string({}).list({ defaultLength: 3 }).create()
            field2.ϟvalue = ['One', 'Two', 'Three']
            expect(field.ϟisValueEqual(field2)).toBe(false)
         })

         it('should return false if types are different', () => {
            const field = b.string({}).list({ defaultLength: 3 }).create()
            field.ϟvalue = ['One', 'Two', 'Three']
            const field2 = b.string().create()
            field2.ϟvalue = 'One'

            expect(field.ϟisValueEqual(field2 as any)).toBe(false)
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      describe('when a child is modified', () => {
         it('should generate a patch for the modified child', () => {
            const schema = b.string().list()
            const field1 = schema.create()
            field1.ϟvalue = ['One', 'Two', 'Three']
            const field2 = field1.ϟcloneTheWholeTree()

            field1.ϟvalue[1] = 'Four'

            const patches = field1.ϟgeneratePatches(field2) as Patch[]

            expect(patches).toEqual([
               {
                  op: 'replace',
                  fieldPath: `$.${field1.items[1]!.ϟmountKey}`,
                  serialPath: 'value',
                  value: 'Four',
                  fieldType: 'str',
               },
            ])

            field2.ϟapplyPatches(patches)
            expectJSON(field2.ϟvalue).toEqual(['One', 'Four', 'Three'])
            expect(field2.ϟserial.keys).toEqual(field1.ϟserial.keys as any)
            expect(field2.ϟserial.items_).toEqual(field1.ϟserial.items_ as any)
         })

         it('should not overwrite the other children', () => {
            const schema = b.string().list()
            const field1 = schema.create()
            field1.ϟvalue = ['One', 'Two', 'Three']
            const field2 = field1.ϟcloneTheWholeTree()

            field1.ϟvalue[1] = 'PATCHED'

            const patches = field1.ϟgeneratePatches(field2) as Patch[]

            expect(patches).toEqual([
               {
                  op: 'replace',
                  fieldType: 'str',
                  fieldPath: `$.${field1.items[1]!.ϟmountKey}`,
                  serialPath: 'value',
                  value: 'PATCHED',
               },
            ])

            field2.ϟvalue[0] = 'MODIFIED'
            field2.ϟapplyPatches(patches)
            expectJSON(field2.ϟvalue).toEqual(['MODIFIED', 'PATCHED', 'Three'])
         })

         it('should not remove inserted children', () => {
            const schema = b.string().list()
            const field1 = schema.create()
            field1.ϟvalue = ['One', 'Two', 'Three']
            const field2 = field1.ϟcloneTheWholeTree()

            field1.ϟvalue[1] = 'PATCHED'

            const patches = field1.ϟgeneratePatches(field2) as Patch[]

            expect(patches).toEqual([
               {
                  op: 'replace',
                  fieldPath: `$.${field1.items[1]!.ϟmountKey}`,
                  serialPath: 'value',
                  value: 'PATCHED',
                  fieldType: 'str',
               },
            ])

            field2.push('INSERTED')
            field2.ϟapplyPatches(patches)
            expectJSON(field2.ϟvalue).toEqual(['One', 'PATCHED', 'Three', 'INSERTED'])
         })

         it('should not do anything if the given field has been removed', () => {
            const schema = b.string().list()
            const field1 = schema.create()
            field1.ϟvalue = ['One', 'Two', 'Three']
            const field2 = field1.ϟcloneTheWholeTree()

            field1.ϟvalue[1] = 'PATCHED'

            const patches = field1.ϟgeneratePatches(field2) as Patch[]

            expect(patches).toEqual([
               {
                  op: 'replace',
                  fieldPath: `$.${field1.items[1]!.ϟmountKey}`,
                  fieldType: 'str',
                  serialPath: 'value',
                  value: 'PATCHED',
               },
            ])

            field2.removeItemAt(1)
            field2.ϟapplyPatches(patches)
            expectJSON(field2.ϟvalue).toEqual(['One', 'Three'])
         })
      })

      describe('when a child is added', () => {
         describe('when adding at the end', () => {
            it('should generate a patch that adds the child and sets its serial', () => {
               const schema = b.string().list()
               const field1 = schema.create()
               field1.ϟvalue = ['One', 'Two', 'Three']
               const field2 = field1.ϟcloneTheWholeTree()

               field1.ϟvalue.push('ADDED')

               const patches = field1.ϟgeneratePatches(field2) as Field_list_patch<Z.String>[]

               field2.ϟapplyPatches(patches)
               expectJSON(field2.ϟvalue as any[]).toEqual(['One', 'Two', 'Three', 'ADDED'])
               expect(field2.ϟserial.keys).toEqual(field1.ϟserial.keys as any)
               expect(field2.ϟserial.items_).toEqual(field1.ϟserial.items_ as any)

               expect(patches).toEqual([
                  {
                     op: 'insert',
                     fieldPath: '$',
                     fieldType: 'list',
                     key: field1.items[3]!.ϟmountKey as Field_list_ItemID,
                     order: [
                        field1.items[0]!.ϟmountKey as Field_list_ItemID,
                        field1.items[1]!.ϟmountKey as Field_list_ItemID,
                        field1.items[2]!.ϟmountKey as Field_list_ItemID,
                        field1.items[3]!.ϟmountKey as Field_list_ItemID,
                     ],
                     value: {
                        $: 'str',
                        value: 'ADDED',
                     },
                  },
               ])
            })

            it('should place the element at the end, with other inserted element', () => {
               const schema = b.string().list()
               const field1 = schema.create()
               field1.ϟvalue = ['One']
               const field2 = field1.ϟcloneTheWholeTree()

               field1.ϟvalue.push('NEW ELEMENT')

               const patches = field1.ϟgeneratePatches(field2) as Field_list_patch<Z.String>[]

               field2.push('INSERTED')
               field2.ϟapplyPatches(patches)
               expectJSON(field2.ϟvalue).toEqual(['One', 'INSERTED', 'NEW ELEMENT'])

               expect(patches).toEqual([
                  {
                     op: 'insert',
                     fieldPath: `$`,
                     fieldType: 'list',
                     order: [
                        field1.items[0]!.ϟmountKey as Field_list_ItemID,
                        field1.items[1]!.ϟmountKey as Field_list_ItemID,
                     ],
                     key: field1.items[1]!.ϟmountKey as Field_list_ItemID,
                     value: {
                        $: 'str',
                        value: 'NEW ELEMENT',
                     },
                  },
               ])
            })
         })

         describe('when adding an element that already exists', () => {
            it("should ignore the patch and don't do anything", () => {
               const schema = b.string().list()
               const field1 = schema.create()
               field1.ϟvalue = ['One', 'Two', 'Three']

               const field2 = field1.ϟcloneTheWholeTree()

               field1.ϟvalue.push('ADDED')

               const mountKeysBeforeMessingWithPatches = [...field1.ϟserial.keys!]

               // Generating a patch for field2
               const patches = field1.ϟgeneratePatches(field2)

               // But applying the patch to field1
               field1.ϟapplyPatches(patches)

               expectJSON(field1.ϟvalue).toEqual(['One', 'Two', 'Three', 'ADDED'])
               expect(field1.ϟserial).toEqual({
                  $: 'list',
                  items_: [
                     { $: 'str', value: 'One' },
                     { $: 'str', value: 'Two' },
                     { $: 'str', value: 'Three' },
                     { $: 'str', value: 'ADDED' },
                  ],
                  keys: mountKeysBeforeMessingWithPatches,
               })
            })
         })

         describe('when adding in the middle', () => {
            it('should generate a patch that adds the child in the middle and sets its serial', () => {
               const schema = b.string().list()
               const field1 = schema.create()
               field1.ϟvalue = ['One', 'Two', 'Three']
               const field2 = field1.ϟcloneTheWholeTree()

               field1.addItem({ at: 1, value: 'NEW ELEMENT' })

               const patches = field1.ϟgeneratePatches(field2)

               field2.ϟapplyPatches(patches)
               expectJSON(field2.ϟvalue).toEqual(['One', 'NEW ELEMENT', 'Two', 'Three'])
               expect(field2.ϟserial.keys).toEqual(field1.ϟserial.keys as any)
               expect(field2.ϟserial.items_).toEqual(field1.ϟserial.items_ as any)
            })

            it('should correctly handle when the patched field has removed a child before', () => {
               const schema = b.string().list()

               const field1 = schema.create()
               field1.ϟvalue = ['One', 'Two']

               const field2 = field1.ϟcloneTheWholeTree()

               field1.addItem({ at: 1, value: 'NEW ELEMENT' })

               const patches = field1.ϟgeneratePatches(field2)

               field2.removeItemAt(0)
               field2.ϟapplyPatches(patches)

               expectJSON(field2.ϟvalue as string[]).toEqual(['NEW ELEMENT', 'Two'])
               expect(field2.ϟserial.keys as any[]).toEqual([
                  field2.items[0]!.ϟmountKey,
                  field2.items[1]!.ϟmountKey,
               ])
            })

            it('should correctly handle when the patched field has removed a child after', () => {
               const schema = b.string().list()

               const field1 = schema.create()
               field1.ϟvalue = ['One', 'Two']

               const field2 = field1.ϟcloneTheWholeTree()

               field1.addItem({ at: 1, value: 'NEW ELEMENT' })

               const patches = field1.ϟgeneratePatches(field2)

               field2.removeItemAt(1)
               field2.ϟapplyPatches(patches)

               expectJSON(field2.ϟvalue).toEqual(['One', 'NEW ELEMENT'])
               expect(field2.ϟserial.keys as any[]).toEqual([
                  field2.items[0]!.ϟmountKey,
                  field2.items[1]!.ϟmountKey,
               ])
            })
         })
      })
   })

   describe('create perf', () => {
      describe('without a serial', () => {
         describe('without a default length', () => {
            it('should create the field with the empty serial and not patch it', () => {
               const patchSerial = vitest.spyOn(Field_list.prototype, 'ϟpatchSerial')
               const S = b.string_().list_()
               const E = S.create()

               expect(patchSerial).not.toHaveBeenCalled()
               expect(E.ϟserial).toBe(S.defaultSerial)
            })
         })

         describe('with a default length', () => {
            it('should create the field with the default length and patch it', () => {
               const patchSerial = vitest.spyOn(Field_list.prototype, 'ϟpatchSerial')
               const S = b.string_().list({ defaultLength: 3 })
               const E = S.create()

               expect(patchSerial).not.toHaveBeenCalled()
               expect(E.ϟserial).toBe(S.defaultSerial)
            })

            describe('when the target field has a default value', () => {
               it('should create the field with the default length and patch it', () => {
                  const patchSerial = vitest.spyOn(Field_list.prototype, 'ϟpatchSerial')
                  const S = b.string({ default: 'DEFAULT' }).list({ defaultLength: 3 })
                  const E = S.create()

                  expect(patchSerial).not.toHaveBeenCalled()
                  expect(E.ϟserial).toBe(S.defaultSerial)
               })
            })
         })

         describe('optional', () => {
            it('should not patch any serial', () => {
               const optionalPatchSerial = vitest.spyOn(Field_optional.prototype, 'ϟpatchSerial')
               const listPatchSerial = vitest.spyOn(Field_list.prototype, 'ϟpatchSerial')
               const stringPatchSerial = vitest.spyOn(Field_string.prototype, 'ϟpatchSerial')

               const S = b.string().list().optional()
               const E = S.create()

               expect(optionalPatchSerial).not.toHaveBeenCalled()
               expect(listPatchSerial).not.toHaveBeenCalled()
               expect(stringPatchSerial).not.toHaveBeenCalled()

               expect(E.ϟserial).toBe(S.defaultSerial)
            })
         })
      })
   })
})
