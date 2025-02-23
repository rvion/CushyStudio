import type { CSchema } from '../../model/CSchema'
import type { CodegenOpts } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { reaction } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// a field with a schema that is null is always considered unset
// value is

// #region CONFIG TYPE
type Field_dynamic_ownConfig<A extends CSchema> = {
   /**
    * if the schema have an ID, the serial is re-used
    * this function will be run in a mobx reaction.
    */
   childSchema: (self: Field_dynamic<A>) => A | null
   onSchemaChange?: (p: Field_dynamic_transition<A>) => void
}
export type Field_dynamic_transition<A extends CSchema> = {
   prevSchema: A | null
   prevField: A['$field'] | null
   nextSchema: A | null
}

// #region SERIAL TYPE
type Field_dynamic_ownSerial<A extends CSchema> = {
   $: 'dynamic'
   child?: A['$serial']
   dynamicSchemaId?: string
}

// #region VALUE TYPE
export type Field_dynamic_value<A extends CSchema> = A['$value']
export type Field_dynamic_unchecked<A extends CSchema> = A['$unchecked'] | null

// #region $FieldType
export interface Field_dynamic<A extends CSchema> {
   $type: 'dynamic'
   $ownConfig: Field_dynamic_ownConfig<A>
   $ownSerial: Field_dynamic_ownSerial<A>
   $value: A['$value']
   $setValue: A['$setValue']
   $unchecked: Field_dynamic_unchecked<A>
   $child: A['$field']
   $opts: unknown
   $ownPatch: Patch<'dynamic'>
}

// #region STATE
export class Field_dynamic<A extends CSchema> extends Field {
   // #region TYPE
   static readonly type: 'dynamic' = 'dynamic'
   static readonly emptySerial: Field_dynamic<any>['serial'] = { $: 'dynamic' }
   static override migrateSerial(): undefined {}
   static codeForTypescriptValue = (
      config: Field_dynamic<any /* 🔴 */>['$config'],
      opts: CodegenOpts,
   ): string => {
      // AHA ! Que faire !
      return '<🔥DYNAMIC🔥>'
   }
   dynamicSchema: A | null = null

   /** this schema */
   child!: A['$field'] | null

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_dynamic<A>>,
      initialMountKey: string,
      serial?: Field_dynamic<A>['$serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)

      const cleanup = reaction(
         () => this.schema.config.childSchema(this),
         (nextSchema: A | null) => {
            // 1. same exact schema => we abort
            const prevSchema = this.dynamicSchema
            if (nextSchema === prevSchema) return

            // 2. we assign the new schema
            this.dynamicSchema = nextSchema
            if (nextSchema == null) {
               this.child = null
               // WE DON'T TOUCH THE SERIAL FOR NOW !
               // THAT'S ALMOST THE POINT OF THAT FIELD.
               return
            }
            this.runInTransaction(() => {
               this.RECONCILE({
                  mountKey: 'child',
                  existingChild: this.child,
                  correctChildSchema: nextSchema,
                  targetChildSerial: serial?.child,
                  attach: (child) => {
                     this.child = child
                     this.patchSerial((draft) => void (draft.child = child.serial))
                  },
               })
            })
         },
         { fireImmediately: true },
      )
      this.disposeFns.push(cleanup)
   }

   // #region serial
   protected setOwnSerial(next: this['$serial']): void {
      this.assignNewSerial(next)

      if (next.child && this.dynamicSchema)
         this.RECONCILE({
            mountKey: 'child',
            existingChild: this.child,
            correctChildSchema: this.dynamicSchema,
            targetChildSerial: next?.child,
            attach: (child) => {
               this.child = child
               this.patchSerial((draft) => void (draft.child = child.serial))
            },
         })
   }

   // #region UI
   override get actualWidgetToDisplay(): Field {
      return this.child?.actualWidgetToDisplay ?? this
   }

   // #region Validation
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return []
   }

   get isOwnSet(): boolean {
      return (
         this.child != null && //
         this.dynamicSchema != null
      )
   }

   get hasChanges(): boolean {
      return this.child?.hasChanges ?? false
   }

   override get indentChildren(): number {
      return 0
   }

   override get summary(): string {
      return this.child?.summary ?? ''
   }

   // #region children
   override _acknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
      if (mountKey === 'child') {
         const didChange = this.patchSerial((draft) => void (draft.child = serial))
         return didChange
      }
      throw new Error(`[❌] invalid mountKey: ${mountKey}`)
   }

   override getChildrenSerialPath(): string {
      return 'child'
   }

   override get childrenAll(): A['$field'][] {
      if (this.child == null) return []
      return [this.child]
   }
   override get childrenActive(): A['$field'][] {
      if (this.child == null) return []
      return [this.child]
   }

   override get subFieldsWithKeys(): KeyedField[] {
      if (this.child == null) return []
      return [{ key: 'child', field: this.child }]
   }

   // #region value
   override set(x: A['$setValue']): this {
      const child = this.child
      if (child == null) return this // throw new Error(`[❌] child is null`)
      this.runInTransaction(() => {
         child.set(x)
      })
      return this
   }

   get value(): Field_dynamic_value<A> {
      return this.value_or_fail
   }

   set value(val: Field_dynamic_value<A>) {
      const child = this.child
      if (child == null) return // throw new Error(`[❌] child is null`)
      this.runInTransaction(() => {
         child.value = val
      })
   }

   get value_or_fail(): Field_dynamic_value<A> {
      if (this.child == null) throw new Error(`[❌] Field_dynamic.value_or_fail: child is null`)
      return this.child?.value_or_fail
   }

   /** this field has no `zero` value; it crashes when child is not set */
   get value_or_zero(): Field_dynamic_value<A> {
      if (this.child == null) throw new Error(`[❌] Field_dynamic.value_or_zero: child is null`)
      return this.child?.value_or_zero
   }

   /** unchecked is child.unchecked or null */
   get value_unchecked(): Field_dynamic_unchecked<A> {
      return this.child?.value_unchecked ?? null
   }

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_dynamic)) return false
      if ((this.child == null) != (other.child == null)) return false
      if (this.child == null || other.child == null) return true

      return this.child.isValueEqual(other.child)
   }

   public override readonly patchedSerialPaths: string[] = ['dynamicSchemaId']
}

// DI
registerFieldClass('dynamic', Field_dynamic)
