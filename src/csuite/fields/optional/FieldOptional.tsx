import type { CSchema } from '../../model/CSchema'
import type { CodegenOpts, FieldConstructor, SchemaDictWithPaths } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem, Problem_Ext } from '../../model/Validation'

import { observable } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { isProbablySomeFieldSerial, registerFieldClass } from '../WidgetUI.DI'

// #region Config
export type Field_optional_config<T extends CSchema = CSchema> = Field_optional<T>['::Config']
type Field_optional_ownConfig<T extends CSchema = CSchema> = {
   /**
    * @recommended
    * On most codebase, we except the schema builder methods to always pick a default.
    * not having default will possibly yield unset fields.
    *
    * On field creation without serial:
    * - when either `true` or `false`, field will always be initialized
    * - when undefined
    *    - reseting the field will set the child to null
    *    - accessing the child will not crash
    */
   startActive?: boolean

   /** child schema; schema you want  to make optional */
   schema: T
}

// #region Serial
export type Field_optional_serial<T extends CSchema = CSchema> = Field_optional<T>['::Serial']
type Field_optional_ownSerial<T extends CSchema = CSchema> = Field_optional_ownSerialV2<T>

// ------------------------------------------------------------------------
// before 2025-02-24, the optional serial was like that:
// it was bad because people doing postgres queries on serial had to use
// trickery like that:
type Field_optional_ownSerialV1<T extends CSchema = CSchema> = {
   $: 'optional'
   child?: Maybe<T['::Serial']>
   active?: boolean
}
// ------------------------------------------------------------------------
// adter 2025-02-24, the optional serial is like that:
type Field_optional_ownSerialV2<T extends CSchema = CSchema> = {
   $: 'optional'
   y?: T['::Serial'] | undefined // when active
   n?: T['::Serial'] | undefined // when not active
}
// ------------------------------------------------------------------------

// #region Value
export type Field_optional_value<T extends CSchema = CSchema> =
   // Value from the child field
   | T['::Value']
   // Set value (inactive)
   | null
export type Field_optional_SetValue<T extends CSchema = CSchema> = T['::Setvalue'] | undefined | null

