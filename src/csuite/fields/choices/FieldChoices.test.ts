import { beforeEach, describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleFactory as f } from '../../index'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'

const r = f.repository
describe('FieldChoices', () => {
   describe('create from serial', () => {
      it('works when only specifying branches', () => {
         type Model = S.SChoices<{ foo: S.SString; bar: S.SNumber }>
         const schema = b.choices({ foo: b.string(), bar: b.int() })
         const serial: Model['$Serial'] = {
            $: 'choices',
            branches: { bar: true },
         }
         const E = schema.create(serial)

         // serial should have been completed, since values was missing
         expect(E.serial === serial).toBeFalse()
         expect(E.serial).toEqual({
            $: 'choices',
            branches: { bar: true },
            values: { bar: { $: 'number', value: 0 } },
         })
      })

      it('works when only specifying values', () => {
         type Model = S.SChoices<{ foo: S.SString; bar: S.SNumber }>
         const schema = b.choices({ foo: b.string(), bar: b.int() })
         const serial: Model['$Serial'] = {
            $: 'choices',
            values: { bar: { $: 'number', value: 0 } },
         }
         const E = schema.create(serial)

         // serial should have been completed, since values was missing
         expect(E.serial === serial).toBeFalse()
         expect(E.serial).toEqual({
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
         expectJSON(E2.value).toEqual({})
      })
      it('works without default - Single', () => {
         const SingleNoDefault = b.choice({
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
         })

         const E1 = SingleNoDefault.create()
         expectJSON(E1.value).toEqual({ foo: 'yo' })
      })

      it('works WITH default - Multi', () => {
         const E1 = Multi.create()
         expect(E1.toValueJSON()).toEqual({ baz: '' })
         expect(E1.serial).toMatchObject({
            values: {
               baz: { value: '' },
            },
         })
      })

      it('works WITH default - Single', () => {
         const E2 = Single.create()
         expect(E2.toValueJSON()).toEqual({ baz: '' })
         expect(E2.serial).toMatchObject({
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
         expectJSON(E1.value).toEqual({ baz: '' })

         const serial = {
            $: 'choices' as const,
            branches: { baz: true, foo: true, bar: true },
            values: {
               baz: { $: 'str' as const, value: '🔵' },
               foo: { $: 'str' as const, value: '🟢' },
               bar: {
                  $: 'list' as const,
                  items_: [
                     { $: 'number' as const, value: 1 },
                     { $: 'number' as const, value: 2 },
                     { $: 'number' as const, value: 3 },
                  ],
               },
            },
         } satisfies (typeof Multi)['$Serial']

         E1.setSerial(serial)
         expect(E1.serial === serial).toBeTrue()
         // expect(E1.value).toBe(2)
         expectJSON(E1.value).toEqual({ foo: '🟢', bar: [1, 2, 3], baz: '🔵' })
         expect(E1.serial).toMatchObject(serial)
      })

      it('should work with the values_ property (backward compatibility)', () => {
         const E1 = Multi.create()
         expectJSON(E1.value).toEqual({ baz: '' })

         const serial = {
            $: 'choices' as const,
            branches: { baz: true },
            //    V (legacy underscore)
            values_: { baz: { $: 'str' as const, value: '🔵' } },
         } as any

         E1.setSerial(serial)
         expect(E1.serial === serial).toBeFalse() // because of migration
         expect(E1.serial).toMatchObject({
            $: 'choices',
            branches: { baz: true },
            values: { baz: { $: 'str', value: '🔵' } },
         })
         expectJSON(E1.value).toEqual({ baz: '🔵' })
      })

      it('should assign the serial if the branch is active', () => {
         const E1 = Multi.create()
         const serial: (typeof Multi)['$Serial'] = {
            $: 'choices',
            branches: { baz: true },
            values: { baz: { $: 'str', value: '🔵' } },
         }

         E1.setSerial(serial)
         expect(E1.serial === serial).toBeTrue()
         expectJSON(E1.value).toEqual({ baz: '🔵' })
         expect(E1.serial).toMatchObject(serial)
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
            E1.setSerial(serial)
            expect(E1.serial === serial).toBeTrue()
            expectJSON(E1.value).toEqual({})
         })

         it('should not activate the branch', () => {
            const E1 = MultiNoDefault.create()
            E1.setSerial(serial)
            expect(E1.serial.branches).toEqual({})
         })

         describe('when the field is not instanciated', () => {
            it('should not instanciate the field', () => {
               const E1 = MultiNoDefault.create()

               E1.setSerial(serial)
               expect(E1.repo.fieldCount).toBe(1)
            })

            it('should NOT deep clone the value', () => {
               const E1 = MultiNoDefault.create()

               E1.setSerial(serial)
               expect(E1.serial.values?.baz === serial.values.baz).toBeTrue()
            })
         })

         it('should keep the serial when we disable children via setSerial', () => {
            const E1 = MultiNoDefault.create()
            const activeSerial: (typeof E1)['$Serial'] = {
               $: 'choices',
               branches: { baz: true },
               values: { baz: { $: 'str', value: '🔵' } },
            }
            const unactiveSerial: (typeof E1)['$Serial'] = {
               $: 'choices',
               branches: {},
               values: { baz: { $: 'str', value: '🟢' } },
            }
            E1.setSerial(activeSerial)
            E1.setSerial(unactiveSerial)
            expect(E1.serial).toMatchObject(unactiveSerial)
            expect(E1.childrenAll).toHaveLength(0)
            expect(E1.value).toEqual({})
         })

         it('should unset the value if deactivating without a value for the field', () => {
            const E1 = MultiNoDefault.create()
            E1.setSerial({
               $: 'choices' as const,
               branches: { baz: true },
               values: { baz: { $: 'str' as const, value: '🔵' } },
            })
            E1.setSerial({
               $: 'choices' as const,
               branches: {},
               values: {},
            })
            expect(E1.serial.values).toEqual({})
            expect(E1.value).toEqual({})
         })
      })
   })

   describe('enableBranch', () => {
      describe('Multi', () => {
         it('should activate the branch and instanciate the child field', () => {
            const E1 = Multi.create()
            E1.enableBranch('foo')
            expect(E1.serial).toMatchObject({
               branches: { foo: true, baz: true },
               values: {
                  foo: { $: 'str' as const, value: 'yo' },
                  baz: { $: 'str' as const, value: '' },
               },
            })
            expect(E1.childrenAll).toHaveLength(2)
         })
      })

      describe('Single', () => {
         it('should deactivate the current branch', () => {
            const E1 = Single.create()
            E1.enableBranch('foo')
            expect(E1.serial).toMatchObject({
               branches: { foo: true },
               values: {
                  foo: { $: 'str' as const, value: 'yo' },
                  baz: { $: 'str' as const, value: '' },
               },
            })
            expect(E1.childrenAll).toHaveLength(1)
         })
      })
   })

   describe('disableBranch', () => {
      describe('Multi', () => {
         it('should keep the value inside the serial when disabling a branch', () => {
            const E1 = Multi.create()

            E1.setSerial({
               $: 'choices' as const,
               branches: { baz: true },
               values: { baz: { $: 'str' as const, value: '🔵' } },
            })

            E1.disableBranch('baz')

            expect(E1.serial).toMatchObject({
               branches: {},
               values: { baz: { $: 'str' as const, value: '🔵' } },
            })
         })

         it('should remove the value', () => {
            const E1 = Multi.create()
            E1.setSerial({
               $: 'choices' as const,
               branches: { baz: true },
               values: { baz: { $: 'str' as const, value: '🔵' } },
            })
            E1.disableBranch('baz')
            expect(E1.value).toEqual({})
         })
      })
   })

   describe('setValue', () => {
      describe('Multi', () => {
         it('works', () => {
            const E1 = Multi.create()
            expectJSON(E1.value).toEqual({ baz: '' })
            E1.value.baz = 'coucou'
            expectJSON(E1.value).toEqual({ baz: 'coucou' })
         })

         it('can enable branches', () => {
            const E1 = Multi.create()
            expectJSON(E1.value).toEqual({ baz: '' })
            E1.value.foo = 'glop'
            expectJSON(E1.value).toEqual({ baz: '', foo: 'glop' })
         })
      })
      describe('Single', () => {
         it('works', () => {
            const E1 = Single.create()
            expectJSON(E1.value).toEqual({ baz: '' })
            E1.value.baz = 'coucou'
            expectJSON(E1.value).toEqual({ baz: 'coucou' })
         })

         it('can enable branches', () => {
            const E1 = Single.create()
            expectJSON(E1.value).toEqual({ baz: '' })
            E1.value.foo = 'glop'
            expectJSON(E1.value).toEqual({ foo: 'glop' })
            expectJSON(E1.serial).toEqual({
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

   // STRUCTURAL SHARING --------------
   it.skip('generate a new serial for each field', () => {
      // const E1 = Multi.create()
      // const E2 = Multi.create(E1.serial)
      // // same shape
      // expect(E1.items.length).toBe(3)
      // expect(E1.serial).toEqual(E2.serial)
      // expect(E1.at(1)!.serial).toEqual(E2.at(1)!.serial)
      // // different refs
      // expect(E1.serial === E2.serial).toBe(false)
      // expect(E1.at(1)!.serial === E2.at(1)!.serial).toBe(false)
   })

   // EFFECTS -------------------------
   it.skip('doesnt apply serial effect nor value effect on instanciation ', () => {
      // 🔴 TODO
   })
})
