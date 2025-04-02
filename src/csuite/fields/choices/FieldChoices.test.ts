import type { Field_list_ItemID } from '../list/FieldList'

import { beforeEach, describe, expect, it } from 'vitest'

import { expectJSON } from '../../model/TESTS/utils/expectJSON'
import { simpleBuilder as b, simpleFactory as f } from '../../simple/SimpleFactory'

const r = f.repository
describe('FieldChoices', () => {
   describe('create from serial', () => {
      it('works when only specifying branches', () => {
         type Model = Z.Choices<{ foo: Z.String; bar: Z.Number }>
         const schema = b.choices({ foo: b.string(), bar: b.int() })
         const serial: Model['z$Serial'] = {
            $: 'choices',
            branches: { bar: true },
         }
         const E = schema.create(serial)

         // serial should have been completed, since values was missing
         expect(E.zSerial === serial).toBeFalsy()
         expect(E.zSerial).toEqual({
            $: 'choices',
            branches: { bar: true },
            values: { bar: { $: 'number', value: 0 } },
         })
      })

      it('works when only specifying values', () => {
         type Model = Z.Choices<{ foo: Z.String; bar: Z.Number }>
         const schema = b.choices({ foo: b.string(), bar: b.int() })
         const serial: Model['z$Serial'] = {
            $: 'choices',
            values: { bar: { $: 'number', value: 0 } },
         }
         const E = schema.create(serial)

         // serial should have been completed, since values was missing
         expect(E.zSerial === serial).toBeFalsy()
         expect(E.zSerial).toEqual({
            $: 'choices',
            branches: { bar: true },
            values: { bar: { $: 'number', value: 0 } },
         })
      })
   })
   beforeEach(() => r.reset())
   // VVVVV should not be needed since we have some after each that is globally injected via preload.
   // afterEach(() => simpleRepo.reset())
   const Multi = b
      .choices({
         foo: b.string({ default: 'yo' }),
         bar: b.int().list({ defaultLength: 3 }),
         baz: b.string(),
      })
      .withConfig({ default: 'baz' })

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
         expect(E1.zSerial).toMatchObject({
            values: {
               baz: { value: '' },
            },
         })
      })

      it('works WITH default - Single', () => {
         const E2 = Single.create()
         expect(E2.zToValueJSON()).toEqual({ baz: '' })
         expect(E2.zSerial).toMatchObject({
            values: {
               baz: { value: '' },
            },
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
            branches: { baz: true, foo: true, bar: true },
            values: {
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
         } satisfies (typeof Multi)['z$Serial']

         E1.zSetSerial(serial)
         expect(E1.zSerial === serial).toBeTruthy()
         // expect(E1.value).toBe(2)
         expectJSON(E1.zValue).toEqual({ foo: '🟢', bar: [1, 2, 3], baz: '🔵' })
         expect(E1.zSerial).toMatchObject(serial)
      })

      it('should work with the values_ property (backward compatibility)', () => {
         const E1 = Multi.create()
         expectJSON(E1.zValue).toEqual({ baz: '' })

         const serial = {
            $: 'choices' as const,
            branches: { baz: true },
            //    V (legacy underscore)
            values_: { baz: { $: 'str' as const, value: '🔵' } },
         } as any

         E1.zSetSerial(serial)
         expect(E1.zSerial === serial).toBeFalsy() // because of migration
         expect(E1.zSerial).toMatchObject({
            $: 'choices',
            branches: { baz: true },
            values: { baz: { $: 'str', value: '🔵' } },
         })
         expectJSON(E1.zValue).toEqual({ baz: '🔵' })
      })

      it('should assign the serial if the branch is active', () => {
         const E1 = Multi.create()
         const serial: (typeof Multi)['z$Serial'] = {
            $: 'choices',
            branches: { baz: true },
            values: { baz: { $: 'str', value: '🔵' } },
         }

         E1.zSetSerial(serial)
         expect(E1.zSerial === serial).toBeTruthy()
         expectJSON(E1.zValue).toEqual({ baz: '🔵' })
         expect(E1.zSerial).toMatchObject(serial)
      })

      describe('disabled branch', () => {
         const MultiNoDefault = b.choices_({
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
         })

         const serial = {
            $: 'choices' as const,
            branches: {
               /* baz: false */
            },
            values: { baz: { $: 'str' as const, value: '🔵' } },
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
            expect(E1.zSerial.branches).toEqual({})
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
               expect(E1.zSerial.values?.baz === serial.values.baz).toBeTruthy()
            })
         })

         it('should keep the serial when we disable children via setSerial', () => {
            const E1 = MultiNoDefault.create()
            const activeSerial: (typeof E1)['z$Serial'] = {
               $: 'choices',
               branches: { baz: true },
               values: { baz: { $: 'str', value: '🔵' } },
            }
            const unactiveSerial: (typeof E1)['z$Serial'] = {
               $: 'choices',
               branches: {},
               values: { baz: { $: 'str', value: '🟢' } },
            }
            E1.zSetSerial(activeSerial)
            E1.zSetSerial(unactiveSerial)
            expect(E1.zSerial).toMatchObject(unactiveSerial)
            expect(E1.zChildrenAll).toHaveLength(0)
            expect(E1.zValue).toEqual({})
         })

         it('should unset the value if deactivating without a value for the field', () => {
            const E1 = MultiNoDefault.create()
            E1.zSetSerial({
               $: 'choices' as const,
               branches: { baz: true },
               values: { baz: { $: 'str' as const, value: '🔵' } },
            })
            E1.zSetSerial({
               $: 'choices' as const,
               branches: {},
               values: {},
            })
            expect(E1.zSerial.values).toEqual({})
            expect(E1.zValue).toEqual({})
         })
      })
   })

   describe('enableBranch', () => {
      describe('Multi', () => {
         it('should activate the branch and instanciate the child field', () => {
            const E1 = Multi.create()
            E1.enableBranch('foo')
            expect(E1.zSerial).toMatchObject({
               branches: { foo: true, baz: true },
               values: {
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
            E1.enableBranch('foo')
            expect(E1.zSerial).toMatchObject({
               branches: { foo: true },
               values: {
                  foo: { $: 'str' as const, value: 'yo' },
                  baz: { $: 'str' as const, value: '' },
               },
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
               branches: { baz: true },
               values: { baz: { $: 'str' as const, value: '🔵' } },
            })

            E1.disableBranch('baz')

            expect(E1.zSerial).toMatchObject({
               branches: {},
               values: { baz: { $: 'str' as const, value: '🔵' } },
            })
         })

         it('should remove the value', () => {
            const E1 = Multi.create()
            E1.zSetSerial({
               $: 'choices' as const,
               branches: { baz: true },
               values: { baz: { $: 'str' as const, value: '🔵' } },
            })
            E1.disableBranch('baz')
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
               branches: { foo: true },
               values: {
                  baz: { $: 'str', value: '' },
                  foo: { $: 'str', value: 'glop' },
               },
            })
         })
      })
   })

   // EFFECTS -------------------------
   it.skip('doesnt apply serial effect nor value effect on instanciation', () => {
      // 🔴 TODO
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

            const field1 = schema.create()
            field1.zValue = { a: 'ok' }

            const field2 = schema.create()
            field2.zValue = { b: 'ok' }

            const patches = field1.zGeneratePatches(field2)
            field2.zApplyPatches(patches)

            expectJSON(field2.zValue).toEqual({ a: 'ok' })
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
            field1.zSetValue({
               foo: 'foo',
            })

            const field2 = schema.create()
            field2.zSetValue({
               foo: 'foo',
               bar: 'bar',
            })

            const patches = field1.zGeneratePatches(field2)

            field2.zApplyPatches(patches)
            expectJSON(field2.zValue).toEqual({
               foo: 'foo',
            })
            expect(field2.zSerial).toEqual({
               $: 'choices',
               branches: { foo: true },
               values: {
                  foo: {
                     $: 'str',
                     value: 'foo',
                  },
                  bar: {
                     $: 'str',
                     value: 'bar',
                  },
               },
            })
         })
      })
   })
})

function toJ(value: any): any {
   return JSON.parse(JSON.stringify(value))
}
