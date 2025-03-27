import type { Patch } from './Patch'
import type { Repository } from './Repository'
import type { Problem_Ext } from './Validation'

import { describe, expect, it } from 'vitest'

import { CSchema } from './CSchema'
import { Field } from './Field'

type Field_dummy_serial = { $: string; value?: string; deepValue?: { str: string; num: number } }

interface Field_dummy extends Field {
   ['Ҩtype']: any
   ['ҨownConfig']: {}
   ['ҨownSerial']: Field_dummy_serial
   ['Ҩvalue']: string
   ['Ҩsetvalue']: string
   ['Ҩunchecked']: Maybe<string>
   ['Ҩchild']: never
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch
}

class Field_dummy extends Field {
   static readonly codeForTypescriptValue = (): string => '0'
   static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])
   static generateSerial(
      value: Maybe<Field_dummy['Ҩvalue']>,
      config: Field_dummy['Ҩconfig'],
   ): Field_dummy['Ҩserial'] {
      if (value == null) return this.unsetSerial

      return {
         $: 'dummy',
         value,
      }
   }

   override get ϟvalue(): string {
      return this.ϟvalue_or_fail
   }
   set ϟvalue(value: string) {
      this.ϟpatchInTransaction((draft) => {
         draft.value = value
      })
   }

   override get ϟvalue_or_fail(): string {
      if (this.ϟvalue_unchecked == null) throw new Error('Fail')
      return this.ϟvalue_unchecked
   }
   override get ϟvalue_or_zero(): string {
      return this.ϟvalue_unchecked ?? ''
   }
   override get ϟvalue_unchecked(): Maybe<string> {
      return this.ϟserial.value
   }

   override ϟisValueEqual(other: Field): boolean {
      return this.ϟvalue_unchecked === other.ϟvalue_unchecked
   }
   protected override ϟsetOwnSerial(serial: Field_dummy_serial): void {
      this.ϟassignNewSerial(serial)
   }
   override get ϟhasChanges(): boolean {
      return true
   }
   override ϟownTypeSpecificProblems: Problem_Ext
   override ϟownConfigSpecificProblems: Problem_Ext
   override get ϟisOwnSet(): boolean {
      return this.ϟvalue_unchecked !== undefined
   }
   static readonly type = 'dummy'
   private static readonly unsetSerial = { $: 'dummy' }
   static override readonly migrateSerial = (): undefined => undefined

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_dummy>,
      initialMountKey: string,
      serial?: Field_dummy_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }
}

function dummy(): CSchema<Field_dummy> {
   return CSchema.new<Field_dummy>(Field_dummy, {})
}

describe('Field', () => {
   describe('generatePatches', () => {
      it('should not generate any patch if the values are the same', () => {
         const schema = dummy()
         const field1 = schema.create()
         const field2 = schema.create()

         field1.ϟvalue = 'abc'
         field2.ϟvalue = 'abc'

         const patches = field1.ϟgeneratePatches(field2)
         expect(patches).toEqual([])
      })

      it('should generate a patch if the values are different', () => {
         const schema = dummy()
         const field1 = schema.create()
         const field2 = schema.create()

         field1.ϟvalue = 'abc'
         field2.ϟvalue = 'def'

         const patches = field1.ϟgeneratePatches(field2) as Patch[]
         expect(patches).toEqual([
            {
               op: 'replace',
               fieldPath: '$',
               fieldType: 'dummy' as any,
               serialPath: 'value',
               value: 'abc',
            },
         ])
      })

      it('should generate a remove patch when unsetting the value', () => {
         const schema = dummy()
         const field1 = schema.create()
         const field2 = schema.create()

         field2.ϟvalue = 'def'

         const patches = field1.ϟgeneratePatches(field2) as Patch[]
         expect(patches).toEqual([
            {
               op: 'remove',
               fieldPath: '$',
               fieldType: 'dummy' as any,
               serialPath: 'value',
            },
         ])
      })

      it('should generate an add patch when setting the value', () => {
         const schema = dummy()
         const field1 = schema.create()
         const field2 = schema.create()

         field1.ϟvalue = 'abc'

         const patches = field1.ϟgeneratePatches(field2) as Patch[]
         expect(patches).toEqual([
            {
               op: 'add',
               fieldPath: '$',
               fieldType: 'dummy' as any,
               serialPath: 'value',
               value: 'abc',
            },
         ])
      })
   })

   describe('applyPatches', () => {
      describe('replace', () => {
         it('should replace the serial with the new one', () => {
            const schema = dummy()
            const field = schema.create()
            field.ϟvalue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'replace',
                  fieldPath: '$',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
                  value: 'def',
               },
            ]

            field.ϟapplyPatches(patches)

            expect(field.ϟvalue).toBe('def')
         })

         it('should not apply the patch if the path is different', () => {
            const schema = dummy()
            const field = schema.create()
            field.ϟvalue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'replace',
                  fieldPath: '$.child',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
                  value: 'def',
               },
            ]

            field.ϟapplyPatches(patches)

            expect(field.ϟvalue).toBe('abc')
         })
      })

      describe('remove', () => {
         it('should unset the value if the patch is a remove', () => {
            const schema = dummy()
            const field = schema.create()
            field.ϟvalue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'remove',
                  fieldPath: '$',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
               },
            ]

            field.ϟapplyPatches(patches)

            expect(field.ϟserial.value).toBeUndefined()
         })
      })

      describe('add', () => {
         it('should set the value if the patch is an add and the value is unset', () => {
            const schema = dummy()
            const field = schema.create()
            field.ϟvalue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'add',
                  fieldPath: '$',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
                  value: 'def',
               },
            ]

            field.ϟapplyPatches(patches)

            expect(field.ϟvalue).toBe('def')
         })

         // 🔶 this is questionnable
         it('should set the value if the patch is an add and the value is set', () => {
            const schema = dummy()
            const field = schema.create()
            field.ϟvalue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'add',
                  fieldPath: '$',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
                  value: 'def',
               },
            ]

            field.ϟvalue = 'ghi'

            field.ϟapplyPatches(patches)

            expect(field.ϟvalue).toBe('def')
         })
      })
   })
})
