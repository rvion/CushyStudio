import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { reaction } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// a field with a schema that is null is always considered unset
// value is

// #region CONFIG TYPE
export type Field_dynamic_config<A extends BaseSchema> = FieldConfig<
   {
      /**
       * if the schema have an ID, the serial is re-used
       * this function will be run in a mobx reaction.
       */
      childSchema: (self: Field_dynamic<A>) => A | null
      onSchemaChange?: (p: Field_dynamic_transition<A>) => void
   },
   Field_dynamic_types<A>
>
export type Field_dynamic_transition<A extends BaseSchema> = {
   prevSchema: A | null
   prevField: A['$Field'] | null
   nextSchema: A | null
}

// #region SERIAL TYPE
export type Field_dynamic_serial<A extends BaseSchema> = FieldSerial<{
   $: 'dynamic'
   child?: A['$Serial']
   dynamicSchemaId?: string
}>

// #region VALUE TYPE
export type Field_dynamic_value<A extends BaseSchema> = A['$Value']
export type Field_dynamic_unchecked<A extends BaseSchema> = A['$Unchecked'] | null

// #region $FieldType
export type Field_dynamic_types<A extends BaseSchema> = {
   $Type: 'dynamic'
   $Config: Field_dynamic_config<A>
   $Serial: Field_dynamic_serial<A>
   $Value: A['$Value']
   $Field: Field_dynamic<A>
   $Unchecked: Field_dynamic_unchecked<A>
   $Child: A
   $Reflect: Field_dynamic_types<A>
}

// #region STATE
export class Field_dynamic<A extends BaseSchema> //
   extends Field<Field_dynamic_types<A>>
{
   // #region TYPE
   static readonly type: 'dynamic' = 'dynamic'
   static readonly emptySerial: Field_dynamic_serial<any> = { $: 'dynamic' }
   static migrateSerial(): undefined {}

   dynamicSchema: A | null = null

   /** this schema */
   child!: A['$Field'] | null

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_dynamic<A>>,
      initialMountKey: string,
      serial?: Field_dynamic_serial<A>,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial, {})

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
   protected setOwnSerial(next: Field_dynamic_serial<A>): void {
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
   DefaultHeaderUI: undefined = undefined
   DefaultBodyUI: undefined = undefined

   get actualWidgetToDisplay(): Field {
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

   get indentChildren(): number {
      return 0
   }

   get summary(): string {
      return this.child?.summary ?? ''
   }

   // #region children
   _acknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
      if (mountKey === 'child') {
         const didChange = this.patchSerial((draft) => void (draft.child = serial))
         return didChange
      }
      throw new Error(`[❌] invalid mountKey: ${mountKey}`)
   }

   get childrenAll(): A['$Field'][] {
      if (this.child == null) return []
      return [this.child]
   }
   get childrenActive(): A['$Field'][] {
      if (this.child == null) return []
      return [this.child]
   }

   get subFieldsWithKeys(): KeyedField[] {
      if (this.child == null) return []
      return [{ key: 'child', field: this.child }]
   }

   // #region value
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
}

// DI
registerFieldClass('dynamic', Field_dynamic)
