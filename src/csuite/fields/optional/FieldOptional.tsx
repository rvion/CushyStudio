import type { CSchema } from '../../model/CSchema'
import type { AnyFieldSerial } from '../../model/EntitySerial'
import type { CodegenOpts, SchemaDictWithPaths } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem, Problem_Ext } from '../../model/Validation'

import { observable } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { isProbablySomeFieldSerial, registerFieldClass } from '../WidgetUI.DI'

// #region Config
export type Field_optional_config<T extends CSchema = CSchema> = Field_optional<T>['$config']
type Field_optional_ownConfig<T extends CSchema = CSchema> = {
   /** if true, child field will be instanciated by default */
   startActive?: boolean
   /** child schema; schema you want  to make optional */
   schema: T
}

// #region Serial
export type Field_optional_serial<T extends CSchema = CSchema> = Field_optional<T>['$serial']
type Field_optional_ownSerial<T extends CSchema = CSchema> = Field_optional_ownSerialV2<T>

// ------------------------------------------------------------------------
// before 2025-02-24, the optional serial was like that:
// it was bad because people doing postgres queries on serial had to use
// trickery like that:
// `(jsonb_path_query_first(json, '$.values_.?${fieldName} \\? (@.active == true).child') ->> 'value') :: bool`,
type Field_optional_ownSerialV1<T extends CSchema = CSchema> = {
   $: 'optional'
   child?: Maybe<T['$serial']>
   active?: boolean
}
// ------------------------------------------------------------------------
// adter 2025-02-24, the optional serial is like that:
type Field_optional_ownSerialV2<T extends CSchema = CSchema> = {
   $: 'optional'
   y?: Maybe<T['$serial']> // when active
   n?: Maybe<T['$serial']> // when not active
}
// ------------------------------------------------------------------------

// #region Value
export type Field_optional_value<T extends CSchema = CSchema> =
   // Value from the child field
   | T['$value']
   // Set value (inactive)
   | null
export type Field_optional_SetValue<T extends CSchema = CSchema> = T['$setValue'] | undefined | null

// #region Types
export interface Field_optional<T extends CSchema = CSchema> {
   $type: 'optional'
   $ownConfig: Field_optional_ownConfig<T>
   $ownSerial: Field_optional_ownSerial<T>
   $value: Field_optional_value<T>
   $setValue: Field_optional_SetValue<T>
   $unchecked: Field_optional_value<T>
   $child: T['$field']
   $opts: unknown
   $ownPatch: Patch<'optional'>
}

export function isOptionalSerialV1(serial: object): serial is Field_optional_ownSerialV1 {
   if (!isProbablySomeFieldSerial(serial)) return false
   if (serial.$ !== 'optional') return false
   if (!('active' in serial)) return false
   if (!('child' in serial)) return false
   return true
}

export function isOptionalSerialV2(serial: object): serial is Field_optional_ownSerialV2 {
   if (!isProbablySomeFieldSerial(serial)) return false
   if (serial.$ !== 'optional') return false
   if (!('y' in serial) && !('n' in serial)) return false
   return true
}

// #region State
export class Field_optional<out T extends CSchema = CSchema> extends Field {
   // #region Type
   static readonly type: 'optional' = 'optional'
   static readonly emptySerial: Field_optional_serial = { $: 'optional' }
   static override migrateSerial(prev: object): Maybe<Field_optional['$serial']> {
      // for now, code here is not executed
      if (isOptionalSerialV1(prev)) {
         const { $, active, child, ...rest } = prev
         return {
            $: 'optional',
            y: active ? child : undefined,
            n: active ? undefined : child,
            ...rest,
         }
      }
   }

