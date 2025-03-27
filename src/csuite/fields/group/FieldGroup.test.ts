import { _getAdministration, isObservableProp } from 'mobx'
import { afterEach, describe, expect, it, vitest } from 'vitest'

import { expectJSON } from '../../model/TESTS/utils/expectJSON'
import { simpleBuilder as b } from '../../simple/SimpleFactory'
import { Field_group, type Field_group_serial } from './FieldGroup'

describe('FieldGroup', () => {
   afterEach(() => {
      vitest.restoreAllMocks()
   })

   it('work properly with set', () => {
      class Opt {
         constructor(
            public uid: string,
            public lable: string,
         ) {}
      }
      // $      @ link
      // b      @ group
      // leads  @ group
      // extra  @ list
      // ZezVdi @ group
      // name   @ str
      // const S = b.with(b.string(), () =>
      const S = b.fields({
         a: b
            .selectOne<Opt, string>({
               values: ['a', 'b', 'c'].map((v) => new Opt(v, v)),
               getIdFromValue: (v: Opt) => v.uid,
               getValueFromId: (id: string) => new Opt(id, id),
               getOptionFromId: (v: string) => ({ id: v, label: v, value: new Opt(v, v) }),
            })
            .optional()
            .list(),
      })
      // )
      const E = S.create()
      expectJSON(E.value).toEqual({ a: [] })
      E.set({ a: ['a', null, 'c'] })
      expectJSON(E.value).toEqual({
         a: [{ lable: 'a', uid: 'a' }, null, { lable: 'c', uid: 'c' }],
      })
   })
   it('should support apply defaultValue from config to set complex nested values', () => {
      const S1 = b.fields(
         {
            num: b.number({ default: 10 }),
            str: b.string({ default: 'A' }),
         },
         { default: { num: 20, str: 'B' } },
      )
      expectJSON(S1.create().value).toEqual({ num: 20, str: 'B' })
      const S2 = b.fields(
         {
            x: b.number({ default: 10 }),
            xx: b.fields({
               y: b.string({ default: 'A' }),
               yy: b.fields({
                  z: b.boolean({ default: false }),
               }),
            }),
         },
         { default: { x: 20, xx: { y: 'B', yy: { z: true } } } },
      )
      expectJSON(S2.create().value).toEqual({ x: 20, xx: { y: 'B', yy: { z: true } } })
      // TODO: move that elsewhere
      // const S2 = b.int().list({ default: [1, 2, 3] })
      // expectJSON(S2.create().value).toEqual([1, 2, 3])
   })

   it('contains child serial in its serial even if child is not set', () => {
      const S1 = b.fields({
         num: b.number_(),
         str: b.string_(),
      })

      const __serial = undefined // { $: 'group', values_: { num: { $: 'number' }, str: { $: 'str' } } }
      const _acknowledgeNewChildSerial = vitest.spyOn(Field_group.prototype, 'ܮacknowledgeNewChildSerial')
      const E1 = S1.create(__serial)
      expect(E1._.num.serial).toEqual({ $: 'number' })
      expect(E1.serial).toEqual({
         $: 'group',
         values_: {
            num: { $: 'number' },
            str: { $: 'str' },
         },
      })
      expect(_acknowledgeNewChildSerial).toHaveBeenCalledTimes(2)
   })

   it('are practical to use', () => {
      const S1 = b.fields({
         baz: b.fields({
            qux: b.string({ default: '🔵' }),
         }),
      })
      const E1 = S1.create()
      expect(E1._.baz._.qux).toEqual(E1.fields.baz.fields.qux)
      // |      ^   ^
      // |     capital letter automatically added the the field
      // |
      // | 🟢 AFTER : E1.Baz.Qux
      // | ❌ BEFORE: E1.fields.baz.fields.qux
      // |               ~~~~~~     ~~~~~~
      // |
      // | this is SO GOOD because capital letters
      // | are displayed first in the autocompletion,
      // | which is what we want on group fields
   })

   // it is applies to class hierarchies
   describe('mobx observability', () => {
      it('is working', () => {
         const S1 = b.fields({})

         // first work
         const E1 = S1.create()
         const E1Ann = _getAdministration(E1).appliedAnnotations_
         // expect(Object.keys(E1Ann).length).toBeGreaterThan(100)
         expect(isObservableProp(E1, 'id')).toBe(false)
         expect(isObservableProp(E1, 'schema')).toBe(false)
         expect(E1.numFields).toBe(0)
         expect(E1.constructor).toBe(Field_group)
         expect(isObservableProp(E1, 'numFields')).toBe(true)

         // second fail
         const E2 = S1.create()
         const E2Ann = _getAdministration(E2).appliedAnnotations_
         // expect(Object.keys(E2Ann).length).toBeGreaterThan(100)
         expect(isObservableProp(E2, 'id')).toBe(false)
         expect(isObservableProp(E2, 'schema')).toBe(false)
         expect(E2.numFields).toBe(0)
         expect(E2.constructor).toBe(Field_group)
         expect(isObservableProp(E2, 'numFields')).toBe(true)

         // TEST TO WRITE
         // .Foo on schema 1
         // .Bar on schema 2
      })
   })

   describe('structural sharing', () => {
      it('works', () => {
         type T = {
            num: Z.Number
            str: Z.String
         }

         const S1 = b.fields({
            num: b.number(),
            str: b.string(),
         })

         const ser1: Field_group_serial<T> = {
            $: 'group',
            values_: {
               num: { $: 'number', value: 10 },
               str: { $: 'str', value: 'A' },
            },
         }

         const ser2: Field_group_serial<T> = {
            $: 'group',
            values_: {
               num: { $: 'number', value: 20 },
               str: { $: 'str', value: 'B' },
            },
         }

         const E1 = S1.create(ser1)
         expect(E1.value).toEqual({ num: 10, str: 'A' })
         expect(E1.serial === ser1).toBeTruthy()
         // expect(E1.__version__).toBe(1)
         // expect(E1._.num.__version__).toBe(1)
         // expect(E1._.str.__version__).toBe(1)

         E1.setSerial(ser2)
         expect(E1.value).toEqual({ num: 20, str: 'B' })
         expect(E1.serial === ser2).toBeTruthy()
         // expect(E1.__version__).toBe(2)
         // expect(E1._.num.__version__).toBe(2)
         // expect(E1._.str.__version__).toBe(2)

         E1.setSerial(ser2)
         E1.setSerial(ser2)
         E1.setSerial(ser2)
         E1.setSerial(ser2)
         // expect(E1.__version__).toBe(2)
         // expect(E1._.num.__version__).toBe(2)

         E1.value.num = 30
         // expect(E1.__version__).toBe(3) // <- changed
         // expect(E1._.num.__version__).toBe(3)
         // expect(E1._.str.__version__).toBe(2) // <- not changed
      })
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are undefined', () => {
            const field = b
               .fields({
                  title: b.string({}),
               })
               .create()
            const field2 = b
               .fields({
                  title: b.string({}),
               })
               .create()

            expect(field.isValueEqual(field2)).toBe(true)
         })

         it('should return true if both fields are equal', () => {
            const field = b
               .fields({
                  title: b.string({}),
               })
               .create()
            field.value.title = 'One'
            const field2 = b
               .fields({
                  title: b.string({}),
               })
               .create()
            field2.value.title = 'One'

            expect(field.isValueEqual(field2)).toBe(true)
         })

         it('should return true if values are equal but fields are declared in a different order', () => {
            const field = b
               .fields({
                  title: b.string({}),
                  description: b.string({}),
               })
               .create()
            field.value.title = 'One'
            field.value.description = 'DESCRIPTION'
            const field2 = b
               .fields({
                  description: b.string({}),
                  title: b.string({}),
               })
               .create()
            field2.value.title = 'One'
            field2.value.description = 'DESCRIPTION'

            expect(field.isValueEqual(field2)).toBe(true)
         })
      })

      describe('difference', () => {
         it('should return false if both fields are different', () => {
            const field = b
               .fields({
                  title: b.string({}),
               })
               .create()
            field.value.title = 'One'
            const field2 = b
               .fields({
                  title: b.string({}),
               })
               .create()
            field2.value.title = 'Two'

            expect(field.isValueEqual(field2)).toBe(false)
         })

         it('should return false if keys are different', () => {
            const field = b
               .fields({
                  title: b.string({}),
               })
               .create()
            field.value.title = 'One'
            const field2 = b
               .fields({
                  title2: b.string({}),
               })
               .create()
            field2.value.title2 = 'One'

            expect(field.isValueEqual(field2 as any)).toBe(false)
         })

         it('should return false if there is a missing key', () => {
            const field = b
               .fields({
                  title: b.string({}),
               })
               .create()
            field.value.title = 'One'
            const field2 = b
               .fields({
                  title: b.string({}),
                  title2: b.string({}),
               })
               .create()
            field2.value.title = 'One'

            expect(field.isValueEqual(field2 as any)).toBe(false)
         })

         it('should return false if types are different', () => {
            const field = b
               .fields({
                  title: b.string({}),
               })
               .create()
            field.value.title = 'One'
            const field2 = b.string().create()
            field2.value = 'One'

            expect(field.isValueEqual(field2 as any)).toBe(false)
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      it('should generate patches only for modified children', () => {
         const schema = b.group({
            items: {
               title: b.string(),
               description: b.string(),
            },
         })

         const field1 = schema.create()
         field1.value.title = 'One'
         field1.value.description = 'DESCRIPTION'

         const field2 = schema.create()
         field2.value.title = 'Two'
         field2.value.description = 'DESCRIPTION'

         const patches = field1.generatePatches(field2)

         field2.value.description = 'DESCRIPTION MODIFIED'
         field2.ܮapplyPatches(patches)

         expect(field2.value.title).toBe('One')
         expect(field2.value.description).toBe('DESCRIPTION MODIFIED')
      })
   })

   describe('create perf', () => {
      describe('without a default value', () => {
         it('should use the defaultSerial and not patch it', () => {
            const schema = b.fields({
               title: b.string_(),
               description: b.string_(),
            })

            const field = schema.create()

            expect(field.serial).toBe(schema.defaultSerial)
         })
      })

      describe('with a default value', () => {
         it('should use the default value as the serial', () => {
            const schema = b.fields(
               {
                  title: b.string(),
                  description: b.string(),
               },
               {
                  default: {
                     title: 'One',
                     description: 'DESCRIPTION',
                  },
               },
            )

            const field = schema.create()

            expect(field.serial).toBe(schema.defaultSerial)
         })
      })
   })
})
