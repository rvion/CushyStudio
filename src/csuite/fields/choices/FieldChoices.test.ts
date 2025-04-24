import type { FieldSerial_CommonProperties } from '../../model/FieldSerial'
import type { Field_list_ItemID } from '../list/FieldList'
import type { Field_choices_ownSerial_old1, Field_choices_ownSerial_old2 } from './FieldChoices'

import { beforeEach, describe, expect, it } from 'vitest'

import { simpleBuilder as b, simpleFactory as f } from '../../index'
import { getBuilder } from '../../model/b'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'

const r = f.repository
describe('FieldChoices', () => {
   describe('create from serial', () => {
      const b = getBuilder()
      type K = { foo: Z.String; bar: Z.Number }
      const S = b.choice<K>({
         foo: b.string(),
         bar: b.int(),
      })
      it('can migrate from serial old1', () => {
         type SOld1 = FieldSerial_CommonProperties & Field_choices_ownSerial_old1<K>
         const serial: SOld1 = {
            $: 'choices',
            branches: { foo: true },
            values_: { foo: { $: 'str', value: 'yo' } },
         }
         const E = S.create(serial)
         expect(E.zSerial).toEqual({
            $: 'choices',
            y: { foo: { $: 'str', value: 'yo' } },
         })

         E.zEnableBranch('bar')
         expect(E.zSerial).toEqual({
            $: 'choices',
            y: { bar: { $: 'number', value: 0 } },
            n: { foo: { $: 'str', value: 'yo' } },
         })
      })

      it('can migrate from serial old2', () => {
         type SOld2 = FieldSerial_CommonProperties & Field_choices_ownSerial_old2<K>
         const serial: SOld2 = {
            $: 'choices',
            branches: { foo: true },
            values: { foo: { $: 'str', value: 'yo' } },
         }
         const E = S.create(serial)
         expect(E.zSerial).toEqual({ $: 'choices', y: { foo: { $: 'str', value: 'yo' } } })
      })

      it('works when specifying neither `y` nor `n`', () => {
         type Model = Z.Choices<{ foo: Z.String; bar: Z.Number }>
         const schema = b.choices({ foo: b.string(), bar: b.int() }, { default: 'bar' })
         const serial: Model['{serial}'] = { $: 'choices' }
         const E = schema.create(serial)

         // serial should have been completed, since values was missing
         expect(E.zSerial === serial).toBeFalsy()
         expect(E.zSerial).toEqual({
            $: 'choices',
            y: { bar: { $: 'number', value: 0 } },
         })
      })

      it('works when only specifying y branch', () => {
         type Model = Z.Choices<{ foo: Z.String; bar: Z.Number }>
         const schema = b.choices({ foo: b.string(), bar: b.int() })
         const serial: Model['{serial}'] = {
            $: 'choices',
            y: { bar: { $: 'number', value: 0 } },
         }
         const E = schema.create(serial)

         // serial should have been completed, since values was missing
         expect(E.zSerial).toEqual(serial)
      })
   })
   beforeEach(() => r.reset())
   const Multi = b.choices(
      {
         foo: b.string({ default: 'yo' }),
         bar: b.int().list({ defaultLength: 3 }),
         baz: b.string(),
      },
      { default: 'baz' },
   )

   const Single = b.choice(
      {
         foo: b.string({ default: 'yo' }),
         bar: b.int().list({ defaultLength: 3 }),
         baz: b.string(),
      },
      { default: 'baz' },
   )

   // INSTANCIATION -------------------
   describe('instanciation', () => {
      it('works without default - Multi', () => {
         const MultiNoDefault = b.choices({
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
         })
         const E2 = MultiNoDefault.create()
         expectJSON(E2.zValue).toEqual({})
      })
      it('works without default - Single', () => {
         const SingleNoDefault = b.choice({
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
         })

         const E1 = SingleNoDefault.create()
         expectJSON(E1.zValue).toEqual({ foo: 'yo' })
      })

      it('works WITH default - Multi', () => {
         const E1 = Multi.create()
         expect(E1.zToValueJSON()).toEqual({ baz: '' })
         expect(E1.zSerial).toEqual({
            $: 'choices',
            y: { baz: { $: 'str', value: '' } },
         })
      })

      it('works WITH default - Single', () => {
         const E2 = Single.create()
         expect(E2.zToValueJSON()).toEqual({ baz: '' })
         expect(E2.zSerial).toEqual({
            $: 'choices',
            y: { baz: { $: 'str', value: '' } },
         })
      })
   })

   // SET SERIAL ----------------------
   describe('setSerial', () => {
      it('works', () => {
         const E1 = Multi.create()
         expectJSON(E1.zValue).toEqual({ baz: '' })

         const serial = {
            $: 'choices' as const,

            y: {
               baz: { $: 'str' as const, value: '🔵' },
               foo: { $: 'str' as const, value: '🟢' },
               bar: {
                  $: 'list' as const,
                  keys: [
                     'UUID1' as Field_list_ItemID,
                     'UUID2' as Field_list_ItemID,
                     'UUID3' as Field_list_ItemID,
                  ],
                  items_: [
                     { $: 'number' as const, value: 1 },
                     { $: 'number' as const, value: 2 },
                     { $: 'number' as const, value: 3 },
                  ],
               },
            },
         } satisfies (typeof Multi)['{serial}']

         E1.zSetSerial(serial)
         expect(E1.zSerial === serial).toBeTruthy()
         expectJSON(E1.zValue).toEqual({ foo: '🟢', bar: [1, 2, 3], baz: '🔵' })
         expect(E1.zSerial).toEqual(serial)
      })

      it('should work with the values_ property (backward compatibility)', () => {
         const E1 = Multi.create()
         expectJSON(E1.zValue).toEqual({ baz: '' })
         const serial = {
            $: 'choices' as const,
            branches: { baz: true },
            values_: { baz: { $: 'str' as const, value: '🔵' } },
         } as any

         E1.zSetSerial(serial)
         expect(E1.zSerial === serial).toBeFalsy() // because of migration
         expect(E1.zSerial).toEqual({
            $: 'choices',

            y: { baz: { $: 'str', value: '🔵' } },
         })
         expectJSON(E1.zValue).toEqual({ baz: '🔵' })
      })

      it('should assign the serial if the branch is active', () => {
         const E1 = Multi.create()
         const serial: (typeof Multi)['{serial}'] = {
            $: 'choices',
            y: { baz: { $: 'str', value: '🔵' } },
         }

         E1.zSetSerial(serial)
         expect(E1.zSerial === serial).toBeTruthy()
         expectJSON(E1.zValue).toEqual({ baz: '🔵' })
         expect(E1.zSerial).toEqual(serial)
      })

      describe('disabled branch', () => {
         const MultiNoDefault = b.choices_({
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
         })

         const serial = {
            $: 'choices' as const,
            y: {},
            n: { baz: { $: 'str' as const, value: '🔵' } },
         }

         it('should assign the serial even if the branch is deactivated', () => {
            const E1 = MultiNoDefault.create()
            E1.zSetSerial(serial)
            expect(E1.zSerial === serial).toBeTruthy()
            expectJSON(E1.zValue).toEqual({})
         })

         it('should not activate the branch', () => {
            const E1 = MultiNoDefault.create()
            E1.zSetSerial(serial)
            expect(E1.zSerial.y).toEqual({})
         })

         describe('when the field is not instanciated', () => {
            it('should not instanciate the field', () => {
               const E1 = MultiNoDefault.create()
               E1.zSetSerial(serial)
               expect(E1.zRepo.fieldCount).toBe(1)
            })

            it('should NOT deep clone the value', () => {
               const E1 = MultiNoDefault.create()
               E1.zSetSerial(serial)
               expect(E1.zSerial.n?.baz === serial.n.baz).toBeTruthy()
            })
         })

         it('should keep the serial when we disable children via setSerial', () => {
            const E1 = MultiNoDefault.create()
            const activeSerial: (typeof E1)['{serial}'] = {
               $: 'choices',

               y: { baz: { $: 'str', value: '🔵' } },
            }
            const unactiveSerial: (typeof E1)['{serial}'] = {
               $: 'choices',
               y: {},
               n: { baz: { $: 'str', value: '🟢' } },
            }
            E1.zSetSerial(activeSerial)
            E1.zSetSerial(unactiveSerial)
            expect(E1.zSerial).toEqual(unactiveSerial)
            expect(E1.zChildrenAll).toHaveLength(0)
            expect(E1.zValue).toEqual({})
         })

         it('should unset the value if deactivating without a value for the field', () => {
            const E1 = MultiNoDefault.create()
            E1.zSetSerial({
               $: 'choices' as const,
               y: { baz: { $: 'str' as const, value: '🔵' } },
            })
            E1.zSetSerial({
               $: 'choices' as const,
               y: {},
            })
            expect(E1.zSerial.y).toEqual({})
            expect(E1.zValue).toEqual({})
         })
      })
   })

   describe('zEnableBranch', () => {
      describe('Multi', () => {
         it('should activate the branch and instanciate the child field', () => {
            const E1 = Multi.create()
            E1.zEnableBranch('foo')
            expect(E1.zSerial).toEqual({
               $: 'choices',
               y: {
                  foo: { $: 'str' as const, value: 'yo' },
                  baz: { $: 'str' as const, value: '' },
               },
            })
            expect(E1.zChildrenAll).toHaveLength(2)
         })
      })

      describe('Single', () => {
         it('should deactivate the current branch', () => {
            const E1 = Single.create()
            console.log(E1.zSerial)
            const prevBaz = E1.zSerial.y!.baz
            expect(prevBaz).toBeDefined()
            expect(prevBaz).toEqual({ $: 'str', value: '' })
            E1.zEnableBranch('foo')
            expect(E1.zSerial.n?.baz).toBe(prevBaz)
            expect(E1.zSerial).toEqual({
               $: 'choices',
               n: { baz: { $: 'str' as const, value: '' } },
               y: { foo: { $: 'str' as const, value: 'yo' } },
            })
            expect(E1.zChildrenAll).toHaveLength(1)
         })
      })
   })

   describe('disableBranch', () => {
      describe('Multi', () => {
         it('should keep the value inside the serial when disabling a branch', () => {
            const E1 = Multi.create()

            E1.zSetSerial({
               $: 'choices' as const,

               y: { baz: { $: 'str' as const, value: '🔵' } },
            })

            E1.zDisableBranch('baz')

            expect(E1.zSerial).toEqual({
               $: 'choices',
               y: {},
               n: { baz: { $: 'str' as const, value: '🔵' } },
            })
         })

         it('should remove the value', () => {
            const E1 = Multi.create()
            E1.zSetSerial({
               $: 'choices' as const,
               y: { baz: { $: 'str' as const, value: '🔵' } },
            })
            E1.zDisableBranch('baz')
            expect(E1.zValue).toEqual({})
         })
      })
   })

   describe('setValue', () => {
      describe('Multi', () => {
         it('works', () => {
            const E1 = Multi.create()
            expectJSON(E1.zValue).toEqual({ baz: '' })
            E1.zValue.baz = 'coucou'
            expectJSON(E1.zValue).toEqual({ baz: 'coucou' })
         })

         it('can enable branches', () => {
            const E1 = Multi.create()
            expectJSON(E1.zValue).toEqual({ baz: '' })
            E1.zValue.foo = 'glop'
            expectJSON(E1.zValue).toEqual({ baz: '', foo: 'glop' })
         })
      })
      describe('Single', () => {
         it('works', () => {
            const E1 = Single.create()
            expectJSON(E1.zValue).toEqual({ baz: '' })
            E1.zValue.baz = 'coucou'
            expectJSON(E1.zValue).toEqual({ baz: 'coucou' })
         })

         it('can enable branches', () => {
            const E1 = Single.create()
            expectJSON(E1.zValue).toEqual({ baz: '' })
            E1.zValue.foo = 'glop'
            expectJSON(E1.zValue).toEqual({ foo: 'glop' })
            expectJSON(E1.zSerial).toEqual({
               $: 'choices',
               n: { baz: { $: 'str', value: '' } },
               y: { foo: { $: 'str', value: 'glop' } },
            })
         })
      })
   })

   // EFFECTS -------------------------
   describe('zPreserveDisabledBranches', () => {
      it('remove disabled branches when they are disabled', () => {
         const E = b.choices({ a: b.string(), b: b.string() }, { preserveDisabledBranches: false }).create()
         expect(E.zSerial).toEqual({ $: 'choices', y: {} })
         E.zEnableBranch('a')
         expect(E.zSerial).toEqual({ $: 'choices', y: { a: { $: 'str', value: '' } } })
         E.zDisableBranch('a')
         expect(E.zSerial).toEqual({ $: 'choices', y: {} })
      })
   })
   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const SingleNoDefault = Single.withConfig({ default: undefined })
            const E1 = SingleNoDefault.create()
            const E2 = SingleNoDefault.create()

            expect(E1.zIsValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const E1 = Single.create()
            const E2 = Single.create()

            E1.zValue = { foo: 'b' }
            E2.zValue = { foo: 'b' }

            expect(E1.zIsValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const SingleNoDefault = Single.withConfig({ default: undefined })
            const E1 = SingleNoDefault.create()
            const E2 = SingleNoDefault.create()

            E1.zValue = { foo: 'a' }

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const E1 = Single.create()
            const E2 = Single.create()

            E1.zValue = { foo: 'a' }
            E2.zValue = { foo: 'b' }

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })

         it('if branches are not the same', () => {
            const E1 = Single.create()
            const E2 = Single.create()

            E1.zValue = { foo: 'a' }
            E2.zValue = { baz: 'a' }

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      describe('single choice', () => {
         it('should switch the selected branch', () => {
            const schema = b.choice({
               a: b.string(),
               b: b.string(),
            })

            const sss = schema.generateSerial({ a: 'ok' })
            expect(sss).toEqual({
               $: 'choices',
               y: { a: { $: 'str', value: 'ok' } },
            })
            const field1 = schema.createFrom({ a: 'ok' })
            expect(field1.zSerial).toEqual({
               $: 'choices',
               y: { a: { $: 'str', value: 'ok' } },
            })

            const field2 = schema.createFrom({ b: 'ok' })
            expect(field2.zValue).toEqual({ b: 'ok' })
            expect(field2.zSerial).toEqual({
               $: 'choices',
               y: { b: { $: 'str', value: 'ok' } },
            })

            const patches = field1.zGeneratePatches(field2)
            // prettier-ignore
            expect(patches).toEqual([
               {
                  fieldType: 'choices', fieldPath: '$',
                  op: 'enable', branch: 'a',
                  serial: { $: 'str', value: 'ok' },
               },
               {
                  fieldType: 'choices', fieldPath: '$',
                  op: 'disable', branch: 'b',
               },
            ])
            field2.zApplyPatches(patches)
            expect(field2.zSerial).toEqual({
               $: 'choices',
               n: { b: { $: 'str', value: 'ok' } },
               y: { a: { $: 'str', value: 'ok' } },
            })
            expectJSON(field2.zValue).toEqual({ a: 'ok' })
         })

         it('aaaa', () => {
            const schema = b.choices({
               a: b.string(),
               b: b.string(),
               c: b.string(),
            })

            const field1 = schema.createFrom({ c: 'ccc' })
            field1.zSet({ a: 'aaa' })
            expect(field1.zValue).toEqual({ a: 'aaa' })
            expect(field1.zSerial).toEqual({
               $: 'choices',
               y: { a: { $: 'str', value: 'aaa' } },
               n: { c: { $: 'str', value: 'ccc' } },
            })

            const field2 = field1.zCloneTheWholeTree()
            field2.zDisableBranch('a')
            field2.zEnableBranch('c')
            expect(field2.zValue).toEqual({ c: 'ccc' })
            expect(field2.zSerial).toEqual({
               $: 'choices',
               y: { c: { $: 'str', value: 'ccc' } },
               n: { a: { $: 'str', value: 'aaa' } },
            })

            // strict equality
            expect(field1.zSerial.y?.a).toBe(field2.zSerial.n?.a)
            expect(field1.zSerial.n?.c).toBe(field2.zSerial.y?.c)

            const patches = field1.zGeneratePatches(field2)
            // prettier-ignore
            expect(patches).toEqual([
               {
                  fieldType: 'choices', fieldPath: '$',
                  branch: 'a', op: 'enable',
               },
               {
                  fieldType: 'choices', fieldPath: '$',
                  op: 'disable', branch: 'c',
               },
            ])
            field2.zApplyPatches(patches)
            expectJSON(field2.zValue).toEqual({ a: 'aaa' })
            expect(field2.zSerial).toEqual({
               $: 'choices',
               y: { a: { $: 'str', value: 'aaa' } },
               n: { c: { $: 'str', value: 'ccc' } },
            })
         })
      })

      describe('multi choice', () => {
         it('should add a value without modifying the others', () => {
            const schema = b.choices_({
               foo: b.string(),
               bar: b.string(),
            })

            const field1 = schema.create()
            field1.zSetValue({
               foo: 'foo1',
               bar: 'bar',
            })

            const field2 = schema.create()
            field2.zSetValue({
               foo: 'foo2',
               bar: 'bar',
            })

            const patches = field1.zGeneratePatches(field2)

            expect(patches).toHaveLength(1)

            field2.zSetValue({
               foo: 'foo2',
               bar: 'bar2',
            })

            field2.zApplyPatches(patches)
            expectJSON(field2.zValue).toEqual({
               foo: 'foo1',
               bar: 'bar2',
            })
         })

         it('should activate a choice', () => {
            const schema = b.choices_({
               foo: b.string(),
               bar: b.string(),
            })

            const field1 = schema.create()
            field1.zSetValue({
               foo: 'foo',
               bar: 'bar',
            })

            const field2 = schema.create()
            field2.zSetValue({
               foo: 'foo',
            })
            const patches = field1.zGeneratePatches(field2)
            expect(patches).toEqual([
               {
                  fieldType: 'choices',
                  fieldPath: '$',
                  branch: 'bar',
                  op: 'enable',
                  serial: { $: 'str', value: 'bar' },
               },
            ])

            field2.zApplyPatches(patches)
            expectJSON(field2.zValue).toEqual({
               foo: 'foo',
               bar: 'bar',
            })
         })

         it('should deactivate a choice', () => {
            const schema = b.choices_({
               foo: b.string(),
               bar: b.string(),
            })

            const field1 = schema.create()
            field1.zSetValue({ foo: 'foo' })

            const field2 = schema.create()
            field2.zSetValue({ foo: 'foo', bar: 'bar' })

            const patches = field1.zGeneratePatches(field2)

            field2.zApplyPatches(patches)
            expectJSON(field2.zValue).toEqual({ foo: 'foo' })

            expect(field2.zSerial).toEqual({
               $: 'choices',
               y: { foo: { $: 'str', value: 'foo' } },
               n: { bar: { $: 'str', value: 'bar' } },
            })
         })
      })
   })
})