   static codeForTypescriptValue = (config: Field_optional_config, opts: CodegenOpts): string => {
      const childSchema = config.schema
      const childCodeRepr = childSchema.codeForTypescriptValue(opts)
      return `Maybe<${childCodeRepr}>`
   }
   static override getChildren(config: any): SchemaDictWithPaths {
      return { child: { schema: config.schema, serialPath: 'y' } }
   }
   static override getTravels(config: any): SchemaDictWithPaths {
      const childSchema = config.schema
      const childRes = childSchema.fieldConstructor.getTravels(childSchema.config)
      const childEntries = Object.entries(childRes) as [
         string,
         { schema: CSchema; serialPath: string | null },
      ][]
      const OUT: SchemaDictWithPaths = {}
      for (const [k, v] of childEntries) {
         OUT[k] = { schema: v.schema, serialPath: `y.${v.serialPath}` }
      }
      return OUT
   }
   static generateSerial(
      value: Maybe<Field_optional<CSchema>['$value']>,
      config: Field_optional<CSchema>['$config'],
   ): Field_optional<CSchema>['$serial'] {
      if (value === undefined && (config.startActive == null || config.startActive == false))
         return {
            $: 'optional',
            n: config.schema.generateSerial(undefined),
         }

      return {
         $: 'optional',
         y: config.schema.generateSerial(value),
      }
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_optional<T>>,
      initialMountKey: string,
      serial?: Field_optional_serial<T>,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region UI
   override get actualWidgetToDisplay(): Field {
      return this.child.actualWidgetToDisplay
   }

   /** so optional fields do not increase nesting twice */
   override get indentChildren(): number {
      return 0
   }

   // #region Serial
   protected setOwnSerial(next: Field_optional_serial<T>): void {
      // new guideline for setOwnSerial:
      // > 1. normalize (via produce)

      // 💬 2024-09-11 rvion:
      // | WE CAN'T DO THIS
      // | since optional always instanciate its child,
      // | it's always going to fill serial.child, even when no
      // | default.
      // |
      // | ```
      // | // Only setting child serial is supported since 2024-09-11
      // | // it implies active true
      // | if (next.child != null && next.active == null) {
      // |     next = produce(next, (draft: this['$serial']) => {
      // |         draft.active = true
      // |     })
      // | }
      // | ```

      // > 2. assign
      // > 3.1 EITHER (when unset): apply default (with reconcile if need be)
      // > 2.3.    OR (when set)  : just reconcile

      this.assignNewSerial(next)

      // when is not set
      const startActive = this.config.startActive
      if (next.y == null && next.n == null && startActive != null) {
         this.patchSerial((draft) => {
            if (startActive) draft.y = this.config.schema.fieldConstructor.emptySerial
            else draft.n = this.config.schema.fieldConstructor.emptySerial
         })
      }

      this.RECONCILE({
         mountKey: 'child',
         existingChild: this.child,
         correctChildSchema: this.config.schema,
         targetChildSerial: next?.y ?? next?.n,
         attach: (child) => {
            this.child = child
         },
      })
   }

   get isOwnSet(): boolean {
      // 💬 2024-09-02 rvion:
      // | e.g. choice().optional()
      // | when activating the choice, we can't necessarily pick an option
      // | so the optional node is transitively not-set.
      if ('y' in this.serial || 'n' in this.serial) return true
      return false
   }

   // #region Changes
   get hasChanges(): boolean {
      // active by default
      if (this.config.startActive) {
         if (!this.isActive) return true
         return this.child.hasChanges
      }
      // unactive by default
      else {
         if (!this.isActive) return false
         return true
      }
   }

   // #region Problems
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // 🦀 I think we might need to override this here since we probably don't want
   // to return the child's problems if the optional is not active
   // Or maybe we do ? But then we should not be relying on that to determine validity
   override get allErrorsIncludingChildrenErrors(): Problem[] {
      if (!this.isActive) return []
      return super.allErrorsIncludingChildrenErrors
   }

   // #region Children
   @observable.ref accessor child!: T['$field']

   getChildIfActive(): Maybe<T['$field']> {
      return this.isActive ? this.child : null
   }

   override _acknowledgeNewChildSerial(mountKey: string, childSerial: any): boolean {
      if (mountKey !== 'child') throw new Error(`❌ invalid mountKey (${mountKey} for serial)`)
      if (this.isActive && this.serial.y === childSerial) return false
      if (!this.isActive && this.serial.n === childSerial) return false

      const didChange = this.patchSerial((draft) => {
         if (this.isActive) draft.y = childSerial
         else draft.n = childSerial
      })
      return didChange
   }

   get childOrThrow(): T['$field'] {
      if (this.child == null) throw new Error('❌ optional active but child is null')
      return this.child
   }

   override getChildrenSerialPath(branchName: 'child'): string {
      return `y`
   }

   override get childrenAll(): Field[] {
      return [this.child]
   }

   override get childrenActive(): Field[] {
      if (!this.isActive) return []
      return [this.child]
   }

   override get subFieldsWithKeys(): KeyedField[] {
      return this.isActive ? [{ key: 'child', field: this.child }] : []
   }

   // #region Value
   override set(next: Field_optional_value<T>): this {
      if (next == null) {
         this.setActive(false)
      } else {
         this.setActive(true)
         this.child.set(next)
      }
      return this
   }
   override getSetValue(): this['$setValue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.child.getSetValue()
   }

   get value(): Field_optional_value<T> {
      return this.value_or_fail
   }

   set value(next: Field_optional_SetValue<T>) {
      if (next == null) {
         this.setActive(false)
         return
      } else {
         this.setActive(true)
         this.child.value = next
      }
   }

   get value_or_fail(): Field_optional_value<T> {
      if (this.serial.y === undefined && this.serial.n === undefined)
         throw new Error('Field_optional.value_or_fail: not set')
      if (this.isActive === false) return null
      return this.childOrThrow.value_or_fail
   }

   get value_or_zero(): Field_optional_value<T> {
      if (this.serial.y === undefined && this.serial.n === undefined) return undefined
      if (this.isActive === false) return null
      return this.childOrThrow.value_or_zero
   }

   get value_unchecked(): Field_optional_value<T> {
      if (this.serial.y === undefined && this.serial.n === undefined) return undefined
      if (this.isActive === false) return null
      return this.childOrThrow.value_unchecked
   }

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_optional)) return false

      const thisActive = this.isActive
      const otherActive = other.isActive
      // both are inactive => consider them equal
      if (!thisActive && !otherActive) return true
      // Only one of them is inactive -> they are not equal
      if (thisActive !== otherActive) return false
      // both are active -> compare their child
      return this.child.isValueEqual(other.child)
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['y', 'n'])

   // #region Nullability
   get canBeSetOnOrOff(): true {
      return true
   }

   /** set the value to true */
   setOn(): void {
      this.setActive(true)
   }

   /** set the value to false */
   setOff(): void {
      this.setActive(false)
   }

   // #region Setters
   setActive(value: boolean): void {
      if (this.isActive === value) return
      this.runInTransaction(() => {
         this.patchSerial((draft) => {
            if (value) {
               draft.y = this.child.serial
               draft.n = null
            } else {
               draft.n = this.child.serial
               draft.y = null
            }
         })

         // update child collapsed state if need be
         if (value) {
            if (this.child.isCollapsed) this.child.setCollapsed(false)
         } else this.child.setCollapsed(true)
      })
   }

   get isActive(): boolean {
      return this.serial.y != null
   }
   set isActive(value: boolean) {
      this.setActive(value)
   }
   // get isInactive(): boolean {
   //    return this.serial.n != null
   // }
   // set isInactive(value: boolean) {
   //    this.setActive(!value)
   // }

   /**
    * similar to reset,
    * except when inactive by default => only reset the active property
    * 👉 the base reset() will always reset the child
    * 👉 this resetFast will only reset the child is active.
    */
   resetFast(): void {
      // active by default
      if (this.config.startActive) {
         if (!this.isActive) this.setActive(true)
         if (this.child.hasChanges) this.child.reset()
         return
      }
      // inactive by default
      else {
         if (this.isActive) this.setActive(false)
         return
      }
   }

   override randomize(): void {
      const active = Math.random() < 0.5
      this.setActive(active)
      if (active) this.child.randomize()
   }

   override get isEmpty(): boolean {
      return !this.isActive
   }
}

// DI
registerFieldClass('optional', Field_optional)
