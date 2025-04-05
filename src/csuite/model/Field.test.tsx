import type { Patch } from './Patch'
import type { Repository } from './Repository'
import type { Problem_Ext } from './Validation'

import { describe, expect, it } from 'vitest'

import { CSchema } from './CSchema'
import { Field } from './Field'

type Field_dummy_serial = { $: string; value?: string; deepValue?: { str: string; num: number } }

interface Field_dummy extends Field {
   '{type}': any
   '{ownConfig}': {}
   '{ownSerial}': Field_dummy_serial
   '{value}': string
   '{setValue}': string
   '{unchecked}': Maybe<string>
   '{child}': never
   '{opts}': unknown
   '{ownPatch}': Patch
}

class Field_dummy extends Field {
   static readonly codeForTypescriptValue = (): string => '0'
   static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])
   static generateSerial(
      value: Maybe<Field_dummy['{value}']>,
      config: Field_dummy['{config}'],
   ): Field_dummy['{serial}'] {
      if (value == null) return this.unsetSerial

      return {
         $: 'dummy',
         value,
      }
   }

   override get zValue(): string {
      return this.zValue_or_fail
   }
   set zValue(value: string) {
      this.zPatchInTransaction((draft) => {
         draft.value = value
      })
   }

   override get zValue_or_fail(): string {
      if (this.zValue_unchecked == null) throw new Error('Fail')
      return this.zValue_unchecked
   }
   override get zValue_or_zero(): string {
      return this.zValue_unchecked ?? ''
   }
   override get zValue_unchecked(): Maybe<string> {
      return this.zSerial.value
   }

   override zIsValueEqual(other: Field): boolean {
      return this.zValue_unchecked === other.zValue_unchecked
   }
   protected override zSetOwnSerial(serial: Field_dummy_serial): void {
      this.zAssignNewSerial(serial)
   }
   override get zHasChanges(): boolean {
      return true
   }
   override zOwnTypeSpecificProblems: Problem_Ext
   override zOwnConfigSpecificProblems: Problem_Ext
   override get zIsOwnSet(): boolean {
      return this.zValue_unchecked !== undefined
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

         field1.zValue = 'abc'
         field2.zValue = 'abc'

         const patches = field1.zGeneratePatches(field2)
         expect(patches).toEqual([])
      })

      it('should generate a patch if the values are different', () => {
         const schema = dummy()
         const field1 = schema.create()
         const field2 = schema.create()

         field1.zValue = 'abc'
         field2.zValue = 'def'

         const patches = field1.zGeneratePatches(field2) as Patch[]
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

         field2.zValue = 'def'

         const patches = field1.zGeneratePatches(field2) as Patch[]
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

         field1.zValue = 'abc'

         const patches = field1.zGeneratePatches(field2) as Patch[]
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
            field.zValue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'replace',
                  fieldPath: '$',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
                  value: 'def',
               },
            ]

            field.zApplyPatches(patches)

            expect(field.zValue).toBe('def')
         })

         it('should not apply the patch if the path is different', () => {
            const schema = dummy()
            const field = schema.create()
            field.zValue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'replace',
                  fieldPath: '$.child',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
                  value: 'def',
               },
            ]

            field.zApplyPatches(patches)

            expect(field.zValue).toBe('abc')
         })
      })

      describe('remove', () => {
         it('should unset the value if the patch is a remove', () => {
            const schema = dummy()
            const field = schema.create()
            field.zValue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'remove',
                  fieldPath: '$',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
               },
            ]

            field.zApplyPatches(patches)

            expect(field.zSerial.value).toBeUndefined()
         })
      })

      describe('add', () => {
         it('should set the value if the patch is an add and the value is unset', () => {
            const schema = dummy()
            const field = schema.create()
            field.zValue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'add',
                  fieldPath: '$',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
                  value: 'def',
               },
            ]

            field.zApplyPatches(patches)

            expect(field.zValue).toBe('def')
         })

         // 🔶 this is questionnable
         it('should set the value if the patch is an add and the value is set', () => {
            const schema = dummy()
            const field = schema.create()
            field.zValue = 'abc'
            const patches: Patch[] = [
               {
                  op: 'add',
                  fieldPath: '$',
                  fieldType: 'dummy' as any,
                  serialPath: 'value',
                  value: 'def',
               },
            ]

            field.zValue = 'ghi'

            field.zApplyPatches(patches)

            expect(field.zValue).toBe('def')
         })
      })
   })
})