// #region Types
export interface Field_optional<T extends CSchema = CSchema> {
   ['::Type']: 'optional'
   ['::OwnConfig']: Field_optional_ownConfig<T>
   ['::OwnSerial']: Field_optional_ownSerial<T>
   ['::Value']: Field_optional_value<T>
   ['::Setvalue']: Field_optional_SetValue<T>
   ['::Unchecked']: Field_optional_value<T>
   ['::Child']: T['::Field']
   ['::Opts']: unknown
   ['::OwnPatch']: Patch<'optional'>
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
   static override migrateSerial(prev: object): Maybe<Field_optional['::Serial']> {
      // for now, code here is not executed
      if (isOptionalSerialV1(prev)) {
         const { $, active, child, ...rest } = prev

         const serial: Field_optional['::Serial'] = { $: 'optional', ...rest }
         const child_ = child ?? undefined
         if (active) serial.y = child_
         else serial.n = child_
         return serial
         // return {
         //    $: 'optional',
         //    y: active ? (child ?? undefined) : undefined,
         //    n: active ? undefined : (child ?? undefined),
         //    ...rest,
         // }
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
   static unsetSerial: Field_optional['::Serial'] = { $: 'optional' }
   static generateSerial(
      value: Maybe<Field_optional<CSchema>['::Value']>,
      config: Field_optional<CSchema>['::Config'],
   ): Field_optional<CSchema>['::Serial'] {
      // use default
      if (value === undefined) {
         const startActive = config.startActive
         if (startActive == null) return this.unsetSerial

         const childSerial = config.schema.generateSerial(undefined)
         if (startActive) return { $: 'optional', y: childSerial }
         else return { $: 'optional', n: childSerial }
      }

      // user want to explicity generate a serial fo
      // r a null value
      if (value == null) {
         return { $: 'optional', n: config.schema.generateSerial(undefined) }
      }

      // user want to generate a serial for a non-null value
      return { $: 'optional', y: config.schema.generateSerial(value) }
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
   override get zActualWidgetToDisplay(): Field {
      return this.child.zActualWidgetToDisplay
   }

   /** so optional fields do not increase nesting twice */
   override get zIndentChildren(): number {
      return 0
   }

   // #region Serial
   protected zSetOwnSerial(next: Field_optional_serial<T>): void {
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
      // |     next = produce(next, (draft: this['::Serial']) => {
      // |         draft.active = true
      // |     })
      // | }
      // | ```

      // > 2. assign
      // > 3.1 EITHER (when unset): apply default (with reconcile if need be)
      // > 2.3.    OR (when set)  : just reconcile

      this.zAssignNewSerial(next)

      // when is not set
      const startActive = this.zConfig.startActive
      if (startActive != null && next.y == null && next.n == null) {
         this.zPatchSerial((draft) => {
            if (startActive) draft.y = this.zConfig.schema.defaultSerial
            else draft.n = this.zConfig.schema.defaultSerial
         })
      }

      if ('y' in next || 'n' in next) {
         this.__initializeChild(next?.y ?? next?.n)
      }
   }

   /** must always be run within a runInTransaction */
   private __initializeChild(targetChildSerial: Maybe<T['::Serial']>): void {
      this.zRECONCILE({
         mountKey: 'child',
         existingChild: this.child,
         correctChildSchema: this.zConfig.schema,
         targetChildSerial,
         attach: (child) => {
            this.child = child
         },
      })
   }

   get zIsOwnSet(): boolean {
      // 💬 2024-09-02 rvion:
      // | e.g. choice().optional()
      // | when activating the choice, we can't necessarily pick an option
      // | so the optional node is transitively not-set.
      if ('y' in this.zSerial || 'n' in this.zSerial) return true
      return false
   }

   // #region Changes
   get zHasChanges(): boolean {
      // active by default
      if (this.zConfig.startActive) {
         if (!this.isActive) return true
         return this.child.zHasChanges
      }
      // unactive by default
      else {
         if (!this.isActive) return false
         return true
      }
   }

   // #region Problems
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // 🦀 I think we might need to override this here since we probably don't want
   // to return the child's problems if the optional is not active
   // Or maybe we do ? But then we should not be relying on that to determine validity
   override get zAllErrorsIncludingChildrenErrors(): Problem[] {
      if (!this.isActive) return []
      return super.zAllErrorsIncludingChildrenErrors
   }

   // #region Children
   @observable.ref accessor child!: T['::Field']

   getChildIfActive(): Maybe<T['::Field']> {
      return this.isActive ? this.child : null
   }

   override zAcknowledgeNewChildSerial(mountKey: string, childSerial: any): boolean {
      if (mountKey !== 'child') throw new Error(`❌ invalid mountKey (${mountKey} for serial)`)
      if (this.isActive && this.zSerial.y === childSerial) return false
      if (!this.isActive && this.zSerial.n === childSerial) return false

      const didChange = this.zPatchSerial((draft) => {
         if (this.isActive) draft.y = childSerial
         else draft.n = childSerial
      })
      return didChange
   }

   get childOrThrow(): T['::Field'] {
      if (this.child == null) throw new Error('❌ optional active but child is null')
      return this.child
   }

   override zGetChildrenSerialPath(branchName: 'child'): string {
      return `y`
   }

   override get zChildrenAll(): Field[] {
      return [this.child]
   }

   override get zChildrenActive(): Field[] {
      if (!this.isActive) return []
      return [this.child]
   }

   override get zSubFieldsWithKeys(): KeyedField[] {
      return this.isActive ? [{ key: 'child', field: this.child }] : []
   }

   // #region Value
   override zSet(next: Field_optional_value<T>): this {
      if (next == null) {
         this.setActive(false)
      } else {
         this.setActive(true)
         this.child.zSet(next)
      }
      return this
   }
   override zGetSetValue(): this['::Setvalue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.child.zGetSetValue()
   }

   get zValue(): Field_optional_value<T> {
      return this.zValue_or_fail
   }

   set zValue(next: Field_optional_SetValue<T>) {
      if (next == null) {
         this.setActive(false)
         return
      } else {
         this.setActive(true)
         this.child.zValue = next
      }
   }

   get zValue_or_fail(): Field_optional_value<T> {
      if (this.zSerial.y === undefined && this.zSerial.n === undefined)
         throw new Error('Field_optional.zValue_or_fail: not set')
      if (this.isActive === false) return null
      return this.childOrThrow.zValue_or_fail
   }

   get zValue_or_zero(): Field_optional_value<T> {
      if (this.zSerial.y === undefined && this.zSerial.n === undefined) return undefined
      if (this.isActive === false) return null
      return this.childOrThrow.zValue_or_zero
   }

   get zValue_unchecked(): Field_optional_value<T> {
      if (this.zSerial.y === undefined && this.zSerial.n === undefined) return undefined
      if (this.isActive === false) return null
      return this.childOrThrow.zValue_unchecked
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_optional)) return false

      const thisActive = this.isActive
      const otherActive = other.isActive
      // both are inactive => consider them equal
      if (!thisActive && !otherActive) return true
      // Only one of them is inactive -> they are not equal
      if (thisActive !== otherActive) return false
      // both are active -> compare their child
      return this.child.zIsValueEqual(other.child)
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
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            if (value) {
               draft.y = this.child.zSerial
               delete draft.n
            } else {
               draft.n = this.child.zSerial
               delete draft.y
            }
         })

         // update child collapsed state if need be
         if (value) {
            if (this.child.zIsCollapsed) this.child.zSetCollapsed(false)
         } else this.child.zSetCollapsed(true)
      })
   }

   get isActive(): boolean {
      return this.zSerial.y != null
   }

   set isActive(value: boolean) {
      this.setActive(value)
   }

   /**
    * similar to reset,
    * except when inactive by default => only reset the active property
    * 👉 the base reset() will always reset the child
    * 👉 this resetFast will only reset the child is active.
    */
   resetFast(): void {
      // active by default
      if (this.zConfig.startActive) {
         if (!this.isActive) this.setActive(true)
         if (this.child.zHasChanges) this.child.zReset()
         return
      }
      // inactive by default
      else {
         if (this.isActive) this.setActive(false)
         return
      }
   }

   override zRandomize(): void {
      const active = Math.random() < 0.5
      this.setActive(active)
      if (active) this.child.zRandomize()
   }
}

// DI
registerFieldClass('optional', Field_optional)
Field_optional satisfies FieldConstructor<Field_optional<any>>
